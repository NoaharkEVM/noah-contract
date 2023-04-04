pragma solidity =0.5.16;

import '../NoahERC20.sol';

contract Noah is NoahERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
