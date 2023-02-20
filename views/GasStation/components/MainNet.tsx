import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  ReactEventHandler,
  ChangeEventHandler,
} from 'react'
import SelectChain from 'components/SelectChain'
import Image from 'next/image'
import { contractInfosType } from 'types'
import { useAccount, Chain, useNetwork } from 'wagmi'
import { fetchBalance } from '@wagmi/core'
import { clone } from 'lodash'
import { getContract } from '@wagmi/core'
import gasStation from 'abi/gasStation.json'
import swapRouterABI from 'abi/swapRouter.json'
import { useSigner, useProvider } from 'wagmi'
import useAllowance from 'hooks/useAllowance'
import { erc20ABI } from 'wagmi'
import { parseUnits, isAddress, formatUnits } from 'ethers/lib/utils.js'

import Context from 'context/Context'
import { getProvider } from '@wagmi/core'

// import { useContext, useState, useEffect, useMemo } from 'react'

export interface MainNetProps {
  gasStationContractInfo: contractInfosType
}

export function MainNet({ gasStationContractInfo }: MainNetProps) {
  const {
    address: userAddress,
    connector: activeConnector,
    isConnected,
  } = useAccount()
  const { chain, chains } = useNetwork()
  // const { connect, connectors, error, isLoading, pendingConnector } =
  //   useConnect({ connector: new InjectedConnector() })

  const [balance, setbalance] = useState({ formatted: '', symbol: '' })
  const [connected, setconnected] = useState(false)
  const [receiverInfo, setreceiverInfo] = useState({
    chain: {} as Chain,
    amount: 0, //usdt
    address: '',
  })

  const { data: signer } = useSigner()
  useAccount
  const provider = useProvider()
  const [gasStationContract, setgasStationContract] = useState({} as any)
  const [swapRouterContract, setswapRouterContract] = useState({} as any)
  const [gasStationReceiverContract, setgasStationReceiverContract] = useState(
    {} as any
  )
  const [chainW, setchainW] = useState({} as Chain)
  const [chainsW, setchainsW] = useState([] as Chain[])
  const [payChain, setpayChain] = useState({} as Chain)
  const [getTokenCount, setgetTokenCount] = useState('0')
  const [tokenLoading, settokenLoading] = useState(false)
  const [tokenSymbol, settokenSymbol] = useState('')
  const [timer, settimer] = useState({} as any)
  const [paying, setpaying] = useState(false)
  const fetchErc20Allowance = useAllowance()
  const [allowance, setallowance] = useState(0)
  const { setContext } = useContext(Context)

  useEffect(() => {
    isConnected && setconnected(isConnected)
    if (!isConnected) {
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-error',
          message: 'Please connect wallet',
          show: true,
        },
      })
    }
  }, [isConnected, activeConnector, setContext])

  useEffect(() => {
    if (chains && chains[0]?.id !== 1) {
      setchainsW(chains)
    }

    if (chain) {
      if (!receiverInfo.chain.id) {
        setreceiverInfo({ ...receiverInfo, chain })
      }
      if (tokenSymbol === '') {
        settokenSymbol(chain?.nativeCurrency?.symbol)
      }
      setchainW(chain)
      setpayChain(chain)
    }
  }, [chain, chains, receiverInfo])

  useEffect(() => {
    payChain.id &&
      userAddress &&
      gasStationContractInfo[payChain.id].staableCoin?.address &&
      fetchBalance({
        address: userAddress as any,
        token: gasStationContractInfo[payChain.id].staableCoin?.address as any,
      }).then((balance) => {
        setbalance(balance)
      })
  }, [userAddress, gasStationContractInfo, payChain?.id, chainW?.id])

  useEffect(() => {
    const contactInfo = gasStationContractInfo[payChain.id]
    if (contactInfo && signer) {
      // get allowance
      fetchErc20Allowance(
        contactInfo.staableCoin.address,
        contactInfo.contractAddress,
        userAddress as `0x${string}`,
        signer
      ).then((allowance) => {
        setallowance(allowance)
      })
    }
  }, [gasStationContractInfo, payChain.id, signer, userAddress])

  // ANCHOR get contracts
  useEffect(() => {
    if (
      payChain.id &&
      signer &&
      gasStationContractInfo[payChain.id].contractAddress
    ) {
      const receiVerProvider = getProvider({ chainId: receiverInfo.chain.id })

      const gasStationContract = getContract({
        address: gasStationContractInfo[payChain.id].contractAddress,
        abi: gasStation,
        signerOrProvider: signer,
      })
      setgasStationContract(gasStationContract)

      // receiver
      console.log(
        'gasStationContractInfo[receiverInfo.chain.id].contractAddress',
        gasStationContractInfo[receiverInfo.chain.id].contractAddress
      )
      const gasStationReceiverContract = getContract({
        address: gasStationContractInfo[receiverInfo.chain.id].contractAddress,
        abi: gasStation,
        signerOrProvider: receiVerProvider,
      })

      setgasStationReceiverContract(gasStationReceiverContract)

      const getTokenAmn = getContract({
        address:
          gasStationContractInfo[receiverInfo.chain.id].swaprouterContract,
        abi: swapRouterABI,
        signerOrProvider: receiVerProvider,
      })
      setswapRouterContract(getTokenAmn)
      // --receiver
    }
  }, [gasStationContractInfo, signer, payChain.id, receiverInfo])

  const receivingChainChange = (chain: Chain) => {
    const receiver = clone(receiverInfo)
    receiver.chain = chain
    setreceiverInfo(receiver)
    settokenSymbol(chain?.nativeCurrency?.symbol)
    setreceiverInfo({ ...receiverInfo, amount: 0 })
    setgetTokenCount('0')
  }

  const paymentChainChange = (chain: Chain) => {
    // setreceiverInfo({ ...receiverInfo, chain })
    setpayChain(chain)
    setgetTokenCount('0')
    setreceiverInfo({ ...receiverInfo, amount: 0 })
  }

  const calcalNativeCurrency = async (amount: number) => {
    const decimals =
      gasStationContractInfo[receiverInfo.chain.id].staableCoin?.decimals
    const wtokenDecimals =
      gasStationContractInfo[receiverInfo.chain.id].WToken?.decimals

    const nativeCurrencyAmn = await swapRouterContract.getAmountsOut(
      parseUnits(amount.toString(), decimals).toString(),
      [
        gasStationContractInfo[receiverInfo.chain.id].staableCoin?.address,
        gasStationContractInfo[receiverInfo.chain.id].WToken?.address,
      ]
    )

    return formatUnits(nativeCurrencyAmn[1], wtokenDecimals).toString()
  }

  const receiveAmnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid) {
      const amount = Number(e.target.value)
      setreceiverInfo({ ...receiverInfo, amount })
      settokenLoading(true)
      clearTimeout(timer)
      const timerLocal = setTimeout(async () => {
        try {
          const curNum = await calcalNativeCurrency(amount)
          setgetTokenCount(curNum)
        } catch (error) {
          console.log('receiveAmnChange error', error)
          setgetTokenCount(amount.toString())
        }
        settokenLoading(false)
      }, 1000)
      settimer(timerLocal)
    } else {
      setgetTokenCount('0')
    }
  }

  const receiveAddrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setreceiverInfo({ ...receiverInfo, address: e.target.value })
  }

  const receiveAmnFocus = () => {
    setreceiverInfo({ ...receiverInfo, amount: 0 })
    setgetTokenCount('0')
  }

  const swap = async () => {
    let toWei = 1e18
    switch (receiverInfo.chain.nativeCurrency.decimals) {
      case 6:
        toWei = 1e6
        break
    }
    let amount = receiverInfo.amount * toWei
    let message
    let err = false
    if (receiverInfo.amount < 1 || receiverInfo.amount > 10) {
      message = 'Please check your form, Amount should be $1-$10'
      err = true
    }
    console.log(
      'isAddress(receiverInfo.address)',
      isAddress(receiverInfo.address)
    )

    if (!isAddress(receiverInfo.address)) {
      message = 'Please check your form, Receiving address'
      err = true
    }

    // receiverInfo.chain.id &&
    if (err) {
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-error',
          message,
          show: true,
        },
      })
      setpaying(false)
      return false
    }

    setpaying(true)
    const txn = await gasStationContract.deposit(
      amount.toString(),
      receiverInfo.chain.id,
      receiverInfo.address
    )

    let tries = 1
    console.log('receiverInfo.chain.id,', receiverInfo.chain.id)
    let timer = setInterval(async () => {
      const result = await gasStationReceiverContract.state(
        receiverInfo.chain.id,
        txn.hash
      )
      console.log('result', result)
      if (result) {
        console.log('result', result)
        setContext({
          type: 'SET_ALERT',
          payload: {
            type: 'alert-success',
            message: 'Successed',
            show: true,
          },
        })
        setpaying(false)
        clearInterval(timer)
      }
      tries += 1
      if (tries > 500) {
        setContext({
          type: 'SET_ALERT',
          payload: {
            type: 'alert-error',
            message: 'get gas error please cotact us',
            show: true,
          },
        })
        clearInterval(timer)
        setpaying(false)
      }
    }, 2000)
  }

  const approve = async () => {
    try {
      if (signer) {
        const tokenContract = getContract({
          address: gasStationContractInfo[payChain.id].staableCoin?.address,
          abi: erc20ABI,
          signerOrProvider: signer,
        })

        let ap = await tokenContract
          ?.connect(signer)
          .approve(
            gasStationContractInfo[payChain.id].contractAddress,
            parseUnits('20000000', payChain.nativeCurrency.decimals)
          )
        ap.wait()
        setallowance(20000000)
      }
    } catch (error) {
      console.log('approve error', error)
    }
  }

  return (
    <>
      <div className="container max-w-2xl mx-auto mt-10 mb-96">
        <p className="my-2 font-semibold">What kind of gas do you want?</p>
        <div className="flex w-full">
          {chainW && chainsW.length > 0 && (
            <SelectChain
              supportChains={chainsW}
              defaultChain={chainW}
              key="receiver"
              onChainChange={receivingChainChange}
            ></SelectChain>
          )}
        </div>
        <p className="my-2 font-semibold">How much you want to buy?</p>
        <div className="flex w-full">
          <div className="flex items-center pl-2 text-black border border-gray-300 rounded">
            <span className="mr-1 text-xl font-semibold">$</span>
            <input
              type="text"
              name="sendNum"
              className="h-12 "
              placeholder="1"
              onChange={receiveAmnChange}
              value={receiverInfo.amount}
              onFocus={receiveAmnFocus}
              pattern="[0-9]*"
            />
          </div>

          <div className="flex items-center justify-center mx-5">For</div>
          <div className="flex items-center w-full px-3 border border-gray-200 rounded">
            {tokenLoading ? (
              <button className="text-black bg-white border-0 btn btn-square loading"></button>
            ) : (
              getTokenCount
            )}{' '}
            {tokenSymbol}
          </div>
        </div>
        <input
          type="text"
          name="receiveAddress"
          className="w-full h-12 col-span-2 pl-2 mt-5 text-black border border-gray-300 rounded"
          placeholder="Receiving Address"
          onChange={receiveAddrChange}
          value={receiverInfo.address}
          onFocus={() => {
            setreceiverInfo({ ...receiverInfo, address: '' })
          }}
        />
        <h4 className="text-xl font-bold text-center my-7">Payment methods</h4>
        <div className="grid grid-cols-2 gap-4">
          {chainW && chainsW.length > 0 && (
            <SelectChain
              supportChains={chainsW}
              defaultChain={chainW}
              onChainChange={paymentChainChange}
              invokeWallet={true}
              key="payer"
            ></SelectChain>
          )}

          <div className="flex items-center pl-3 border border-gray-200 rounded">
            <Image
              src={`/images/coins/USDT.webp`}
              width={28}
              height={28}
              alt="chains"
            />
            <span className="flex items-center h-12 ml-5">USDT</span>
          </div>
        </div>
        <div className="flex mt-3 font-bold">
          <div>
            Your balance
            <span className="ml-1 text-blue-500">
              {balance?.formatted} {balance?.symbol}
            </span>
          </div>
          <div className="ml-auto">
            Bitool fee <span className="text-green-400">Free</span>
          </div>
        </div>

        {allowance > 2 &&
          connected &&
          (paying ? (
            <button className="w-full text-white bg-black border-0 btn btn-square loading"></button>
          ) : (
            <div
              className="flex items-center justify-center h-12 mt-3 text-lg font-bold text-white bg-black rounded-lg cursor-pointer"
              onClick={swap}
            >
              Pay <span className="mx-1"> {receiverInfo.amount} </span> USDT
            </div>
          ))}

        {connected && allowance <= 2 && (
          <button
            className="w-full bg-green-500 border-gray-300 btn rounded-2xl"
            onClick={approve}
          >
            Approve
          </button>
        )}
        {/* <div>{connected.toString()} xxx</div> */}
        {/*  {!connected && (
          // <div
          //   className="flex items-center justify-center h-12 mt-3 text-lg font-bold text-white bg-black rounded cursor-pointer"
          //   onClick={() => connect()}
          // >
          //   Connect
          // </div>
          // <ConnectBtn></ConnectBtn>
        )} */}
      </div>
    </>
  )
}
