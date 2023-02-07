import { useFeeData, useContract, useAccount } from 'wagmi'
import multiSenderABI from 'abi/multiSender.json'
import { useSigner, useProvider } from 'wagmi'

export function BatchTokenContract(contractAddress: string) {
  const provider = useProvider()
  return useContract({
    address: contractAddress, //'0x94253f7AB560Ac9de9734c25eFee6FCa24310408',
    abi: multiSenderABI,
    signerOrProvider: provider,
  })
}
