import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import SelectChain from 'components/SelectChain'
import Image from 'next/image'
import { supportChainType } from 'types'
import { Chain, useNetwork, useAccount } from 'wagmi'
import Link from 'next/link'
import { contractInfosType } from 'types'

export interface MainNetProps {
  gasStationContractInfo: contractInfosType
}

export function TestNet({ gasStationContractInfo }: MainNetProps) {
  const {
    address: userAddress,
    connector: activeConnector,
    isConnected,
  } = useAccount()
  const { chain, chains } = useNetwork()

  const [chainW, setchainW] = useState({} as Chain)
  const [chainsW, setchainsW] = useState([] as Chain[])

  useEffect(() => {
    let chainsSupp = chains.filter((chain: Chain) => {
      return Object.keys(gasStationContractInfo).includes(chain.id.toString())
    })
    if (chainsW.length === 0 && chainsSupp && chainsSupp[0]?.id !== 1) {
      // why this? Forgot!!
      setchainsW(chainsSupp)
    }

    if (chain) {
      setchainW(chain)
    }
  }, [chain, chains])

  return (
    <>
      <div className="container max-w-2xl px-5 mx-auto mt-10 mb-96 lg:px-0">
        {chainsW.map((chain, index) => {
          return (
            <div className="grid grid-cols-4 gap-4 mt-3" key={index}>
              <div className="flex items-center h-12 col-span-3 pl-3 border border-gray-200 rounded">
                <Image
                  src={`/images/support_chains/${chain.id}.png`}
                  width={28}
                  height={28}
                  alt="chains"
                />
                <span className="ml-5">
                  {chain.name} {chain.nativeCurrency.symbol} Faucet
                </span>
              </div>
              <Link
                href={gasStationContractInfo[chain.id]?.Faucet ?? ''}
                className="col-span-1"
                target="_blank"
              >
                <button className="w-full bg-black btn">Go</button>
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}
