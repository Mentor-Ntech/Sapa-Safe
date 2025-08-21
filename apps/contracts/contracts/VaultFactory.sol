// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./TokenRegistry.sol";
import "./PenaltyManager.sol";
import "./SavingsVault.sol";

/**
 * @title VaultFactory
 * @dev Factory contract for creating and managing SapaSafe vaults
 */
contract VaultFactory is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Contract dependencies
    TokenRegistry public tokenRegistry;
    PenaltyManager public penaltyManager;
    
    // Vault tracking
    mapping(address => address[]) public userVaults; // user => vault addresses
    mapping(address => mapping(address => address[])) public userVaultsByToken; // user => token => vault addresses
    address[] public allVaults;
    
    // Analytics tracking
    struct UserAnalytics {
        uint256 totalSaved;           // Total amount ever saved
        uint256 totalWithdrawn;       // Total amount withdrawn
        uint256 currentLocked;        // Currently locked amount
        uint256 completedVaults;      // Number of completed vaults
        uint256 earlyWithdrawals;     // Number of early withdrawals
        uint256 totalPenalties;       // Total penalties paid
        uint256 averageLockDuration;  // Average lock duration
        uint256 lastVaultCreated;     // Timestamp of last vault
        uint256 lastVaultCompleted;   // Timestamp of last completion
    }
    
    // User analytics mapping
    mapping(address => UserAnalytics) public userAnalytics;
    
    // Global analytics
    struct GlobalAnalytics {
        uint256 totalVaultsCreated;
        uint256 totalVaultsCompleted;
        uint256 totalEarlyWithdrawals;
        uint256 totalAmountLocked;
        uint256 totalAmountWithdrawn;
        uint256 totalPenaltiesCollected;
        uint256 averageVaultDuration;
        uint256 totalUsers;
        uint256 activeUsers;          // Users with active vaults
    }
    
    GlobalAnalytics public globalAnalytics;
    
    // Emergency pause functionality
    bool public paused;
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    // Vault counter
    uint256 public vaultCounter;
    
    // Monthly savings constants
    uint256 public constant MIN_MONTHS = 1;
    uint256 public constant MAX_MONTHS = 12;
    uint256 public constant MIN_TARGET_AMOUNT = 100000000000000000000; // 100 tokens minimum
    uint256 public constant MAX_TARGET_AMOUNT = 1000000000000000000000000; // 1M tokens maximum
    
    // Events
    event VaultCreated(address indexed user, address indexed vault, address indexed token, uint256 amount, uint256 duration, uint256 vaultId);
    event VaultWithdrawn(address indexed user, address indexed vault, uint256 amount, uint256 timestamp);
    event VaultWithdrawnEarly(address indexed user, address indexed vault, uint256 penalty, uint256 returned, uint256 timestamp);
    event TokenRegistryUpdated(address indexed oldRegistry, address indexed newRegistry, address indexed updater);
    event PenaltyManagerUpdated(address indexed oldManager, address indexed newManager, address indexed updater);
    event VaultFactoryInitialized(address indexed owner, address indexed tokenRegistry, address indexed penaltyManager);

    event EmergencyRecovery(address indexed token, uint256 amount, address indexed recipient, address indexed recoverer);
    event VaultFactoryPaused(address indexed pauser, uint256 timestamp);
    event VaultFactoryUnpaused(address indexed unpauser, uint256 timestamp);
    
    // Analytics events
    event UserAnalyticsUpdated(address indexed user, uint256 totalSaved, uint256 currentLocked, uint256 completedVaults);
    event GlobalAnalyticsUpdated(uint256 totalVaults, uint256 totalUsers, uint256 totalAmountLocked);
    
    // Modifiers
    modifier validToken(address token) {
        require(tokenRegistry.isTokenSupported(token), "Token not supported");
        require(token.code.length > 0, "Token is not a contract");
        _;
    }
    

    
    /**
     * @dev Constructor
     * @param _tokenRegistry Address of TokenRegistry contract
     * @param _penaltyManager Address of PenaltyManager contract
     */
    constructor(
        address _tokenRegistry,
        address _penaltyManager
    ) Ownable(msg.sender) {
        require(_tokenRegistry != address(0), "Invalid token registry");
        require(_penaltyManager != address(0), "Invalid penalty manager");
        
        tokenRegistry = TokenRegistry(_tokenRegistry);
        penaltyManager = PenaltyManager(_penaltyManager);
        
        emit VaultFactoryInitialized(msg.sender, _tokenRegistry, _penaltyManager);
    }
    
    // Constants for bounds checking
    uint256 public constant MAX_VAULTS_PER_USER = 100;
    uint256 public constant MAX_TOTAL_VAULTS = 10000;
    
    /**
     * @dev Create a new monthly savings vault
     * @param token The token address
     * @param targetAmount The total goal amount
     * @param totalMonths The total number of months
     * @param deadline Transaction deadline to prevent stale transactions
     * @return vaultAddress The address of the created vault
     */
    function createVault(
        address token,
        uint256 targetAmount,
        uint256 totalMonths,
        uint256 deadline
    ) external validToken(token) whenNotPaused nonReentrant returns (address vaultAddress) {
        // Check deadline
        require(block.timestamp <= deadline, "Transaction expired");
        
        // Validate parameters
        require(targetAmount >= MIN_TARGET_AMOUNT, "Target amount too small");
        require(targetAmount <= MAX_TARGET_AMOUNT, "Target amount too large");
        require(totalMonths >= MIN_MONTHS, "Too few months");
        require(totalMonths <= MAX_MONTHS, "Too many months");
        
        // Check bounds
        require(userVaults[msg.sender].length < MAX_VAULTS_PER_USER, "Too many vaults per user");
        require(allVaults.length < MAX_TOTAL_VAULTS, "Max total vaults reached");
        
        // Create new vault contract with constructor parameters
        SavingsVault vault = new SavingsVault(msg.sender, token, targetAmount, totalMonths);
        vaultAddress = address(vault);
        
        // No initial token transfer - users will pay monthly
        // Track vault (after external calls)
        userVaults[msg.sender].push(vaultAddress);
        userVaultsByToken[msg.sender][token].push(vaultAddress);
        allVaults.push(vaultAddress);
        vaultCounter++;
        
        // Update analytics (no initial amount for monthly savings)
        _updateUserAnalytics(msg.sender, 0, totalMonths * 30 days, true, false);
        _updateGlobalAnalytics(0, totalMonths * 30 days, true, false);
        
        emit VaultCreated(msg.sender, vaultAddress, token, targetAmount, totalMonths, vaultCounter);
        
        return vaultAddress;
    }
    
    /**
     * @dev Get all vaults for a user
     * @param user The user address
     * @return Array of vault addresses
     */
    function getUserVaults(address user) external view returns (address[] memory) {
        return userVaults[user];
    }
    
    /**
     * @dev Get user vaults for a specific token
     * @param user The user address
     * @param token The token address
     * @return Array of vault addresses
     */
    function getUserVaultsByToken(address user, address token) external view returns (address[] memory) {
        return userVaultsByToken[user][token];
    }
    
    /**
     * @dev Get all vaults
     * @return Array of all vault addresses
     */
    function getAllVaults() external view returns (address[] memory) {
        return allVaults;
    }
    
    /**
     * @dev Get vault count
     * @return Total number of vaults
     */
    function getVaultCount() external view returns (uint256) {
        return vaultCounter;
    }
    
    /**
     * @dev Get user vault count
     * @param user The user address
     * @return Number of vaults for user
     */
    function getUserVaultCount(address user) external view returns (uint256) {
        return userVaults[user].length;
    }
    
    /**
     * @dev Get user vault count for specific token
     * @param user The user address
     * @param token The token address
     * @return Number of vaults for user and token
     */
    function getUserVaultCountByToken(address user, address token) external view returns (uint256) {
        return userVaultsByToken[user][token].length;
    }
    
    /**
     * @dev Get vault info
     * @param vaultAddress The vault address
     * @return owner The vault owner
     * @return token The token address
     * @return targetAmount The target amount
     * @return monthlyAmount The monthly payment amount
     * @return totalMonths The total number of months
     * @return currentBalance The current balance
     * @return totalPaid The total amount paid
     * @return totalPenalties The total penalties
     * @return startDate The start date
     * @return endDate The end date
     * @return status The vault status
     * @return isActive Whether the vault is active
     * @return currentMonth The current month
     */
    function getVaultInfo(address vaultAddress) external view returns (
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
        SavingsVault.VaultStatus status,
        bool isActive,
        uint256 currentMonth
    ) {
        return SavingsVault(vaultAddress).getVaultInfo();
    }
    
    /**
     * @dev Withdraw from completed vault
     * @param vaultAddress The vault address
     */
    function withdrawFromVault(address vaultAddress) external whenNotPaused nonReentrant {
        SavingsVault vault = SavingsVault(vaultAddress);
        
        require(vault.canWithdrawCompleted(), "Cannot withdraw yet");
        
        // Get vault info before withdrawal
        (address owner, , , , , uint256 currentBalance, , , , , , , ) = vault.getVaultInfo();
        require(owner == msg.sender, "Not vault owner");
        
        // Update analytics first (CEI pattern)
        _updateUserAnalytics(msg.sender, currentBalance, 0, false, true);
        _updateGlobalAnalytics(currentBalance, 0, false, true);
        
        // Perform withdrawal
        vault.withdrawCompleted();
        
        emit VaultWithdrawn(msg.sender, vaultAddress, currentBalance, block.timestamp);
    }
    
    /**
     * @dev Early withdrawal from vault with penalty
     * @param vaultAddress The vault address
     */
    function withdrawEarlyFromVault(address vaultAddress) external whenNotPaused nonReentrant {
        SavingsVault vault = SavingsVault(vaultAddress);
        
        require(vault.canWithdrawEarly(), "Cannot withdraw early");
        
        // Get vault info before withdrawal
        (address owner, , , , , uint256 currentBalance, , , , , , , ) = vault.getVaultInfo();
        require(owner == msg.sender, "Not vault owner");
        
        // Calculate 10% penalty
        uint256 penalty = (currentBalance * 10) / 100;
        uint256 amountToReturn = currentBalance - penalty;
        
        // Update analytics first (CEI pattern)
        _updateUserAnalytics(msg.sender, amountToReturn, 0, false, false);
        _updateGlobalAnalytics(amountToReturn, 0, false, false);
        
        // Perform early withdrawal
        vault.withdrawEarly();
        
        emit VaultWithdrawnEarly(msg.sender, vaultAddress, penalty, amountToReturn, block.timestamp);
    }
    
    /**
     * @dev Get supported tokens
     * @return Array of supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return tokenRegistry.getSupportedTokens();
    }
    
    /**
     * @dev Get token info
     * @param token The token address
     * @return Token information
     */
    function getTokenInfo(address token) external view returns (TokenRegistry.TokenInfo memory) {
        return tokenRegistry.getTokenInfo(token);
    }
    
    /**
     * @dev Update token registry (owner only)
     * @param newRegistry New token registry address
     */
    function updateTokenRegistry(address newRegistry) external onlyOwner {
        require(newRegistry != address(0), "Invalid registry address");
        require(newRegistry != address(tokenRegistry), "Same registry");
        
        address oldRegistry = address(tokenRegistry);
        tokenRegistry = TokenRegistry(newRegistry);
        
        emit TokenRegistryUpdated(oldRegistry, newRegistry, msg.sender);
    }
    
    /**
     * @dev Update penalty manager (owner only)
     * @param newManager New penalty manager address
     */
    function updatePenaltyManager(address newManager) external onlyOwner {
        require(newManager != address(0), "Invalid manager address");
        require(newManager != address(penaltyManager), "Same manager");
        
        address oldManager = address(penaltyManager);
        penaltyManager = PenaltyManager(newManager);
        
        emit PenaltyManagerUpdated(oldManager, newManager, msg.sender);
    }
    
    /**
     * @dev Emergency function to recover tokens (owner only)
     * @param token The token to recover
     * @param amount The amount to recover
     * @param recipient The recipient address
     */
    function emergencyRecover(
        address token,
        uint256 amount,
        address recipient
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransfer(recipient, amount);
        
        emit EmergencyRecovery(token, amount, recipient, msg.sender);
    }
    
    /**
     * @dev Pause contract (owner only)
     */
    function pause() external onlyOwner {
        paused = true;
        emit VaultFactoryPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Unpause contract (owner only)
     */
    function unpause() external onlyOwner {
        paused = false;
        emit VaultFactoryUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get user's active vaults
     * @param user The user address
     * @return Array of active vault addresses
     */
    function getUserActiveVaults(address user) external view returns (address[] memory) {
        address[] memory userVaultsList = userVaults[user];
        address[] memory activeVaults = new address[](userVaultsList.length);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < userVaultsList.length; i++) {
            (,,,,,,,,,, SavingsVault.VaultStatus status, bool isActive, ) = SavingsVault(userVaultsList[i]).getVaultInfo();
            if (isActive && status == SavingsVault.VaultStatus.ACTIVE) {
                activeVaults[activeCount] = userVaultsList[i];
                activeCount++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(activeVaults, activeCount)
        }
        
        return activeVaults;
    }
    

    
    /**
     * @dev Update user analytics
     */
    function _updateUserAnalytics(
        address user,
        uint256 amount,
        uint256 duration,
        bool isVaultCreated,
        bool isVaultCompleted
    ) internal {
        UserAnalytics storage analytics = userAnalytics[user];
        
        if (isVaultCreated) {
            // Check for overflow
            require(analytics.totalSaved + amount >= analytics.totalSaved, "Overflow in totalSaved");
            require(analytics.currentLocked + amount >= analytics.currentLocked, "Overflow in currentLocked");
            
            analytics.totalSaved += amount;
            analytics.currentLocked += amount;
            analytics.lastVaultCreated = block.timestamp;
            
            // Update average lock duration (with division by zero protection)
            uint256 totalVaults = analytics.completedVaults + analytics.earlyWithdrawals;
            if (totalVaults > 0) {
                uint256 totalDuration = analytics.averageLockDuration * totalVaults;
                require(totalDuration + duration >= totalDuration, "Overflow in duration calculation");
                totalDuration += duration;
                analytics.averageLockDuration = totalDuration / (totalVaults + 1);
            } else {
                analytics.averageLockDuration = duration;
            }
        }
        
        if (isVaultCompleted) {
            require(analytics.totalWithdrawn + amount >= analytics.totalWithdrawn, "Overflow in totalWithdrawn");
            require(analytics.currentLocked >= amount, "Insufficient locked amount");
            
            analytics.totalWithdrawn += amount;
            analytics.currentLocked -= amount;
            analytics.completedVaults++;
            analytics.lastVaultCompleted = block.timestamp;
        } else if (!isVaultCreated) {
            // Early withdrawal
            require(analytics.totalWithdrawn + amount >= analytics.totalWithdrawn, "Overflow in totalWithdrawn");
            require(analytics.currentLocked >= amount, "Insufficient locked amount");
            
            analytics.totalWithdrawn += amount;
            analytics.currentLocked -= amount;
            analytics.earlyWithdrawals++;
            
            uint256 penalty = (amount * 10) / 100; // 10% penalty
            require(analytics.totalPenalties + penalty >= analytics.totalPenalties, "Overflow in totalPenalties");
            analytics.totalPenalties += penalty;
        }
        
        emit UserAnalyticsUpdated(user, analytics.totalSaved, analytics.currentLocked, analytics.completedVaults);
    }
    
    /**
     * @dev Update global analytics
     */
    function _updateGlobalAnalytics(
        uint256 amount,
        uint256 duration,
        bool isVaultCreated,
        bool isVaultCompleted
    ) internal {
        if (isVaultCreated) {
            globalAnalytics.totalVaultsCreated++;
            
            // Check for overflow
            require(globalAnalytics.totalAmountLocked + amount >= globalAnalytics.totalAmountLocked, "Overflow in totalAmountLocked");
            globalAnalytics.totalAmountLocked += amount;
            
            // Update average vault duration (with division by zero protection)
            uint256 totalVaults = globalAnalytics.totalVaultsCompleted + globalAnalytics.totalEarlyWithdrawals;
            if (totalVaults > 0) {
                uint256 totalDuration = globalAnalytics.averageVaultDuration * totalVaults;
                require(totalDuration + duration >= totalDuration, "Overflow in duration calculation");
                totalDuration += duration;
                globalAnalytics.averageVaultDuration = totalDuration / (totalVaults + 1);
            } else {
                globalAnalytics.averageVaultDuration = duration;
            }
        }
        
        if (isVaultCompleted) {
            require(globalAnalytics.totalAmountWithdrawn + amount >= globalAnalytics.totalAmountWithdrawn, "Overflow in totalAmountWithdrawn");
            require(globalAnalytics.totalAmountLocked >= amount, "Insufficient locked amount");
            
            globalAnalytics.totalVaultsCompleted++;
            globalAnalytics.totalAmountWithdrawn += amount;
            globalAnalytics.totalAmountLocked -= amount;
        } else if (!isVaultCreated) {
            // Early withdrawal
            require(globalAnalytics.totalAmountWithdrawn + amount >= globalAnalytics.totalAmountWithdrawn, "Overflow in totalAmountWithdrawn");
            require(globalAnalytics.totalAmountLocked >= amount, "Insufficient locked amount");
            
            globalAnalytics.totalEarlyWithdrawals++;
            globalAnalytics.totalAmountWithdrawn += amount;
            globalAnalytics.totalAmountLocked -= amount;
            
            uint256 penalty = (amount * 10) / 100; // 10% penalty
            require(globalAnalytics.totalPenaltiesCollected + penalty >= globalAnalytics.totalPenaltiesCollected, "Overflow in totalPenaltiesCollected");
            globalAnalytics.totalPenaltiesCollected += penalty;
        }
        
        emit GlobalAnalyticsUpdated(globalAnalytics.totalVaultsCreated, globalAnalytics.totalUsers, globalAnalytics.totalAmountLocked);
    }
    
    /**
     * @dev Get user analytics
     */
    function getUserAnalytics(address user) external view returns (UserAnalytics memory) {
        return userAnalytics[user];
    }
    
    /**
     * @dev Get global analytics
     */
    function getGlobalAnalytics() external view returns (GlobalAnalytics memory) {
        return globalAnalytics;
    }
    
    /**
     * @dev Get user savings insights
     */
    function getUserInsights(address user) external view returns (
        uint256 totalSaved,
        uint256 currentLocked,
        uint256 completionRate,
        uint256 averageDuration,
        uint256 totalPenalties
    ) {
        UserAnalytics memory analytics = userAnalytics[user];
        
        totalSaved = analytics.totalSaved;
        currentLocked = analytics.currentLocked;
        
        // Calculate completion rate
        uint256 totalVaults = analytics.completedVaults + analytics.earlyWithdrawals;
        completionRate = totalVaults > 0 ? (analytics.completedVaults * 100) / totalVaults : 0;
        
        averageDuration = analytics.averageLockDuration;
        totalPenalties = analytics.totalPenalties;
        
        return (totalSaved, currentLocked, completionRate, averageDuration, totalPenalties);
    }
    
    /**
     * @dev Get user savings summary
     */
    function getUserSummary(address user) external view returns (
        uint256 totalVaults,
        uint256 activeVaults,
        uint256 completedVaults,
        uint256 earlyWithdrawals,
        uint256 totalAmountSaved,
        uint256 currentAmountLocked
    ) {
        UserAnalytics memory analytics = userAnalytics[user];
        address[] memory userVaultsList = userVaults[user];
        
        totalVaults = userVaultsList.length;
        completedVaults = analytics.completedVaults;
        earlyWithdrawals = analytics.earlyWithdrawals;
        activeVaults = totalVaults - completedVaults - earlyWithdrawals;
        totalAmountSaved = analytics.totalSaved;
        currentAmountLocked = analytics.currentLocked;
        
        return (totalVaults, activeVaults, completedVaults, earlyWithdrawals, totalAmountSaved, currentAmountLocked);
    }
    

    
    /**
     * @dev Get user vaults by status
     * @param user The user address
     * @param status The vault status to filter by
     * @return Array of vault addresses with the specified status
     */
    function getUserVaultsByStatus(address user, SavingsVault.VaultStatus status) external view returns (address[] memory) {
        address[] memory allUserVaults = userVaults[user];
        address[] memory filteredVaults = new address[](allUserVaults.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allUserVaults.length; i++) {
            SavingsVault vault = SavingsVault(allUserVaults[i]);
            (,,,,,,,,,, SavingsVault.VaultStatus vaultStatus, , ) = vault.getVaultInfo();
            if (vaultStatus == status) {
                filteredVaults[count] = allUserVaults[i];
                count++;
            }
        }
        
        // Resize array to actual count
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = filteredVaults[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get vault status summary for a user
     * @param user The user address
     * @return activeCount Number of active vaults
     * @return completedCount Number of completed vaults
     * @return earlyWithdrawnCount Number of early withdrawn vaults
     * @return terminatedCount Number of terminated vaults
     */
    function getUserVaultStatusSummary(address user) external view returns (
        uint256 activeCount,
        uint256 completedCount,
        uint256 earlyWithdrawnCount,
        uint256 terminatedCount
    ) {
        require(user != address(0), "Invalid user address");
        
        address[] memory allUserVaults = userVaults[user];
        
        for (uint256 i = 0; i < allUserVaults.length; i++) {
            try SavingsVault(allUserVaults[i]).getVaultInfo() returns (
                address, address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, SavingsVault.VaultStatus, bool, uint256
            ) {
                (,,,,,,,,,, SavingsVault.VaultStatus status, , ) = SavingsVault(allUserVaults[i]).getVaultInfo();
                
                if (status == SavingsVault.VaultStatus.ACTIVE) {
                    activeCount++;
                } else if (status == SavingsVault.VaultStatus.COMPLETED) {
                    completedCount++;
                } else if (status == SavingsVault.VaultStatus.WITHDRAWN_EARLY) {
                    earlyWithdrawnCount++;
                } else if (status == SavingsVault.VaultStatus.TERMINATED) {
                    terminatedCount++;
                }
            } catch {
                // Skip invalid vaults
                continue;
            }
        }
        
        return (activeCount, completedCount, earlyWithdrawnCount, terminatedCount);
    }
    
    /**
     * @dev Get user completed vaults
     * @param user The user address
     * @return Array of completed vault addresses
     */
    function getUserCompletedVaults(address user) external view returns (address[] memory) {
        address[] memory allUserVaults = userVaults[user];
        address[] memory filteredVaults = new address[](allUserVaults.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allUserVaults.length; i++) {
            SavingsVault vault = SavingsVault(allUserVaults[i]);
            (,,,,,,,,,, SavingsVault.VaultStatus status, , ) = vault.getVaultInfo();
            if (status == SavingsVault.VaultStatus.COMPLETED) {
                filteredVaults[count] = allUserVaults[i];
                count++;
            }
        }
        
        // Resize array to actual count
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = filteredVaults[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get user early withdrawn vaults
     * @param user The user address
     * @return Array of early withdrawn vault addresses
     */
    function getUserEarlyWithdrawnVaults(address user) external view returns (address[] memory) {
        address[] memory allUserVaults = userVaults[user];
        address[] memory filteredVaults = new address[](allUserVaults.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allUserVaults.length; i++) {
            SavingsVault vault = SavingsVault(allUserVaults[i]);
            (,,,,,,,,,, SavingsVault.VaultStatus status, , ) = vault.getVaultInfo();
            if (status == SavingsVault.VaultStatus.WITHDRAWN_EARLY) {
                filteredVaults[count] = allUserVaults[i];
                count++;
            }
        }
        
        // Resize array to actual count
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = filteredVaults[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get user terminated vaults
     * @param user The user address
     * @return Array of terminated vault addresses
     */
    function getUserTerminatedVaults(address user) external view returns (address[] memory) {
        address[] memory allUserVaults = userVaults[user];
        address[] memory filteredVaults = new address[](allUserVaults.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allUserVaults.length; i++) {
            SavingsVault vault = SavingsVault(allUserVaults[i]);
            (,,,,,,,,,, SavingsVault.VaultStatus status, , ) = vault.getVaultInfo();
            if (status == SavingsVault.VaultStatus.TERMINATED) {
                filteredVaults[count] = allUserVaults[i];
                count++;
            }
        }
        
        // Resize array to actual count
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = filteredVaults[i];
        }
        
        return result;
    }
    

}
