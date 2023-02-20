import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { useReducer, useEffect } from 'react'
import { publicProvider } from 'wagmi/providers/public'
// import { avalanche } from 'config/OwnChains' // custom chain
import Context from 'context/Context'
import { ContextType } from 'types'
import { InjectedConnector } from 'wagmi/connectors/injected'
import getSupportChains from 'util/SupportChains'
import { Chain } from 'wagmi'

const chainArr = getSupportChains()

const { chains, provider, webSocketProvider } = configureChains(
  chainArr as Chain[],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [new InjectedConnector({ chains })],
  webSocketProvider,
})

function reducer(state: ContextType, action: { type: string; payload: any }) {
  switch (action.type) {
    case 'SET_ALERT':
      state.alert = action.payload
      return { ...state }
      break

    default:
      throw new Error('none type fit')
      break
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const initState = { alert: { type: 'error', message: '', show: false } }
  const [state, setContext] = useReducer(reducer, initState as ContextType)
  useEffect(() => {
    if (state.alert.show) {
      setTimeout(() => {
        setContext({
          type: 'SET_ALERT',
          payload: {
            show: false,
          },
        })
      }, 3000)
    }
  }, [state.alert.show])

  return (
    <>
      <WagmiConfig client={client}>
        <Context.Provider value={{ ...state, setContext }}>
          <Head>
            <title>Bitool</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          {state.alert.show ? (
            <div className="fixed cursor-pointer top-20 right-2">
              <div className={`shadow-lg alert ${state.alert.type}`}>
                <div
                  onClick={() => {
                    setContext({ type: 'SET_ALERT', payload: { show: false } })
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 w-6 h-6 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{state.alert.message}</span>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {chains && <Component {...pageProps} />}
        </Context.Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
