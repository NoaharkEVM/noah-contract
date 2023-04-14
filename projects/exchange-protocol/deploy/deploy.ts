import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployOptions } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, getChainId, ethers, network} = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const { name } = network;
  const chainId = await getChainId();
  const baseDeployArgs: DeployOptions = {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: chainId === '17777',
  }
  const NoahPair = await ethers.getContractFactory('NoahPair');
  const hexCode = ethers.utils.keccak256(NoahPair.bytecode);
  console.log('NoahPair hexCode', hexCode);
  let FEE_TO = "0x38E414E2653cc063D24Db33e434E48260eb59831";
  let WEOS = "0xc00592aA41D32D137dC480d9f6d0Df19b860104F";
  // mainnet test contract
  if(name === 'mainnet'){
    await deploy('TEST', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Noah Project', 'TEST'],
    });
  }
  // test weos
  if(name === 'testnet'){
    WEOS = "0x6cCC5AD199bF1C64b50f6E7DD530d71402402EB6";
  }
  // testnet test contract
  if(name === 'testnet' || name === 'ganache' || name === 'hardhat') {
    await deploy('TEST', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Noah Project', 'TEST'],
    });
    await deploy('EOS', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Noah Project', 'EOS'],
    });
    await deploy('EUSD', {
      ...baseDeployArgs,
      contract: 'Test',
      args: ['Noah Project', 'EUSD'],
    });
    FEE_TO = deployer;
  }
  if(name === 'ganache' || name === 'hardhat'){
    const WEOS_CONTRACT = await deploy('WEOS', {
      ...baseDeployArgs,
      args: [],
    });
    WEOS = WEOS_CONTRACT.address;
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
  await noahFactoryContract.setFeeTo(FEE_TO);

  await deploy('NoahRouter', {
    ...baseDeployArgs,
    args: [NoahFactory.address, WEOS],
  });
};
export default func;
func.id = 'deploy_noah'; // id required to prevent reexecution
func.tags = ['DeployNoah'];