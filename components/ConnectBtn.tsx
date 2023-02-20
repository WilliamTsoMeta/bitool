import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { useIsMounted } from 'usehooks-ts'
import { ReactElement, useEffect, useState } from 'react'
// import { useNetworkSwitcher } from 'hooks/useNetworkSwitcher'
import Image from 'next/image'
// import { InjectedConnector } from 'wagmi/connectors/injected'

export default function ConnectBtn() {
  // ANCHOR hooks
  const { address, connector: activeConnector, isConnected } = useAccount()
  const isMounted = useIsMounted()
  // const { connect, connectors, error, isLoading, pendingConnector } =
  //   useConnect()
  const { disconnect } = useDisconnect()

  // ANCHOR data
  const [connected, setconnected] = useState(false)
  const [mounted, setmounted] = useState(false)
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  // ANCHOR life cycle
  useEffect(() => {
    setmounted(isMounted())
  }, [isMounted])

  useEffect(() => {
    setconnected(isConnected)
    // networkSwitcher(EXPECT_CHAIN_ID);
  }, [isConnected])

  // useEffect(() => {
  //   connectors[0] && connect && connect({ connector: connectors[0] })
  // }, [connectors, connect])

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

  /* if (isConnected)
    return 

  return (
    <button
      className={`btn ${styles.connectBtn} lg:w-44 `}
      onClick={() => connect()}
    >
      
    </button>
  ); */
}
