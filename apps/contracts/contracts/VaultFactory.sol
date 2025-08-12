// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./TokenRegistry.sol";
import "./PenaltyManager.sol";
import "./SavingsVault.sol";

/**
 * @title VaultFactory
 * @dev Factory contract for creating and managing SapaSafe vaults
 */
contract VaultFactory is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
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
    
    // Vault counter
    uint256 public vaultCounter;
    
    // Lock duration constants (same as SavingsVault)
    uint256 public constant LOCK_1_MONTH = 30 days;
    uint256 public constant LOCK_2_MONTHS = 60 days;
    uint256 public constant LOCK_3_MONTHS = 90 days;
    uint256 public constant LOCK_4_MONTHS = 120 days;
    uint256 public constant LOCK_5_MONTHS = 150 days;
    uint256 public constant LOCK_6_MONTHS = 180 days;
    uint256 public constant LOCK_1_YEAR = 365 days;
    
    // Events
    event VaultCreated(address indexed user, address indexed vault, address indexed token, uint256 amount, uint256 duration, uint256 vaultId);
    event VaultWithdrawn(address indexed user, address indexed vault, uint256 amount, uint256 timestamp);
    event VaultWithdrawnEarly(address indexed user, address indexed vault, uint256 penalty, uint256 returned, uint256 timestamp);
    event TokenRegistryUpdated(address indexed oldRegistry, address indexed newRegistry, address indexed updater);
    event PenaltyManagerUpdated(address indexed oldManager, address indexed newManager, address indexed updater);
    event VaultFactoryInitialized(address indexed owner, address indexed tokenRegistry, address indexed penaltyManager);
    event VaultFactoryUpgraded(address indexed implementation);
    event EmergencyRecovery(address indexed token, uint256 amount, address indexed recipient, address indexed recoverer);
    
    // Analytics events
    event UserAnalyticsUpdated(address indexed user, uint256 totalSaved, uint256 currentLocked, uint256 completedVaults);
    event GlobalAnalyticsUpdated(uint256 totalVaults, uint256 totalUsers, uint256 totalAmountLocked);
    
    // Modifiers
    modifier validToken(address token) {
        require(tokenRegistry.isTokenSupported(token), "Token not supported");
        _;
    }
    
    modifier validAmount(address token, uint256 amount) {
        require(tokenRegistry.validateAmount(token, amount), "Amount below minimum");
        _;
    }
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the contract
     * @param _owner The contract owner
     * @param _tokenRegistry Address of TokenRegistry contract
     * @param _penaltyManager Address of PenaltyManager contract
     */
    function initialize(
        address _owner,
        address _tokenRegistry,
        address _penaltyManager
    ) public initializer {
        require(_tokenRegistry != address(0), "Invalid token registry");
        require(_penaltyManager != address(0), "Invalid penalty manager");
        
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        tokenRegistry = TokenRegistry(_tokenRegistry);
        penaltyManager = PenaltyManager(_penaltyManager);
        
        emit VaultFactoryInitialized(_owner, _tokenRegistry, _penaltyManager);
    }
    
    /**
     * @dev Create a new vault
     * @param token The token to lock
     * @param amount The amount to lock
     * @param duration The lock duration in seconds
     * @return vaultAddress The address of the created vault
     */
    function createVault(
        address token,
        uint256 amount,
        uint256 duration
    ) external validToken(token) validAmount(token, amount) nonReentrant returns (address vaultAddress) {
        // Transfer tokens from user to factory
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Create new vault contract
        SavingsVault vault = new SavingsVault();
        vaultAddress = address(vault);
        
        // Initialize the vault
        vault.initialize(msg.sender, token, amount, duration);
        
        // Transfer tokens to vault
        IERC20(token).safeTransfer(vaultAddress, amount);
        
        // Track vault
        userVaults[msg.sender].push(vaultAddress);
        userVaultsByToken[msg.sender][token].push(vaultAddress);
        allVaults.push(vaultAddress);
        vaultCounter++;
        
        // Update analytics
        _updateUserAnalytics(msg.sender, amount, duration, true, false);
        _updateGlobalAnalytics(amount, duration, true, false);
        
        emit VaultCreated(msg.sender, vaultAddress, token, amount, duration, vaultCounter);
        
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
     * @return Vault information
     */
    function getVaultInfo(address vaultAddress) external view returns (SavingsVault.Vault memory) {
        return SavingsVault(vaultAddress).getVaultInfo();
    }
    
    /**
     * @dev Withdraw from vault (completed lock period)
     * @param vaultAddress The vault address
     */
    function withdrawFromVault(address vaultAddress) external nonReentrant {
        SavingsVault vault = SavingsVault(vaultAddress);
        SavingsVault.Vault memory vaultInfo = vault.getVaultInfo();
        
        require(vaultInfo.owner == msg.sender, "Not vault owner");
        require(vault.canWithdraw(), "Cannot withdraw yet");
        
        // Get amount before withdrawal
        uint256 amount = vault.getVaultBalance();
        
        // Perform withdrawal
        vault.withdrawCompleted();
        
        // Update analytics
        _updateUserAnalytics(msg.sender, amount, 0, false, true);
        _updateGlobalAnalytics(amount, 0, false, true);
        
        emit VaultWithdrawn(msg.sender, vaultAddress, amount, block.timestamp);
    }
    
    /**
     * @dev Early withdrawal from vault with penalty
     * @param vaultAddress The vault address
     */
    function withdrawEarlyFromVault(address vaultAddress) external nonReentrant {
        SavingsVault vault = SavingsVault(vaultAddress);
        SavingsVault.Vault memory vaultInfo = vault.getVaultInfo();
        
        require(vaultInfo.owner == msg.sender, "Not vault owner");
        require(vault.canWithdrawEarly(), "Cannot withdraw early");
        
        // Calculate penalty
        (uint256 penalty, ) = penaltyManager.calculatePenalty(vaultInfo.amount);
        
        // Transfer penalty to factory first
        IERC20(vaultInfo.token).safeTransferFrom(msg.sender, address(this), penalty);
        
        // Perform early withdrawal (penalty already transferred)
        vault.withdrawEarly(penalty);
        
        // Send penalty to treasury
        penaltyManager.collectPenalty(vaultInfo.token, penalty);
        
        // Update analytics for early withdrawal
        _updateUserAnalytics(msg.sender, vaultInfo.amount - penalty, 0, false, false);
        _updateGlobalAnalytics(vaultInfo.amount - penalty, 0, false, false);
        
        emit VaultWithdrawnEarly(msg.sender, vaultAddress, penalty, vaultInfo.amount - penalty, block.timestamp);
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
     * @dev Get user's active vaults
     * @param user The user address
     * @return Array of active vault addresses
     */
    function getUserActiveVaults(address user) external view returns (address[] memory) {
        address[] memory userVaultsList = userVaults[user];
        address[] memory activeVaults = new address[](userVaultsList.length);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < userVaultsList.length; i++) {
            SavingsVault.Vault memory vaultInfo = SavingsVault(userVaultsList[i]).getVaultInfo();
            if (vaultInfo.isActive && vaultInfo.status == SavingsVault.VaultStatus.LOCKED) {
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
     * @dev Get lock duration options with labels
     */
    function getLockDurationOptions() external pure returns (string[] memory labels, uint256[] memory durations) {
        labels = new string[](7);
        durations = new uint256[](7);
        
        labels[0] = "1 Month";
        labels[1] = "2 Months";
        labels[2] = "3 Months";
        labels[3] = "4 Months";
        labels[4] = "5 Months";
        labels[5] = "6 Months";
        labels[6] = "1 Year";
        
        durations[0] = LOCK_1_MONTH;
        durations[1] = LOCK_2_MONTHS;
        durations[2] = LOCK_3_MONTHS;
        durations[3] = LOCK_4_MONTHS;
        durations[4] = LOCK_5_MONTHS;
        durations[5] = LOCK_6_MONTHS;
        durations[6] = LOCK_1_YEAR;
        
        return (labels, durations);
    }
    
    /**
     * @dev Validate lock duration
     */
    function isValidLockDuration(uint256 duration) external pure returns (bool) {
        return duration >= 30 days && duration <= 365 days;
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
            analytics.totalSaved += amount;
            analytics.currentLocked += amount;
            analytics.lastVaultCreated = block.timestamp;
            
            // Update average lock duration
            uint256 totalDuration = analytics.averageLockDuration * (analytics.completedVaults + analytics.earlyWithdrawals);
            totalDuration += duration;
            analytics.averageLockDuration = totalDuration / (analytics.completedVaults + analytics.earlyWithdrawals + 1);
        }
        
        if (isVaultCompleted) {
            analytics.totalWithdrawn += amount;
            analytics.currentLocked -= amount;
            analytics.completedVaults++;
            analytics.lastVaultCompleted = block.timestamp;
        } else if (!isVaultCreated) {
            // Early withdrawal
            analytics.totalWithdrawn += amount;
            analytics.currentLocked -= amount;
            analytics.earlyWithdrawals++;
            analytics.totalPenalties += (amount * 10) / 100; // 10% penalty
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
            globalAnalytics.totalAmountLocked += amount;
            
            // Update average vault duration
            uint256 totalDuration = globalAnalytics.averageVaultDuration * (globalAnalytics.totalVaultsCompleted + globalAnalytics.totalEarlyWithdrawals);
            totalDuration += duration;
            globalAnalytics.averageVaultDuration = totalDuration / (globalAnalytics.totalVaultsCompleted + globalAnalytics.totalEarlyWithdrawals + 1);
        }
        
        if (isVaultCompleted) {
            globalAnalytics.totalVaultsCompleted++;
            globalAnalytics.totalAmountWithdrawn += amount;
            globalAnalytics.totalAmountLocked -= amount;
        } else if (!isVaultCreated) {
            // Early withdrawal
            globalAnalytics.totalEarlyWithdrawals++;
            globalAnalytics.totalAmountWithdrawn += amount;
            globalAnalytics.totalAmountLocked -= amount;
            globalAnalytics.totalPenaltiesCollected += (amount * 10) / 100; // 10% penalty
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
     * @dev Required by UUPSUpgradeable
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        emit VaultFactoryUpgraded(newImplementation);
    }
}
