import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployOptions } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, getChainId, ethers, network} = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const { name } = network;
  const chainId = await getChainId();
  const signers = await ethers.getSigners();
  const baseDeployArgs: DeployOptions = {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: chainId === '1',
  }
  const NoahPair = await ethers.getContractFactory('NoahPair');
  const hexCode = ethers.utils.keccak256(NoahPair.bytecode);
  console.log('NoahPair hexCode', hexCode);
  let WEOS = "";
  if(name === 'testnet' || name === 'ganache' || name === 'hardhat') {
    await deploy('TEST', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Evm Project', 'TEST'],
    });
    await deploy('EOS', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Evm Project', 'EOS'],
    });
    await deploy('EUSD', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Evm Project', 'EUSD'],
    });
  }
  if(name === 'ganache' || name === 'hardhat'){
    const WEOS_CONTRACT = await deploy('WEOS', {
      ...baseDeployArgs,
      args: [],
    });
    WEOS = WEOS_CONTRACT.address;
  }
  if(name === 'testnet'){
    WEOS = "0x6cCC5AD199bF1C64b50f6E7DD530d71402402EB6";
  }


  await deploy('Multicall3', {
    ...baseDeployArgs,
    args: [],
  });

  const NoahFactory = await deploy('NoahFactory', {
    ...baseDeployArgs,
    // _admin
    args: [deployer],
  });
  // setFeeTo
  const noahFactoryContract = await ethers.getContract("NoahFactory", deployer);
  await noahFactoryContract.setFeeTo(deployer);

  await deploy('NoahRouter', {
    ...baseDeployArgs,
    args: [NoahFactory.address, WEOS],
  });
};
export default func;
func.id = 'deploy_noah'; // id required to prevent reexecution
func.tags = ['DeployNoah'];