import { useNetwork, useSwitchNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
export function useNetworkSwitcher() {
  const { chain } = useNetwork()
  const { chains, error, pendingChainId, switchNetwork, switchNetworkAsync } =
    useSwitchNetwork()

  const networkSwitcher = async (expectChainId: number) => {
    if (chain?.id !== expectChainId) {
      console.log('networkSwitcher')
      try {
        await switchNetworkAsync?.(expectChainId)
        return
      } catch (error) {
        console.log('networkSwitcher', error)
        return false
      }
    }
    return false
  }

  const networkMannualSwitcher = async (expectChainId: number) => {
    try {
      console.log('networkMannualSwitcher', expectChainId)
      return await switchNetworkAsync?.(expectChainId)
    } catch (error) {
      console.log('networkMannualSwitcher', error)
      return false
    }
  }

  return { networkSwitcher, networkMannualSwitcher }
}
