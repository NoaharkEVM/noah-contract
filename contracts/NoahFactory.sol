// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.5.16;

import './interfaces/INoahFactory.sol';
import './NoahPair.sol';

contract NoahFactory is INoahFactory {
    bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(NoahPair).creationCode));
    address public feeTo;
    address public admin;

    mapping(address => mapping(address => address)) public getPair;
    mapping(address => uint256) public getFeeRate;
    address[] public allPairs;
    State public state;

    constructor(address _admin) public {
        admin = _admin;
        state = State.Active;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'Noah: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Noah: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'Noah: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(NoahPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        INoahPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);

        getFeeRate[pair] = 30;
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == admin, 'Noah: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setAdmin(address _admin) external {
        require(_admin != address(0), 'Noah: ZERO_ADDRESS');
        require(msg.sender == admin, 'Noah: FORBIDDEN');
        admin = _admin;
    }

    function setFeeRate(address pair, uint256 _feeRate) external {
        require(msg.sender == admin, 'Noah: FORBIDDEN');
        require(_feeRate <= 100, 'Noah: FEE_REATE_LIMIT');
        getFeeRate[pair] = _feeRate;

        emit SetFeeRate(pair, _feeRate);
    }

    function toggleState() external {
        require(msg.sender == admin, 'Noah: FORBIDDEN');
        if(state == State.Active){
            state = State.Pending;
        }else{
            state = State.Active;
        } 
    }
}
