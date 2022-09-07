import { ethers } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';

export const approveErc20 = async (
  erc20Address: string,
  spenderAddress: string,
  amount: string,
  signer: Address
) => {
  const erc20Token = await ethers.getContractAt(
    'IERC20',
    erc20Address,
    // @ts-expect-error
    signer
  );

  const tx = await erc20Token.approve(spenderAddress, amount);
  await tx.wait(1);
  console.log('Approved!');
};
