import { Wallet, Contract, utils, BigNumber } from 'ethers'
import {time} from "@nomicfoundation/hardhat-network-helpers"
const {
  getAddress,
  keccak256,
  solidityPack
} = utils
export const MINIMUM_LIQUIDITY = BigNumber.from(10).pow(3)

export function expandTo18Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

export function getCreate2Address(
  factoryAddress: string,
  [tokenA, tokenB]: [string, string],
  bytecode: string
): string {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  const create2Inputs = [
    '0xff',
    factoryAddress,
    keccak256(solidityPack(['address', 'address'], [token0, token1])),
    keccak256(bytecode)
  ]
  const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
}

export async function getApprovalDigest(
  token: Contract,
  signer: Wallet,
  approve: {
    owner: string
    spender: string
    value: BigNumber
  },
  deadline: BigNumber
): Promise<string> {
  const domain = {
    name: await token.name(),
    chainId: await signer.getChainId(),
    version: "1",
    verifyingContract: token.address,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const value = {
    owner: approve.owner,
    spender: approve.spender,
    value: approve.value,
    nonce: await token.nonces(signer.address),
    deadline,
  };

  return signer._signTypedData(domain, types, value);
}

export async function mineBlock(timestamp: number): Promise<void> {
  await new Promise(async (resolve, reject) => {
      await time.increaseTo(timestamp);
  })
}

export function encodePrice(reserve0: BigNumber, reserve1: BigNumber) {
  return [reserve1.mul(BigNumber.from(2).pow(112)).div(reserve0), reserve0.mul(BigNumber.from(2).pow(112)).div(reserve1)]
}
