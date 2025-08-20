// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenRegistry
 * @dev Manages supported African Mento tokens for SapaSafe
 */
contract TokenRegistry is Ownable, ReentrancyGuard {
    
    struct TokenInfo {
        string symbol;
        string name;
        string country;
        bool isSupported;
        uint256 minAmount;
    }
    
    // Mapping of token address to token info
    mapping(address => TokenInfo) public tokens;
    
    // Array of supported token addresses
    address[] public supportedTokens;
    
    // Mapping for O(1) token removal
    mapping(address => uint256) public tokenIndex;
    
    // Events
    event TokenAdded(address indexed token, string symbol, string country, uint256 minAmount);
    event TokenRemoved(address indexed token, string symbol, string country);
    event TokenLimitsUpdated(address indexed token, uint256 oldMinAmount, uint256 newMinAmount);
    event TokenRegistryInitialized(address indexed owner, uint256 tokenCount);

    
    /**
     * @dev Constructor
     * @param _owner The contract owner
     */
    constructor(address _owner) Ownable(_owner) {
        _initializeAfricanTokens();
        
        emit TokenRegistryInitialized(_owner, supportedTokens.length);
    }
    
    /**
     * @dev Initialize supported African Mento tokens on Alfajores
     */
    function _initializeAfricanTokens() internal {
        // Nigerian Naira
        _addToken(
            0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0,
            "cNGN",
            "Nigerian Naira",
            "Nigeria",
            500 * 10**18  // 500 NGN minimum
        );
        
        // Ghanaian Cedi
        _addToken(
            0x295B66bE7714458Af45E6A6Ea142A5358A6cA375,
            "cGHS",
            "Ghanaian Cedi",
            "Ghana",
            5 * 10**18    // 5 GHS minimum
        );
        
        // Kenyan Shilling
        _addToken(
            0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92,
            "cKES",
            "Kenyan Shilling",
            "Kenya",
            500 * 10**18  // 500 KES minimum
        );
        
        // South African Rand
        _addToken(
            0x1e5b44015Ff90610b54000DAad31C89b3284df4d,
            "cZAR",
            "South African Rand",
            "South Africa",
            50 * 10**18   // 50 ZAR minimum
        );
        
        // West African CFA Franc
        _addToken(
            0xB0FA15e002516d0301884059c0aaC0F0C72b019D,
            "cXOF",
            "West African CFA Franc",
            "West Africa",
            5000 * 10**18 // 5000 XOF minimum
        );
    }
    
    /**
     * @dev Add a new supported token (owner only)
     */
    function addToken(
        address token,
        string memory symbol,
        string memory name,
        string memory country,
        uint256 minAmount
    ) external onlyOwner {
        _addToken(token, symbol, name, country, minAmount);
    }
    
    function _addToken(
        address token,
        string memory symbol,
        string memory name,
        string memory country,
        uint256 minAmount
    ) internal {
        require(token != address(0), "Invalid token address");
        require(!tokens[token].isSupported, "Token already supported");
        require(minAmount > 0, "Invalid minimum amount");
        
        tokens[token] = TokenInfo({
            symbol: symbol,
            name: name,
            country: country,
            isSupported: true,
            minAmount: minAmount
        });
        
        supportedTokens.push(token);
        tokenIndex[token] = supportedTokens.length - 1;
        
        emit TokenAdded(token, symbol, country, minAmount);
    }
    
    /**
     * @dev Remove a supported token (owner only)
     */
    function removeToken(address token) external onlyOwner {
        require(tokens[token].isSupported, "Token not supported");
        
        tokens[token].isSupported = false;
        
        // O(1) removal using mapping
        uint256 index = tokenIndex[token];
        address lastToken = supportedTokens[supportedTokens.length - 1];
        
        supportedTokens[index] = lastToken;
        tokenIndex[lastToken] = index;
        supportedTokens.pop();
        
        delete tokenIndex[token];
        
        emit TokenRemoved(token, tokens[token].symbol, tokens[token].country);
    }
    
    /**
     * @dev Update token minimum amount (owner only)
     */
    function updateTokenMinAmount(
        address token,
        uint256 minAmount
    ) external onlyOwner {
        require(tokens[token].isSupported, "Token not supported");
        require(minAmount > 0, "Invalid minimum amount");
        
        uint256 oldMinAmount = tokens[token].minAmount;
        
        tokens[token].minAmount = minAmount;
        
        emit TokenLimitsUpdated(token, oldMinAmount, minAmount);
    }
    
    /**
     * @dev Check if token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return tokens[token].isSupported;
    }
    
    /**
     * @dev Get token info
     */
    function getTokenInfo(address token) external view returns (TokenInfo memory) {
        return tokens[token];
    }
    
    /**
     * @dev Get all supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }
    
    /**
     * @dev Get supported token count
     */
    function getSupportedTokenCount() external view returns (uint256) {
        return supportedTokens.length;
    }
    
    /**
     * @dev Validate amount for token
     */
    function validateAmount(address token, uint256 amount) external view returns (bool) {
        TokenInfo memory tokenInfo = tokens[token];
        return tokenInfo.isSupported && 
               amount >= tokenInfo.minAmount;
    }
    

}
