import Image from 'next/image'
import {
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useAccount,
  useConnect,
} from 'wagmi'
import React, { useState, useEffect, useMemo, useContext } from 'react'
import { getAddress } from 'ethers/lib/utils.js'
import is from 'is_js'
import { fetchBalance } from '@wagmi/core'
import { useRouter } from 'next/router'
import { InjectedConnector } from 'wagmi/connectors/injected'
import BatchTokenContext from 'context/BatchTokenContext'
import { batchTokenContractInfoType, tokenOptionTypes } from 'types'
import { Select, Space } from 'antd'
import style from 'styles/BatchToken.module.css'

export default function TokenSelector() {
  const {
    chains: chaissw,
    error,
    pendingChainId,
    switchNetwork,
    switchNetworkAsync,
  } = useSwitchNetwork()
  const batchTokenData = useContext(BatchTokenContext)
  const { sendType, setBatchTokenData } = useContext(BatchTokenContext)
  const { connect, connectors, pendingConnector } = useConnect()

  const { chain, chains } = useNetwork()
  const { address, isConnecting, isDisconnected } = useAccount()

  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    address,
    chainId: chain?.id,
  })
  const { Option } = Select

  const router = useRouter()

  const supportChains = batchTokenData.supportChains

  const [currentChain, setcurrentChain] = useState(
    {} as batchTokenContractInfoType
  )
  const [tokenAddr, settokenAddr] = useState('')
  const [addrErr, setaddrErr] = useState({ show: false, message: '' })
  const [userBalance, setuserBalance] = useState({ count: '0', unit: 'USDC' })
  const [gasUnit, setgasUnit] = useState('')
  const [tokenOptions, settokenOptions] = useState([{} as tokenOptionTypes])

  let defaultChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN)
  if (typeof window !== 'undefined') {
    const localChainId = window.localStorage.getItem('defaultChainId')

    if (localChainId && localChainId !== '') {
      defaultChainId = Number(localChainId)
    }
  }

  useEffect(() => {
    try {
      let token = ''
      if (defaultChainId) {
        const chain = supportChains.filter(
          (value) => value.id === defaultChainId
        )
        setcurrentChain(chain[0])
        token =
          batchTokenData.tokenAddress !== ''
            ? batchTokenData.tokenAddress
            : chain[0].token
      }
      settokenAddr(token)
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    setBatchTokenData({
      type: 'UPDATE_CONTRACT_ADDRESS',
      payload: currentChain.contractAddress,
    })
  }, [currentChain, setBatchTokenData])

  /*   function validateChain() {
    try {
      if (currentChain.id !== chain?.id) {
        console.log('switch network')
        console.log('connectors[0]', connectors[0])
        switchNetworkAsync?.(currentChain.id).then(() => {
          if (connectors.length > 0) {
            connect({ connector: connectors[0] })
          }
          setBatchTokenData({
            type: 'UPDATE_CONTRACT_ADDRESS',
            payload: currentChain.contractAddress,
          })

          router.push({
            pathname: '/batch_token_sender',
            query: { chainId: currentChain.id },
          })
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  } 

  useEffect(() => {
    // switch network
    validateChain()
  }, [currentChain, chain, switchNetworkAsync])

  */

  useEffect(() => {
    if (balance && !batchTokenData.tokenAddress) {
      console.log('balance', balance)
      setuserBalance({
        count: Number(balance.formatted).toFixed(2).toString(),
        unit: balance.symbol,
      })
      setgasUnit(balance.symbol)
      setBatchTokenData({
        type: 'UPDATE_TOKEN',
        payload: {
          balance: Number(balance.formatted).toFixed(2),
          unit: balance.symbol,
          gasUnit: balance.symbol,
          tokenDecimals: balance.decimals,
        },
      })
    }
  }, [balance, currentChain])

  function chainChange(value: string) {
    console.log('chainChange', value)
    const chain = supportChains.filter((chain) => chain.name === value)
    setcurrentChain(chain[0])
    settokenAddr(chain[0].token)
    // url param will changed after wallet chain changed
    switchNetworkAsync?.(chain[0].id).then(() => {
      localStorage.setItem('defaultChainId', chain[0].id.toString())
    })
  }

  async function getUserBalance(tokenAddr: any) {
    if (chain) {
      try {
        const balance = await fetchBalance({
          address: address as any,
          chainId: chain.id,
          token: tokenAddr,
        })
        setuserBalance({
          count: Number(balance.formatted).toFixed(2).toString(),
          unit: balance.symbol,
        })
        setBatchTokenData({
          type: 'UPDATE_TOKEN',
          payload: {
            balance: Number(balance.formatted).toFixed(2),
            unit: balance.symbol,
            gasUnit,
            tokenDecimals: balance.decimals,
          },
        })
      } catch (error) {
        console.log('getUserBalance:error', error)
      }
    } else {
      console.log('no chain', chain)
    }
  }

  async function changeToken(e: React.ChangeEvent<HTMLInputElement>) {
    settokenAddr(e.target.value)
    try {
      // change
      if (e.target.value !== currentChain.token) {
        const validAddr = await getAddress(e.target.value)
        await getUserBalance(e.target.value)
        setBatchTokenData({
          type: 'UPDATE_TOKEN_ADDRESS',
          payload: e.target.value,
        })
        setaddrErr({ show: false, message: '' })
      }
    } catch (error) {
      setaddrErr({ show: true, message: 'unavailable address' })
    }
    // todo validate token address
  }

  useEffect(() => {
    const getBan = async () => {
      if (batchTokenData.tokenAddress) {
        await getUserBalance(batchTokenData.tokenAddress)
      }
    }
    getBan()
  }, [batchTokenData.tokenAddress])

  async function focusToken(value: any) {
    console.log('value', value)
  }

  async function tokenBlur() {
    if (tokenAddr === '') {
      settokenAddr(currentChain.token)
      setaddrErr({ show: false, message: '' })
    }
  }
  return (
    <>
      <div className="flex justify-between mt-10 text-gray-400">
        <b>Choose main net</b>
        <b>Token contract address</b>
        <b>
          <i className="not-italic text-black">Balance </i>
          <span className="text-green-400">
            {userBalance.count}
            <em className="not-italic"> {userBalance.unit}</em>
          </span>
        </b>
      </div>
      <div className={`grid grid-cols-3 mt-5 gap-7`}>
        <div className={`w-ful ${style.chooseChain}`}>
          {currentChain && currentChain.name && (
            <Select value={currentChain.name} onChange={chainChange}>
              {supportChains.map((chain) => {
                return (
                  <Option value={chain.name} label={chain.name} key={chain.id}>
                    <Space>
                      <Image
                        src={`/images/support_chains/${chain.name}.png`}
                        width={28}
                        height={28}
                        alt="chain"
                        className="mr-3 h-7 w-7"
                      ></Image>
                      {chain.name}
                    </Space>
                  </Option>
                )
              })}
            </Select>
          )}
        </div>
        <div className={`col-span-2 ${style.chooseToken}`}>
          <input
            type="text"
            placeholder="Type here"
            className="w-full bg-gray-200 input"
            value={tokenAddr}
            onChange={changeToken}
            onBlur={tokenBlur}
          />
          {/* <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Tags Mode"
            onChange={changeToken}
            options={tokenOptions}
            onFocus={focusToken}
          /> */}
        </div>
      </div>
      <p
        className={`pl-3 text-red-500 ${
          addrErr.show ? '' : 'hidden'
        } pt-2 text-right`}
      >
        {addrErr.message}
      </p>
    </>
  )
}
