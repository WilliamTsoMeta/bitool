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

export default function ConnectBtn() {
  let defaultChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN)
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

  function validateChain() {
    try {
      const timer = setTimeout(() => {
        const localChainId = window.localStorage.getItem('defaultChainId')
        if (localChainId && localChainId !== '') {
          defaultChainId = Number(localChainId)
        }
        if (chain?.id && defaultChainId !== chain?.id) {
          switchNetworkAsync?.(defaultChainId).then(() => {
            localStorage.setItem('defaultChainId', defaultChainId.toString())
          })
        }
        clearTimeout(timer)
      }, 500)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    connect({ connector: connectors[0] })
    console.log('chain.id change', chain?.id)
    validateChain()
  }, [chain, chain?.id])

  useEffect(() => {
    connect({ connector: connectors[0] })
  }, [])

  // ANCHOR methods

  // ANCHOR childs
  /*   function ConnectorList() {
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
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </button>
              </li>
            )
          })}

          <span>{error && <div>{error.message}</div>}</span>
        </div>
      )
    } else {
      return ''
    }
  } */

  if (connected) {
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
            onClick={() => connect({ connector: connectors[0] })}
          >
            <Image
              src="/images/wallet.webp"
              alt="wallet"
              width={18}
              height={18}
              className="mr-2"
            />
            <span>Connect Wallet</span>
            {/* <ul className="pt-5 shadow dropdown-content menu rounded-box w-52 bg-slate-800">
            {ConnectorList()}
          </ul> */}
          </div>
        )}
      </div>
    )
  }
}
