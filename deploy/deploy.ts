import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployOptions } from 'hardhat-deploy/types';
import { configs } from '../config/configs'

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
  const config = configs[name as keyof typeof configs]

  if (!config) {
    throw new Error(`No config found for network ${name}`)
  }
  console.log(config)

  const NoahPair = await ethers.getContractFactory('NoahPair');
  const hexCode = ethers.utils.keccak256(NoahPair.bytecode);
  console.log('NoahPair hexCode', hexCode);

  await deploy('Multicall3', {
    ...baseDeployArgs,
    args: [],
  });

  const NoahFactory = await deploy('NoahFactory', {
    ...baseDeployArgs,
    // _admin
    args: [config.ADMIN],
  });
  // setFeeTo
  const noahFactoryContract = await ethers.getContract("NoahFactory", deployer);
  await noahFactoryContract.setFeeTo(config.FEE_TO);

  await deploy('NoahRouter', {
    ...baseDeployArgs,
    args: [NoahFactory.address, config.WEOS],
  });
};
export default func;
func.id = 'deploy_noah'; // id required to prevent reexecution
func.tags = ['DeployNoah'];