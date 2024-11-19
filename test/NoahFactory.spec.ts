import { expect } from 'chai'
import { ethers } from 'hardhat'
import {Wallet, Contract, constants, BigNumber } from 'ethers'

import { getCreate2Address } from './shared/utilities'
import { factoryFixture } from './shared/fixtures'
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"

const { AddressZero } = constants

const TEST_ADDRESSES: [string, string] = [
  '0x1000000000000000000000000000000000000000',
  '0x2000000000000000000000000000000000000000'
]

describe('NoahFactory', () => {
  let wallet: Wallet, other: Wallet

  let factory: Contract
  beforeEach(async () => {
    [wallet, other] = await (ethers as any).getSigners()
    const ff = () =>{ return factoryFixture([wallet, other])}
    const fixture = await loadFixture(ff)
    factory = fixture.factory

  })

  it('feeTo, feeToSetter, allPairsLength', async () => {
    expect(await factory.feeTo()).to.eq(AddressZero)
    expect(await factory.admin()).to.eq(wallet.address)
    expect(await factory.allPairsLength()).to.eq(0)
  })

  async function createPair(tokens: [string, string]) {
    const NoahPair = await ethers.getContractFactory('NoahPair');
    const bytecode = NoahPair.bytecode
    const create2Address = getCreate2Address(factory.address, tokens, bytecode)
    await expect(factory.createPair(...tokens))
      .to.emit(factory, 'PairCreated')
      .withArgs(TEST_ADDRESSES[0], TEST_ADDRESSES[1], create2Address, BigNumber.from(1))

    await expect(factory.createPair(...tokens)).to.be.reverted // Noah: PAIR_EXISTS
    await expect(factory.createPair(...tokens.slice().reverse())).to.be.reverted // Noah: PAIR_EXISTS
    expect(await factory.getPair(...tokens)).to.eq(create2Address)
    expect(await factory.getPair(...tokens.slice().reverse())).to.eq(create2Address)
    expect(await factory.allPairs(0)).to.eq(create2Address)
    expect(await factory.allPairsLength()).to.eq(1)

    const pair = await ethers.getContractAt("NoahPair", create2Address, wallet)
    expect(await pair.factory()).to.eq(factory.address)
    expect(await pair.token0()).to.eq(TEST_ADDRESSES[0])
    expect(await pair.token1()).to.eq(TEST_ADDRESSES[1])
  }

  it('createPair', async () => {
    await createPair(TEST_ADDRESSES)
  })

  it('createPair:reverse', async () => {
    await createPair(TEST_ADDRESSES.slice().reverse() as [string, string])
  })

  it('createPair:gas', async () => {
    const tx = await factory.createPair(...TEST_ADDRESSES)
    const receipt = await tx.wait()
    expect(receipt.gasUsed).to.eq(2750187)
  })

  it('setFeeTo', async () => {
    await expect(factory.connect(other).setFeeTo(other.address)).to.be.revertedWith('Noah: FORBIDDEN')
    await factory.setFeeTo(wallet.address)
    expect(await factory.feeTo()).to.eq(wallet.address)
  })

  it('setAdmin', async () => {
    await expect(factory.connect(other).setAdmin(other.address)).to.be.revertedWith('Noah: FORBIDDEN')
    await factory.setAdmin(other.address)
    expect(await factory.admin()).to.eq(other.address)
    await expect(factory.setAdmin(wallet.address)).to.be.revertedWith('Noah: FORBIDDEN')
  })
})
