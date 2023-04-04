// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0;

interface INoahFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256 pid);
    event SetFeeRate(address indexed pair,  uint256 feeRate);
    
    // Returns uint
    // Pending  - 0
    // Active  - 1
    enum State {Pending, Active}

    function state() external view returns (State);
    
    function feeTo() external view returns (address);

    function admin() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);

    function getFeeRate(address pair) external view returns (uint256 feeRate);

    function allPairs(uint256) external view returns (address pair);

    function allPairsLength() external view returns (uint256);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;

    function setAdmin(address) external;

    function setFeeRate(address pair, uint256 _feeRate) external;
    
    function toggleState() external;

    function INIT_CODE_PAIR_HASH() external view returns (bytes32);
}
