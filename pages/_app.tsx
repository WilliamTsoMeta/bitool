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
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { OKXWalletConnector } from 'config/Connectors/OKXWallet'
import getSupportChains from 'config/SupportChainsWagmi'
import { Chain } from 'wagmi'
import * as ga from '../lib/ga'
import { useRouter } from 'next/router'

/* import VConsole from 'vconsole'
const vConsole = new VConsole()
console.log('Hello world') */

const chainArr = getSupportChains()

const { chains, provider, webSocketProvider } = configureChains(
  chainArr as Chain[],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: false,
      },
    }),
    new OKXWalletConnector({
      chains,
    }),
    /* new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: false,
        shimChainChangedDisconnect: false,
      },
    }), */
  ],
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
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
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
      }, 5000)
    }
  }, [state.alert.show])

  return (
    <>
      <WagmiConfig client={client}>
        <Context.Provider value={{ ...state, setContext }}>
          <Head>
            <title>Bitool</title>
            <link rel="icon" href="/favicon.ico" />
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
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
