// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PenaltyManager
 * @dev Manages penalty calculations and burning for early withdrawals
 */
contract PenaltyManager is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    
    // Default penalty percentage (10% = 1000 basis points)
    uint256 public penaltyPercentage = 1000; // 10%
    
    // Maximum penalty percentage (20% = 2000 basis points)
    uint256 public constant MAX_PENALTY_PERCENTAGE = 2000; // 20%
    
    // Basis points for percentage calculations
    uint256 public constant BASIS_POINTS = 10000;
    
    // Treasury address for penalties (deployer address)
    address public treasuryAddress;
    
    // Events
    event PenaltyCalculated(uint256 vaultId, uint256 amount, uint256 penalty, uint256 remainingAmount);
    event PenaltyCollected(address indexed token, uint256 amount, address indexed treasury, address indexed collector);
    event PenaltyPercentageUpdated(uint256 oldPercentage, uint256 newPercentage, address indexed updater);
    event TreasuryAddressUpdated(address indexed oldTreasury, address indexed newTreasury, address indexed updater);
    event PenaltyManagerInitialized(address indexed owner, uint256 initialPenaltyPercentage, address initialTreasury);
    event PenaltyManagerUpgraded(address indexed implementation);
    event EmergencyRecovery(address indexed token, uint256 amount, address indexed recipient, address indexed recoverer);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the contract
     * @param _owner The contract owner
     */
    function initialize(address _owner) public initializer {
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        treasuryAddress = _owner; // Set treasury to owner address
        
        emit PenaltyManagerInitialized(_owner, penaltyPercentage, treasuryAddress);
    }
    
    /**
     * @dev Calculate penalty for early withdrawal
     * @param amount The amount to calculate penalty for
     * @return penalty The penalty amount
     * @return remainingAmount The amount after penalty
     */
    function calculatePenalty(uint256 amount) external view returns (uint256 penalty, uint256 remainingAmount) {
        require(amount > 0, "Amount must be greater than 0");
        
        penalty = (amount * penaltyPercentage) / BASIS_POINTS;
        // Ensure minimum penalty of 1 wei
        if (penalty == 0 && amount > 0) {
            penalty = 1;
        }
        remainingAmount = amount - penalty;
        
        return (penalty, remainingAmount);
    }
    
    /**
     * @dev Calculate penalty with vault ID for event emission
     * @param vaultId The vault ID
     * @param amount The amount to calculate penalty for
     * @return penalty The penalty amount
     * @return remainingAmount The amount after penalty
     */
    function calculatePenaltyWithVaultId(uint256 vaultId, uint256 amount) external view returns (uint256 penalty, uint256 remainingAmount) {
        require(amount > 0, "Amount must be greater than 0");
        
        penalty = (amount * penaltyPercentage) / BASIS_POINTS;
        // Ensure minimum penalty of 1 wei
        if (penalty == 0 && amount > 0) {
            penalty = 1;
        }
        remainingAmount = amount - penalty;
        
        return (penalty, remainingAmount);
    }
    
    /**
     * @dev Calculate penalty with custom percentage
     * @param amount The amount to calculate penalty for
     * @param customPercentage The custom penalty percentage in basis points
     * @return penalty The penalty amount
     * @return remainingAmount The amount after penalty
     */
    function calculatePenaltyWithPercentage(
        uint256 amount, 
        uint256 customPercentage
    ) external pure returns (uint256 penalty, uint256 remainingAmount) {
        require(customPercentage <= MAX_PENALTY_PERCENTAGE, "Penalty too high");
        
        penalty = (amount * customPercentage) / BASIS_POINTS;
        remainingAmount = amount - penalty;
        
        return (penalty, remainingAmount);
    }
    
    /**
     * @dev Collect penalty tokens to treasury
     * @param token The token to collect
     * @param amount The amount to collect
     */
    function collectPenalty(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(token != address(0), "Invalid token address");
        require(treasuryAddress != address(0), "Treasury not set");
        
        // Transfer tokens to treasury address
        IERC20(token).transferFrom(msg.sender, treasuryAddress, amount);
        
        emit PenaltyCollected(token, amount, treasuryAddress, msg.sender);
    }
    
    /**
     * @dev Update penalty percentage (owner only)
     * @param newPercentage New penalty percentage in basis points
     */
    function updatePenaltyPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= MAX_PENALTY_PERCENTAGE, "Penalty too high");
        require(newPercentage != penaltyPercentage, "Same percentage");
        
        uint256 oldPercentage = penaltyPercentage;
        penaltyPercentage = newPercentage;
        
        emit PenaltyPercentageUpdated(oldPercentage, newPercentage, msg.sender);
    }
    
    /**
     * @dev Get penalty percentage as decimal (e.g., 0.10 for 10%)
     */
    function getPenaltyPercentageDecimal() external view returns (uint256) {
        return penaltyPercentage;
    }
    
    /**
     * @dev Get penalty percentage as percentage (e.g., 10 for 10%)
     */
    function getPenaltyPercentageAsPercent() external view returns (uint256) {
        return penaltyPercentage / 100;
    }
    
    /**
     * @dev Check if penalty is within acceptable range
     * @param amount The amount to check
     * @return bool True if penalty is acceptable
     */
    function isPenaltyAcceptable(uint256 amount) external view returns (bool) {
        uint256 penalty = (amount * penaltyPercentage) / BASIS_POINTS;
        return penalty > 0 && penalty < amount;
    }
    
    /**
     * @dev Update treasury address (owner only)
     * @param newTreasury New treasury address
     */
    function updateTreasuryAddress(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        require(newTreasury != treasuryAddress, "Same treasury address");
        
        address oldTreasury = treasuryAddress;
        treasuryAddress = newTreasury;
        
        emit TreasuryAddressUpdated(oldTreasury, newTreasury, msg.sender);
    }
    
    /**
     * @dev Get treasury address
     */
    function getTreasuryAddress() external view returns (address) {
        return treasuryAddress;
    }
    
    /**
     * @dev Emergency function to recover tokens sent to this contract (owner only)
     * @param token The token to recover
     * @param amount The amount to recover
     * @param recipient The recipient of the recovered tokens
     */
    function emergencyRecover(
        address token,
        uint256 amount,
        address recipient
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).transfer(recipient, amount);
        
        emit EmergencyRecovery(token, amount, recipient, msg.sender);
    }
    
    /**
     * @dev Required by UUPSUpgradeable
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        emit PenaltyManagerUpgraded(newImplementation);
    }
}
