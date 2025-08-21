// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SavingsVault
 * @dev Individual vault contract for monthly savings with penalties
 */
contract SavingsVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Vault status enum
    enum VaultStatus {
        ACTIVE,           // Vault is active and accepting payments
        WITHDRAWN_EARLY,  // User withdrew early (10% penalty applied)
        COMPLETED,        // All payments completed successfully
        TERMINATED        // Vault was terminated
    }
    
    // Payment status enum
    enum PaymentStatus {
        PENDING,          // Payment not yet made
        PAID,             // Payment made on time
        MISSED,           // Payment missed (5% penalty applied)
        DEFAULTED         // Payment defaulted
    }
    
    // Monthly payment struct
    struct MonthlyPayment {
        uint256 dueDate;
        uint256 amount;
        PaymentStatus status;
        uint256 penaltyAmount;  // 5% penalty if missed
        bool penaltyPaid;
    }
    
    // Vault struct
    struct Vault {
        address owner;
        address token;
        uint256 targetAmount;        // Total goal amount
        uint256 monthlyAmount;       // Monthly payment amount
        uint256 totalMonths;         // Total number of months
        uint256 currentBalance;      // Current amount saved
        uint256 totalPaid;           // Total amount paid by user
        uint256 totalPenalties;      // Total penalties paid
        uint256 startDate;           // Vault start date
        uint256 endDate;             // Expected completion date
        VaultStatus status;
        bool isActive;
        uint256 withdrawalTime;
        uint256 earlyWithdrawalPenalty;  // 10% penalty for early withdrawal
        uint256 returnedAmount;
    }
    
    // Vault data
    Vault public vault;
    
    // Monthly payments tracking
    mapping(uint256 => MonthlyPayment) public monthlyPayments; // month index => payment details
    uint256 public currentMonth; // Current month (1-based)
    
    // Penalty percentages
    uint256 public constant MONTHLY_DEFAULT_PENALTY = 5; // 5% for missed payments
    uint256 public constant EARLY_WITHDRAWAL_PENALTY = 10; // 10% for early withdrawal
    
    // Events
    event VaultCreated(
        address indexed owner, 
        address indexed token, 
        uint256 targetAmount, 
        uint256 monthlyAmount, 
        uint256 totalMonths,
        uint256 startDate,
        uint256 endDate
    );
    event MonthlyPaymentMade(
        address indexed owner, 
        uint256 month, 
        uint256 amount, 
        uint256 currentBalance
    );
    event MonthlyPaymentMissed(
        address indexed owner, 
        uint256 month, 
        uint256 penaltyAmount, 
        uint256 currentBalance
    );
    event EarlyWithdrawal(
        address indexed owner, 
        uint256 totalSaved, 
        uint256 penalty, 
        uint256 returned
    );
    event VaultCompleted(
        address indexed owner, 
        uint256 totalSaved, 
        uint256 totalPaid, 
        uint256 totalPenalties
    );
    event VaultTerminated(address indexed owner, uint256 timestamp);
    
    // Modifiers
    modifier onlyVaultOwner() {
        require(msg.sender == vault.owner, "Only vault owner");
        _;
    }
    
    modifier vaultActive() {
        require(vault.isActive, "Vault not active");
        _;
    }
    
    modifier vaultNotTerminated() {
        require(vault.status != VaultStatus.TERMINATED, "Vault is terminated");
        _;
    }
    
    modifier onlyActiveVault() {
        require(vault.status == VaultStatus.ACTIVE, "Vault not in active state");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _owner The vault owner
     * @param _token The token address
     * @param _targetAmount The total goal amount
     * @param _totalMonths The total number of months
     */
    constructor(
        address _owner,
        address _token,
        uint256 _targetAmount,
        uint256 _totalMonths
    ) Ownable(_owner) {
        require(_owner != address(0), "Invalid owner");
        require(_token != address(0), "Invalid token");
        require(_targetAmount > 0, "Invalid target amount");
        require(_totalMonths > 0 && _totalMonths <= 12, "Invalid months (1-12)");
        
        // Validate token is a contract
        require(_token.code.length > 0, "Token is not a contract");
        
        uint256 monthlyAmount = _targetAmount / _totalMonths;
        uint256 remainder = _targetAmount % _totalMonths;
        require(monthlyAmount > 0, "Monthly amount too small");
        
        vault = Vault({
            owner: _owner,
            token: _token,
            targetAmount: _targetAmount,
            monthlyAmount: monthlyAmount,
            totalMonths: _totalMonths,
            currentBalance: 0,
            totalPaid: 0,
            totalPenalties: 0,
            startDate: block.timestamp,
            endDate: block.timestamp + (_totalMonths * 30 days),
            status: VaultStatus.ACTIVE,
            isActive: true,
            withdrawalTime: 0,
            earlyWithdrawalPenalty: 0,
            returnedAmount: 0
        });
        
        currentMonth = 1;
        
        // Initialize monthly payment schedule with remainder on last month
        for (uint256 i = 1; i <= _totalMonths; i++) {
            uint256 paymentAmount = monthlyAmount;
            if (i == _totalMonths && remainder > 0) {
                paymentAmount += remainder;
            }
            
            monthlyPayments[i] = MonthlyPayment({
                dueDate: block.timestamp + (i * 30 days),
                amount: paymentAmount,
                status: PaymentStatus.PENDING,
                penaltyAmount: 0,
                penaltyPaid: false
            });
        }
        
        emit VaultCreated(
            _owner, 
            _token, 
            _targetAmount, 
            monthlyAmount, 
            _totalMonths,
            block.timestamp,
            vault.endDate
        );
    }
    
    /**
     * @dev Make a monthly payment
     * @param _month The month to pay for (1-based)
     */
    function makeMonthlyPayment(uint256 _month) external onlyVaultOwner vaultActive nonReentrant {
        require(_month >= 1 && _month <= vault.totalMonths, "Invalid month");
        require(monthlyPayments[_month].status == PaymentStatus.PENDING, "Payment already made or missed");
        require(block.timestamp <= monthlyPayments[_month].dueDate + 30 days, "Payment window closed");
        
        MonthlyPayment storage payment = monthlyPayments[_month];
        
        // Transfer tokens from user to vault
        IERC20(vault.token).safeTransferFrom(msg.sender, address(this), payment.amount);
        
        // Update payment status
        payment.status = PaymentStatus.PAID;
        
        // Update vault balance with overflow protection
        require(vault.currentBalance + payment.amount >= vault.currentBalance, "Overflow in currentBalance");
        require(vault.totalPaid + payment.amount >= vault.totalPaid, "Overflow in totalPaid");
        
        vault.currentBalance += payment.amount;
        vault.totalPaid += payment.amount;
        
        // Update current month if this was the current month
        if (_month == currentMonth) {
            currentMonth++;
        }
        
        // Check if vault is completed
        if (currentMonth > vault.totalMonths) {
            vault.status = VaultStatus.COMPLETED;
            vault.isActive = false;
            emit VaultCompleted(msg.sender, vault.currentBalance, vault.totalPaid, vault.totalPenalties);
        }
        
        emit MonthlyPaymentMade(msg.sender, _month, payment.amount, vault.currentBalance);
    }
    
    /**
     * @dev Process missed payment (called by owner or automated system)
     * @param _month The month that was missed
     */
    function processMissedPayment(uint256 _month) external vaultActive {
        // Allow vault owner or factory owner to process missed payments
        require(msg.sender == vault.owner || msg.sender == owner(), "Not authorized");
        require(_month >= 1 && _month <= vault.totalMonths, "Invalid month");
        require(monthlyPayments[_month].status == PaymentStatus.PENDING, "Payment not pending");
        require(block.timestamp > monthlyPayments[_month].dueDate, "Payment not yet due");
        
        MonthlyPayment storage payment = monthlyPayments[_month];
        
        // Calculate 5% penalty on monthly amount with minimum penalty
        uint256 penaltyAmount = (payment.amount * MONTHLY_DEFAULT_PENALTY) / 100;
        if (penaltyAmount == 0 && payment.amount > 0) {
            penaltyAmount = 1; // Minimum penalty of 1 wei
        }
        
        // Update payment status
        payment.status = PaymentStatus.MISSED;
        payment.penaltyAmount = penaltyAmount;
        payment.penaltyPaid = true;
        
        // Deduct penalty from current balance (if any)
        if (vault.currentBalance >= penaltyAmount) {
            vault.currentBalance -= penaltyAmount;
        } else {
            vault.currentBalance = 0;
        }
        
        // Add overflow protection for total penalties
        require(vault.totalPenalties + penaltyAmount >= vault.totalPenalties, "Overflow in totalPenalties");
        vault.totalPenalties += penaltyAmount;
        
        // Update current month
        if (_month == currentMonth) {
            currentMonth++;
        }
        
        emit MonthlyPaymentMissed(msg.sender, _month, penaltyAmount, vault.currentBalance);
    }
    
    /**
     * @dev Process all missed payments automatically
     * @param _upToMonth Process missed payments up to this month (inclusive)
     */
    function processAllMissedPayments(uint256 _upToMonth) external vaultActive {
        // Allow vault owner or factory owner to process missed payments
        require(msg.sender == vault.owner || msg.sender == owner(), "Not authorized");
        require(_upToMonth >= 1 && _upToMonth <= vault.totalMonths, "Invalid month");
        
        uint256 processedCount = 0;
        
        for (uint256 month = 1; month <= _upToMonth; month++) {
            MonthlyPayment storage payment = monthlyPayments[month];
            
            // Check if payment is pending and overdue
            if (payment.status == PaymentStatus.PENDING && 
                block.timestamp > payment.dueDate) {
                
                // Calculate 5% penalty on monthly amount with minimum penalty
                uint256 penaltyAmount = (payment.amount * MONTHLY_DEFAULT_PENALTY) / 100;
                if (penaltyAmount == 0 && payment.amount > 0) {
                    penaltyAmount = 1; // Minimum penalty of 1 wei
                }
                
                // Update payment status
                payment.status = PaymentStatus.MISSED;
                payment.penaltyAmount = penaltyAmount;
                payment.penaltyPaid = true;
                
                // Deduct penalty from current balance (if any)
                if (vault.currentBalance >= penaltyAmount) {
                    vault.currentBalance -= penaltyAmount;
                } else {
                    vault.currentBalance = 0;
                }
                
                // Add overflow protection for total penalties
                require(vault.totalPenalties + penaltyAmount >= vault.totalPenalties, "Overflow in totalPenalties");
                vault.totalPenalties += penaltyAmount;
                
                processedCount++;
                
                emit MonthlyPaymentMissed(msg.sender, month, penaltyAmount, vault.currentBalance);
            }
        }
        
        // Update current month to the next unprocessed month
        while (currentMonth <= vault.totalMonths && 
               monthlyPayments[currentMonth].status != PaymentStatus.PENDING) {
            currentMonth++;
        }
    }
    
    /**
     * @dev Withdraw early with 10% penalty
     */
    function withdrawEarly() external onlyVaultOwner onlyActiveVault nonReentrant {
        require(vault.currentBalance > 0, "No funds to withdraw");
        
        // Calculate 10% penalty on total saved amount with minimum penalty
        uint256 penaltyAmount = (vault.currentBalance * EARLY_WITHDRAWAL_PENALTY) / 100;
        if (penaltyAmount == 0 && vault.currentBalance > 0) {
            penaltyAmount = 1; // Minimum penalty of 1 wei
        }
        
        // Ensure amountToReturn doesn't underflow
        require(vault.currentBalance >= penaltyAmount, "Insufficient balance for penalty");
        uint256 amountToReturn = vault.currentBalance - penaltyAmount;
        
        // Update vault status
        vault.status = VaultStatus.WITHDRAWN_EARLY;
        vault.isActive = false;
        vault.withdrawalTime = block.timestamp;
        vault.earlyWithdrawalPenalty = penaltyAmount;
        vault.returnedAmount = amountToReturn;
        
        // Clear the balance before transfer to prevent reentrancy
        vault.currentBalance = 0;
        
        // Transfer remaining amount to user
        if (amountToReturn > 0) {
            IERC20(vault.token).safeTransfer(vault.owner, amountToReturn);
        }
        
        emit EarlyWithdrawal(msg.sender, vault.currentBalance + amountToReturn, penaltyAmount, amountToReturn);
    }
    
    /**
     * @dev Withdraw completed vault (no penalty)
     */
    function withdrawCompleted() external onlyVaultOwner nonReentrant {
        require(vault.status == VaultStatus.COMPLETED, "Vault not completed");
        require(vault.currentBalance > 0, "No funds to withdraw");
        
        uint256 amountToWithdraw = vault.currentBalance;
        
        // Clear the balance before transfer to prevent reentrancy
        vault.currentBalance = 0;
        vault.withdrawalTime = block.timestamp;
        vault.returnedAmount = amountToWithdraw;
        
        IERC20(vault.token).safeTransfer(vault.owner, amountToWithdraw);
        
        emit VaultCompleted(msg.sender, amountToWithdraw, vault.totalPaid, vault.totalPenalties);
    }
    
    /**
     * @dev Emergency withdrawal (admin only)
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        require(vault.currentBalance > 0, "No funds to withdraw");
        
        uint256 amountToWithdraw = vault.currentBalance;
        
        // Clear the balance before transfer to prevent reentrancy
        vault.currentBalance = 0;
        vault.status = VaultStatus.TERMINATED;
        vault.isActive = false;
        vault.withdrawalTime = block.timestamp;
        vault.returnedAmount = amountToWithdraw;
        
        IERC20(vault.token).safeTransfer(vault.owner, amountToWithdraw);
        
        emit VaultTerminated(vault.owner, block.timestamp);
    }
    
    // View functions
    
    /**
     * @dev Get vault information
     */
    function getVaultInfo() external view returns (
        address owner,
        address token,
        uint256 targetAmount,
        uint256 monthlyAmount,
        uint256 totalMonths,
        uint256 currentBalance,
        uint256 totalPaid,
        uint256 totalPenalties,
        uint256 startDate,
        uint256 endDate,
        VaultStatus status,
        bool isActive,
        uint256 currentMonth
    ) {
        return (
            vault.owner,
            vault.token,
            vault.targetAmount,
            vault.monthlyAmount,
            vault.totalMonths,
            vault.currentBalance,
            vault.totalPaid,
            vault.totalPenalties,
            vault.startDate,
            vault.endDate,
            vault.status,
            vault.isActive,
            currentMonth
        );
    }
    
    /**
     * @dev Get monthly payment details
     */
    function getMonthlyPayment(uint256 _month) external view returns (
        uint256 dueDate,
        uint256 amount,
        PaymentStatus status,
        uint256 penaltyAmount,
        bool penaltyPaid
    ) {
        require(_month >= 1 && _month <= vault.totalMonths, "Invalid month");
        MonthlyPayment memory payment = monthlyPayments[_month];
        return (
            payment.dueDate,
            payment.amount,
            payment.status,
            payment.penaltyAmount,
            payment.penaltyPaid
        );
    }
    
    /**
     * @dev Get vault progress percentage
     */
    function getProgressPercentage() external view returns (uint256) {
        if (vault.totalMonths == 0) return 0;
        return (currentMonth - 1) * 100 / vault.totalMonths;
    }
    
    /**
     * @dev Check if vault is completed
     */
    function isCompleted() external view returns (bool) {
        return vault.status == VaultStatus.COMPLETED;
    }
    
    /**
     * @dev Check if user can withdraw early
     */
    function canWithdrawEarly() external view returns (bool) {
        return vault.status == VaultStatus.ACTIVE && vault.currentBalance > 0;
    }
    
    /**
     * @dev Check if user can withdraw completed vault
     */
    function canWithdrawCompleted() external view returns (bool) {
        return vault.status == VaultStatus.COMPLETED && vault.currentBalance > 0;
    }
    
    /**
     * @dev Get next payment due date
     */
    function getNextPaymentDueDate() external view returns (uint256) {
        if (currentMonth > vault.totalMonths) return 0;
        return monthlyPayments[currentMonth].dueDate;
    }
    
    /**
     * @dev Get missed payments count
     */
    function getMissedPaymentsCount() external view returns (uint256) {
        uint256 missedCount = 0;
        for (uint256 i = 1; i <= vault.totalMonths; i++) {
            if (monthlyPayments[i].status == PaymentStatus.MISSED) {
                missedCount++;
            }
        }
        return missedCount;
    }
    
    /**
     * @dev Get total amount that should be paid vs actually paid
     */
    function getPaymentSummary() external view returns (
        uint256 totalShouldPay,
        uint256 totalActuallyPaid,
        uint256 totalPenaltiesPaid,
        uint256 missedPaymentsCount,
        uint256 completedPaymentsCount
    ) {
        totalShouldPay = vault.targetAmount;
        totalActuallyPaid = vault.totalPaid;
        totalPenaltiesPaid = vault.totalPenalties;
        
        for (uint256 i = 1; i <= vault.totalMonths; i++) {
            if (monthlyPayments[i].status == PaymentStatus.MISSED) {
                missedPaymentsCount++;
            } else if (monthlyPayments[i].status == PaymentStatus.PAID) {
                completedPaymentsCount++;
            }
        }
        
        return (totalShouldPay, totalActuallyPaid, totalPenaltiesPaid, missedPaymentsCount, completedPaymentsCount);
    }
}
