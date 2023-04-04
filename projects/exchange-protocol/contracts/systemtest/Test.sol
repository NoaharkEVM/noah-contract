// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract Test is ERC20, Ownable {
  constructor(string memory _name, string memory _symbol)
    ERC20(_name, _symbol) // solhint-disable-next-line no-empty-blocks
  {
    _mint(msg.sender, 5e30);
  }
  function mintTokens(uint256 _amount) external onlyOwner {
      _mint(msg.sender, _amount);
  }
}
