import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
//import GaugeFactoryJson from '../../deployments/localhost/GaugeFactory.json';
//import VoterJson from '../../deployments/localhost/Voter.json';

task('mint_test', 'mint test token').setAction(async function(taskArguments, { ethers }) {
  const [deployer] = await ethers.getSigners();

  let Test = await ethers.getContractFactory('Test');
  let test = Test.attach('0xdF5CB050406c1D1d8C8f8E196C15A0dD3EC21C9A');

  let NoahFactory = await ethers.getContractFactory('NoahFactory');
  let noahFactory = NoahFactory.attach('0xE25308B52d349A2dC8f0F5C2cDdA8Cb4853beCfD');
  await noahFactory.setAdmin("0x5EB954fB68159e0b7950936C6e1947615b75C895")
  console.log(await test.transferOwnership("0x5EB954fB68159e0b7950936C6e1947615b75C895"))

});
