// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SavingsVault
 * @dev Individual vault contract for time-locked savings
 */
contract SavingsVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Vault status enum - improved for better tracking
    enum VaultStatus {
        ACTIVE,           // Vault is active and locked
        WITHDRAWN_EARLY,  // User withdrew early (penalty applied)
        COMPLETED,        // User withdrew after lock period (no penalty)
        TERMINATED        // Vault was terminated (emergency or admin action)
    }
    
    // Vault struct - enhanced with more tracking data
    struct Vault {
        address owner;
        address token;
        uint256 amount;
        uint256 lockStartTime;
        uint256 lockDuration;
        uint256 unlockTime;
        VaultStatus status;
        bool isActive;
        uint256 withdrawalTime;      // When vault was withdrawn/terminated
        uint256 penaltyAmount;       // Penalty amount if early withdrawal
        uint256 returnedAmount;      // Amount returned to user
    }
    
    // Vault data
    Vault public vault;
    
    // Minimum lock duration (1 month = 30 days)
    uint256 public constant MIN_LOCK_DURATION = 30 days;
    
    // Maximum lock duration (1 year = 365 days)
    uint256 public constant MAX_LOCK_DURATION = 365 days;
    
    // Predefined lock durations for easy selection
    uint256 public constant LOCK_1_MONTH = 30 days;
    uint256 public constant LOCK_2_MONTHS = 60 days;
    uint256 public constant LOCK_3_MONTHS = 90 days;
    uint256 public constant LOCK_4_MONTHS = 120 days;
    uint256 public constant LOCK_5_MONTHS = 150 days;
    uint256 public constant LOCK_6_MONTHS = 180 days;
    uint256 public constant LOCK_1_YEAR = 365 days;
    
    // Events - enhanced with more details
    event VaultCreated(address indexed owner, address indexed token, uint256 amount, uint256 duration, uint256 unlockTime);
    event FundsLocked(address indexed owner, uint256 amount, uint256 unlockTime, uint256 lockStartTime);
    event EarlyWithdrawal(address indexed owner, uint256 penalty, uint256 returned, uint256 timestamp);
    event CompletedWithdrawal(address indexed owner, uint256 amount, uint256 timestamp);
    event EmergencyWithdrawal(address indexed owner, uint256 amount, uint256 timestamp);
    event VaultPaused(address indexed owner, uint256 timestamp);
    event VaultResumed(address indexed owner, uint256 timestamp);
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
     * @param _amount The amount to lock
     * @param _duration The lock duration
     */
    constructor(
        address _owner,
        address _token,
        uint256 _amount,
        uint256 _duration
    ) Ownable(_owner) {
        require(_owner != address(0), "Invalid owner");
        require(_token != address(0), "Invalid token");
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration >= MIN_LOCK_DURATION, "Duration too short (minimum 30 days)");
        require(_duration <= MAX_LOCK_DURATION, "Duration too long (maximum 365 days)");
        
        vault = Vault({
            owner: _owner,
            token: _token,
            amount: _amount,
            lockStartTime: block.timestamp,
            lockDuration: _duration,
            unlockTime: block.timestamp + _duration,
            status: VaultStatus.ACTIVE,
            isActive: true,
            withdrawalTime: 0,
            penaltyAmount: 0,
            returnedAmount: 0
        });
        
        emit VaultCreated(_owner, _token, _amount, _duration, vault.unlockTime);
        emit FundsLocked(_owner, _amount, vault.unlockTime, vault.lockStartTime);
    }
    
    /**
     * @dev Get vault information
     */
    function getVaultInfo() external view returns (Vault memory) {
        return vault;
    }
    
    /**
     * @dev Check if vault is unlocked (time has passed)
     */
    function isUnlocked() public view returns (bool) {
        return block.timestamp >= vault.unlockTime;
    }
    
    /**
     * @dev Get remaining lock time
     */
    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= vault.unlockTime) {
            return 0;
        }
        return vault.unlockTime - block.timestamp;
    }
    
    /**
     * @dev Get vault balance
     */
    function getVaultBalance() external view returns (uint256) {
        return IERC20(vault.token).balanceOf(address(this));
    }
    
    /**
     * @dev Withdraw funds after lock period (no penalty)
     */
    function withdrawCompleted() external onlyVaultOwner vaultActive onlyActiveVault nonReentrant {
        require(isUnlocked(), "Vault not yet unlocked");
        
        uint256 amount = vault.amount;
        
        // Update vault state
        vault.status = VaultStatus.COMPLETED;
        vault.isActive = false;
        vault.withdrawalTime = block.timestamp;
        vault.returnedAmount = amount;
        
        // Transfer tokens to owner
        IERC20(vault.token).safeTransfer(vault.owner, amount);
        
        emit CompletedWithdrawal(vault.owner, amount, block.timestamp);
    }
    
    /**
     * @dev Early withdrawal with penalty
     * @param penaltyAmount The penalty amount to apply
     */
    function withdrawEarly(uint256 penaltyAmount) external onlyVaultOwner vaultActive onlyActiveVault nonReentrant {
        require(!isUnlocked(), "Vault already unlocked - use withdrawCompleted");
        require(penaltyAmount > 0, "Penalty must be greater than 0");
        require(penaltyAmount < vault.amount, "Penalty cannot exceed amount");
        
        uint256 remainingAmount = vault.amount - penaltyAmount;
        
        // Update vault state before external calls (CEI pattern)
        vault.status = VaultStatus.WITHDRAWN_EARLY;
        vault.isActive = false;
        vault.withdrawalTime = block.timestamp;
        vault.penaltyAmount = penaltyAmount;
        vault.returnedAmount = remainingAmount;
        
        // Transfer penalty to factory (which will send to treasury)
        IERC20(vault.token).safeTransfer(msg.sender, penaltyAmount);
        
        // Transfer remaining amount to owner
        IERC20(vault.token).safeTransfer(vault.owner, remainingAmount);
        
        emit EarlyWithdrawal(vault.owner, penaltyAmount, remainingAmount, block.timestamp);
    }
    
    /**
     * @dev Emergency withdrawal (owner only) - can only withdraw if vault is compromised
     */
    function emergencyWithdraw() external onlyOwner vaultActive nonReentrant {
        uint256 balance = IERC20(vault.token).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        
        // Only allow emergency withdrawal if vault is in an invalid state
        require(vault.status == VaultStatus.ACTIVE && !vault.isActive, "Vault not in emergency state");
        
        // Update vault state
        vault.status = VaultStatus.TERMINATED;
        vault.isActive = false;
        vault.withdrawalTime = block.timestamp;
        vault.returnedAmount = balance;
        
        // Transfer all tokens to owner
        IERC20(vault.token).safeTransfer(owner(), balance);
        
        emit EmergencyWithdrawal(owner(), balance, block.timestamp);
        emit VaultTerminated(vault.owner, block.timestamp);
    }
    
    /**
     * @dev Pause vault (owner only)
     */
    function pauseVault() external onlyOwner {
        vault.isActive = false;
        emit VaultPaused(vault.owner, block.timestamp);
    }
    
    /**
     * @dev Resume vault (owner only)
     */
    function resumeVault() external onlyOwner {
        vault.isActive = true;
        emit VaultResumed(vault.owner, block.timestamp);
    }
    
    /**
     * @dev Get vault status as string
     */
    function getVaultStatusString() external view returns (string memory) {
        if (vault.status == VaultStatus.ACTIVE) {
            return "ACTIVE";
        } else if (vault.status == VaultStatus.WITHDRAWN_EARLY) {
            return "WITHDRAWN_EARLY";
        } else if (vault.status == VaultStatus.COMPLETED) {
            return "COMPLETED";
        } else if (vault.status == VaultStatus.TERMINATED) {
            return "TERMINATED";
        }
        return "UNKNOWN";
    }
    
    /**
     * @dev Check if vault can be withdrawn normally (after lock period)
     */
    function canWithdraw() external view returns (bool) {
        return vault.isActive && 
               vault.status == VaultStatus.ACTIVE && 
               isUnlocked();
    }
    
    /**
     * @dev Check if vault can be withdrawn early (before lock period)
     */
    function canWithdrawEarly() external view returns (bool) {
        return vault.isActive && 
               vault.status == VaultStatus.ACTIVE && 
               !isUnlocked();
    }
    
    /**
     * @dev Check if vault is still active (not withdrawn/terminated)
     */
    function isVaultActive() external view returns (bool) {
        return vault.status == VaultStatus.ACTIVE && vault.isActive;
    }
    
    /**
     * @dev Get vault status for UI display
     */
    function getVaultStatus() external view returns (VaultStatus) {
        return vault.status;
    }
    
    /**
     * @dev Get withdrawal details (if vault was withdrawn)
     */
    function getWithdrawalDetails() external view returns (
        uint256 withdrawalTime,
        uint256 penaltyAmount,
        uint256 returnedAmount
    ) {
        return (vault.withdrawalTime, vault.penaltyAmount, vault.returnedAmount);
    }
    
    /**
     * @dev Get all available lock durations
     */
    function getAvailableLockDurations() external pure returns (uint256[] memory) {
        uint256[] memory durations = new uint256[](7);
        durations[0] = LOCK_1_MONTH;
        durations[1] = LOCK_2_MONTHS;
        durations[2] = LOCK_3_MONTHS;
        durations[3] = LOCK_4_MONTHS;
        durations[4] = LOCK_5_MONTHS;
        durations[5] = LOCK_6_MONTHS;
        durations[6] = LOCK_1_YEAR;
        return durations;
    }
    
    /**
     * @dev Get lock duration in months
     */
    function getLockDurationInMonths(uint256 duration) external pure returns (uint256) {
        return duration / 30 days;
    }
    
    /**
     * @dev Check if duration is a predefined option
     */
    function isPredefinedDuration(uint256 duration) external pure returns (bool) {
        return duration == LOCK_1_MONTH ||
               duration == LOCK_2_MONTHS ||
               duration == LOCK_3_MONTHS ||
               duration == LOCK_4_MONTHS ||
               duration == LOCK_5_MONTHS ||
               duration == LOCK_6_MONTHS ||
               duration == LOCK_1_YEAR;
    }
}
