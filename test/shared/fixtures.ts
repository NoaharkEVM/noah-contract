import { Contract, Wallet } from 'ethers'
import { ethers } from 'hardhat'

import { expandTo18Decimals } from './utilities'
const overrides = {
  gasLimit: 9999999
}
interface FactoryFixture {
  factory: Contract
}

export async function factoryFixture([wallet]: Wallet[]): Promise<FactoryFixture> {
  const NoahFactory = await ethers.getContractFactory("NoahFactory");
  const factory = await NoahFactory.deploy(wallet.address);
  return { factory }
}

interface PairFixture extends FactoryFixture {
  token0: Contract
  token1: Contract
  pair: Contract
}

export async function pairFixture([wallet]: Wallet[]): Promise<PairFixture> {
  const { factory } = await factoryFixture([wallet])

  const ERC20 = await ethers.getContractFactory("Noah");
  const tokenA = await ERC20.deploy(expandTo18Decimals(10000));
  const tokenB = await ERC20.deploy(expandTo18Decimals(10000));

  await factory.createPair(tokenA.address, tokenB.address)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = await ethers.getContractAt("NoahPair", pairAddress)

  const token0Address = await pair.token0()
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  return { factory, token0, token1, pair }
}
interface V2Fixture {
  token0: Contract
  token1: Contract
  WETH: Contract
  WETHPartner: Contract
  factory: Contract
  router: Contract
  routerEventEmitter: Contract
  pair: Contract
  WETHPair: Contract
}

export async function v2Fixture([wallet]: Wallet[]): Promise<V2Fixture> {
  // deploy tokens
  const ERC20 = await ethers.getContractFactory("Noah");
  const tokenA = await ERC20.deploy(expandTo18Decimals(10000));
  const tokenB = await ERC20.deploy(expandTo18Decimals(10000));

  const WEOS = await ethers.getContractFactory("WEOS");
  const WETH = await WEOS.deploy()
  const WETHPartner = await ERC20.deploy(expandTo18Decimals(10000))

  // deploy V2
  const NoahFactory = await ethers.getContractFactory("NoahFactory");
  const factory = await NoahFactory.deploy(wallet.address)

  // deploy routers
  const NoahRouter = await ethers.getContractFactory("NoahRouter");
  const router = await NoahRouter.deploy(factory.address, WETH.address, overrides)

  // event emitter for testing
  const RouterEventEmitter = await ethers.getContractFactory("RouterEventEmitter");
  const routerEventEmitter = await RouterEventEmitter.deploy()

  // initialize V2
  await factory.createPair(tokenA.address, tokenB.address)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = await ethers.getContractAt("NoahPair", pairAddress, wallet)

  const token0Address = await pair.token0()
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  await factory.createPair(WETH.address, WETHPartner.address)
  const WETHPairAddress = await factory.getPair(WETH.address, WETHPartner.address)
  const WETHPair = await ethers.getContractAt("NoahPair", WETHPairAddress, wallet)

  return {
    token0,
    token1,
    WETH,
    WETHPartner,
    factory,
    router, // the default router, 01 had a minor bug
    routerEventEmitter,
    pair,
    WETHPair
  }
}
