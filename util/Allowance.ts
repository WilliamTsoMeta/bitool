import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { useAccount, erc20ABI, useSigner } from 'wagmi'
import { getContract } from '@wagmi/core'
import { Signer } from 'ethers'

export function getAllowance(
  address: string,
  tokenContractAddress: string,
  spenderAddress: string,
  signer: Signer,
  dependency?: any
): BigNumber {
  let allowance = BigNumber(0)
  let tokenContract = {} as Contract

  const tokenContract = getContract({
    address: tokenContractAddress,
    abi: erc20ABI,
    signerOrProvider: signer,
  })
  settokenContract(tokenContract)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.allowance(address, spenderAddress)
        setAllowance(new BigNumber(res.toString()))
      } catch (e) {
        console.error(e)
      }
    }

    if (address && tokenContract) {
      fetch()
    }
  }, [address, spenderAddress, tokenContract, dependency])

  return allowance
}
