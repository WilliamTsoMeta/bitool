import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { erc20ABI } from 'wagmi'
import { getContract } from '@wagmi/core'
import { Signer } from 'ethers'

const useAllowance = () => {
  const fetchErc20Allowance = async (
    tokenContractAddress: string,
    spenderAddress: `0x${string}`,
    address: `0x${string}`,
    signer: Signer
  ) => {
    try {
      const tokenContract = getContract({
        address: tokenContractAddress,
        abi: erc20ABI,
        signerOrProvider: signer,
      })
      const res = await tokenContract.allowance(address, spenderAddress)
      return Number(res.toString())
    } catch (e) {
      return Number(0)
      console.error(e)
    }
  }

  return fetchErc20Allowance
}

export default useAllowance
