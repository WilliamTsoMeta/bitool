import { Select, Space } from 'antd'
import { createGlobalStyle } from 'styled-components'
import { useState, useContext, useEffect } from 'react'
import { supportChainType } from 'types'
import Image from 'next/image'
import {
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useAccount,
  useConnect,
  Chain,
} from 'wagmi'

import Context from 'context/Context'

interface Props {
  supportChains: Chain[]
  defaultChain: Chain
  onChainChange: Function
  invokeWallet?: boolean
  label?: string
  chainStorageName?: string
  key2?: string
}
export default function SelectChain(props: Props) {
  const { setContext } = useContext(Context)
  const { Option } = Select
  const { chain, chains } = useNetwork()
  const [notSupport, setnotSupport] = useState(false)
  const {
    chains: chaissw,
    error,
    pendingChainId,
    switchNetwork,
    switchNetworkAsync,
  } = useSwitchNetwork()

  const GlobalStyle = createGlobalStyle`
    .chooseChain {
      /* .ant-select{
        width: 100%;
      } */
      .ant-select-selector {
        height: 46px !important;
        /* border: 1px solid #355dff !important; */
        line-height: 46px;
      }
      .ant-select-selection-item {
        line-height: 46px;
      }
      .ant-space {
        line-height: 46px;
      }
      .ant-select {
        width: 100%;
      }
    }
  `
  const [currentChain, setcurrentChain] = useState(props.defaultChain)

  useEffect(() => {
    if (props.supportChains && props.defaultChain) {
      const exist = props.supportChains.filter((value) => {
        return props.defaultChain.id === value.id
      })
      console.log('exist', exist, props.defaultChain.id, 'key', props.key2)
      exist.length === 0 ? setnotSupport(true) : setnotSupport(false)
    }
    setcurrentChain(props.defaultChain)
  }, [props.defaultChain, props.supportChains, chain, chain?.id])

  async function chainChange(value: string) {
    try {
      const selectChain = props.supportChains.filter(
        (chain: Chain) => chain.name === value
      )
      // url param will changed after wallet chain changed
      if (props.invokeWallet && selectChain[0].id !== chain?.id) {
        await switchNetworkAsync?.(selectChain[0].id).then(() => {
          localStorage.setItem(
            props.chainStorageName ?? 'defaultChainId',
            selectChain[0].id.toString()
          )
        })
      }
      setcurrentChain(selectChain[0])
      props.onChainChange(selectChain[0])
    } catch (error) {
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'error',
          message: 'User reject switch network',
          show: true,
        },
      })
    }
  }

  return (
    <div className="w-full">
      <GlobalStyle></GlobalStyle>
      <div className={`chooseChain`}>
        {!notSupport && currentChain.name && (
          <Select onChange={chainChange} value={currentChain.name}>
            {props.supportChains.map((chain) => {
              let name = ''
              return (
                <Option value={chain.name} label={chain.name} key={chain.id}>
                  <div className="flex items-center h-11">
                    <Image
                      src={`/images/support_chains/${chain.id}.png`}
                      width={28}
                      height={28}
                      alt="chain"
                      className="mr-3 h-7 w-7"
                    ></Image>
                    <span className="">
                      {chain.name}{' '}
                      {props.label === 'token' && chain.nativeCurrency.symbol}
                    </span>
                  </div>
                </Option>
              )
            })}
          </Select>
        )}
        {notSupport && (
          <div className="px-2 py-3 font-bold border">
            Please switch chain in your wallet
          </div>
        )}
      </div>
    </div>
  )
}
