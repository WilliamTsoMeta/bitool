import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi'
import { useIsMounted } from 'usehooks-ts'
import { ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function ConnectBtn() {
  const router = useRouter()
  let defaultChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN)
  let defaultChainIdGasStation = Number(
    process.env.NEXT_PUBLIC_DEFAULT_CHAIN_GAS_STATION
  )
  let defaultChainIdBatchClaimer = Number(
    process.env.NEXT_PUBLIC_DEFAULT_CHAIN_BATCH_CLAIMER
  )
  const { chains: chaissw, switchNetworkAsync } = useSwitchNetwork()
  // ANCHOR hooks
  const { address, connector: activeConnector, isConnected } = useAccount()
  const isMounted = useIsMounted()
  const { disconnect } = useDisconnect()

  // ANCHOR data
  const [connected, setconnected] = useState(false)
  const [mounted, setmounted] = useState(false)
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { chain, chains } = useNetwork()

  // ANCHOR life cycle
  useEffect(() => {
    setmounted(isMounted())
  }, [isMounted])

  useEffect(() => {
    setconnected(isConnected)
    validateChain()
  }, [isConnected])

  useEffect(() => {
    validateChain()
  }, [router])

  function validateChain() {
    try {
      console.log('router.pathname', router.pathname)
      const timer = setTimeout(() => {
        let localChainId
        if (router.pathname.indexOf('batch_token_sender') >= 0) {
          localChainId = window.localStorage.getItem('defaultChainId')
        } else if (router.pathname.indexOf('gas_station') >= 0) {
          localChainId = window.localStorage.getItem(
            'defaultChainId_gas_station'
          )
        } else if (router.pathname.indexOf('batch_claimer') >= 0) {
          localChainId = window.localStorage.getItem(
            'defaultChainId_batch_claimer'
          )
        }

        if (localChainId && localChainId !== '') {
          defaultChainId = Number(localChainId)
        } else {
          if (router.pathname.indexOf('gas_station') >= 0) {
            defaultChainId = defaultChainIdGasStation
          }
          if (router.pathname.indexOf('batch_claimer') >= 0) {
            defaultChainId = defaultChainIdBatchClaimer
          }
        }

        if (chain?.id) {
          if (
            router.pathname.indexOf('batch_token_sender') >= 0 &&
            defaultChainId !== chain?.id
          ) {
            switchNetworkAsync?.(defaultChainId).then(() => {
              localStorage.setItem('defaultChainId', defaultChainId.toString())
            })
          } else if (
            router.pathname.indexOf('gas_station') >= 0 &&
            defaultChainIdGasStation !== chain?.id
          ) {
            switchNetworkAsync?.(defaultChainId).then(() => {
              localStorage.setItem(
                'defaultChainId_gas_station',
                defaultChainId.toString()
              )
            })
          } else if (router.pathname.indexOf('batch_claimer') >= 0) {
            switchNetworkAsync?.(defaultChainId).then(() => {
              localStorage.setItem(
                'defaultChainId_batch_claimer',
                defaultChainId.toString()
              )
            })
          }
        }
        clearTimeout(timer)
      }, 2000)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    let con = activeConnector ?? connectors[0]
    console.log('con-watch chain', con)
    const timer = setTimeout(() => {
      connect({ connector: con })
      validateChain()
      clearTimeout(timer)
    }, 3000)
  }, [chain, chain?.id])

  useEffect(() => {
    let con = activeConnector ?? connectors[0]
    console.log('con', con)
    connect({ connector: con })
  }, [])

  // ANCHOR methods

  // ANCHOR childs
  function ConnectorList() {
    if (mounted) {
      return (
        <div>
          {connectors.map((connector) => {
            return (
              <li className="my-2" key={connector.name}>
                <button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect({ connector })}
                >
                  <span>{connector.name}</span>

                  {/* <span className="text-xs">
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      ' (connecting)'}
                  </span> */}
                </button>
              </li>
            )
          })}

          {/* <span className="text-xs">{error && <div>{error.message}</div>}</span> */}
        </div>
      )
    } else {
      return ''
    }
  }

  if (connected && address) {
    return (
      <div className={`bg-black rounded-full btn`} onClick={() => disconnect()}>
        <Image
          src="/images/wallet.webp"
          alt="wallet"
          width={18}
          height={18}
          className="mr-2"
        />

        <span>{address?.slice(0, 4) + '...' + address?.slice(-4)}</span>
      </div>
    )
  } else {
    return (
      <div className="dropdown dropdown-hover dropdown-end dropdown-bottom">
        {connectors[0] && (
          <div
            className={`btn bg-black rounded-full`}
            // onClick={() => connect({ connector: connectors[0] })}
          >
            <Image
              src="/images/wallet.webp"
              alt="wallet"
              width={18}
              height={18}
              className="mr-2"
            />
            <span>Connect Wallet</span>
            <ul className="bg-black shadow dropdown-content menu rounded-box w-52">
              {ConnectorList()}
            </ul>
          </div>
        )}
      </div>
    )
  }
}
