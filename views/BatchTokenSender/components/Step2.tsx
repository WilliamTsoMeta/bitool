import { useContext, useState, useEffect, useMemo } from 'react'
import BatchTokenContext from 'context/BatchTokenContext'
import {
  useFeeData,
  useContract,
  useAccount,
  useProvider,
  useSigner,
} from 'wagmi'
import { BigNumber, Contract, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { erc20ABI } from 'wagmi'
import { BatchTokenContract } from 'config/Contracts'
import Image from 'next/image'
import Link from 'next/link'
import multiSenderABI from 'abi/multiSender.json'
import { getContract } from '@wagmi/core'
import { IJsonRPCError } from 'types'

export default function Step2() {
  const batchTokenData = useContext(BatchTokenContext)
  const { sendType, setBatchTokenData } = useContext(BatchTokenContext)
  const [totalToken, settotalToken] = useState(0)
  const [estimateGas, setestimateGas] = useState('')
  const { data: gasFee, isError, isLoading } = useFeeData()
  const [approved, setapproved] = useState(true)
  const { address: walletAddr, isConnecting, isDisconnected } = useAccount()
  const [contract, setcontract] = useState({} as Contract | null)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [tokenContract, settokenContract] = useState({} as any)
  const [progress, setprogress] = useState('processing')
  const [progressErrorMsg, setprogressErrorMsg] = useState(
    'Some of your transfer transactions failed, please contact customer service to resolve.'
  )

  useEffect(() => {
    try {
      if (batchTokenData.parsedAddress.length > 0) {
        let total = 0
        let addressCount = batchTokenData.parsedAddress.map((item) =>
          Number(item[1])
        )
        let totalSum = addressCount.reduce((acc, curr) => acc + curr, 0)
        total = Number(totalSum.toFixed(4))
        settotalToken(total)

        if (gasFee) {
          setestimateGas(
            formatUnits(Number(gasFee.formatted.gasPrice) * total, 'ether')
          )
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }, [batchTokenData.parsedAddress, gasFee])

  useEffect(() => {
    console.log(
      'batchTokenData.contractAddress',
      batchTokenData.contractAddress
    )
    if (batchTokenData.contractAddress) {
      const contract = getContract({
        address: batchTokenData.contractAddress,
        abi: multiSenderABI,
      })
      setcontract(contract)
    }
    console.log('contract', contract)
  }, [batchTokenData.contractAddress])

  const getAllowance = async (contract: any) => {
    // contract batch token contract --mutisender
    try {
      const tokenContract = new ethers.Contract(
        batchTokenData.tokenAddress,
        erc20ABI,
        provider
      )
      settokenContract(tokenContract)
      const allowance = await tokenContract.allowance(
        walletAddr,
        contract.address
      )
      if (Number(allowance) <= 0) {
        setapproved(false)
      } else {
        setapproved(true)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const approve = async () => {
    try {
      let ap = await tokenContract
        ?.connect(signer)
        .approve(
          contract?.address,
          ethers.utils.parseUnits('20000000', batchTokenData.tokenDecimals)
        )
      ap.wait()
      setapproved(true)
    } catch (error) {
      console.log('approve error', error)
    }
  }

  useMemo(() => {
    if (batchTokenData.unit !== batchTokenData.gasUnit && contract) {
      getAllowance(contract)
    }
  }, [batchTokenData.gasUnit, batchTokenData.unit, contract])

  const goBack = () => {
    setBatchTokenData({ type: 'UPDATE_STEP', payload: 1 })
  }

  const batchSend = async () => {
    if (contract) {
      let txn
      let result
      try {
        let addr: string[] = []
        let amn: string[] = []
        let sum: number = 0
        batchTokenData.parsedAddress.map((value) => {
          console.log('value', value)
          addr.push(value[0])
          sum += Number(value[1])
          amn.push(
            ethers.utils
              .parseUnits(value[1], batchTokenData.tokenDecimals)
              .toString()
          )
        })
        setprogress('loading')
        console.log('addr', addr)
        console.log('contract', contract)

        if (batchTokenData.unit === batchTokenData.gasUnit) {
          console.log('amn', amn)

          // platform token
          let sumAmn = ethers.utils.parseUnits(
            sum.toFixed(4),
            batchTokenData.tokenDecimals
          )
          console.log('sum.toFixed(4)', sum.toFixed(4))
          console.log('addr', addr)

          txn = await contract?.connect(signer as any).sendMultiETH(addr, amn, {
            value: sumAmn,
          })
          result = await txn.wait()
        } else {
          // wildcard token
          txn = await contract
            ?.connect(signer as any)
            .sendMultiERC20(batchTokenData.tokenAddress, addr, amn)
          result = await txn.wait()
        }
        console.log('txn', txn)
        setBatchTokenData({ type: 'UPDATE_STEP', payload: 3 })
      } catch (error: unknown) {
        setprogress('error')
        const e = error as IJsonRPCError
        if (e.message.indexOf('user rejected') >= 0) {
          setprogressErrorMsg('User Rejected')
        }
        console.log('send err', e.message, e.code, e.data)
      }
    }
  }

  const removeAddr = (index: number) => {
    console.log(
      'batchTokenData.parsedAddress',
      batchTokenData.parsedAddress.length
    )
    if (batchTokenData.parsedAddress.length > 1) {
      let tempArr = [...batchTokenData.parsedAddress]
      tempArr.splice(index, 1)
      setBatchTokenData({ type: 'UPDATE_PARSED_ADDRESS', payload: tempArr })
    }
  }

  return (
    <>
      {progress === 'processing' && (
        <div>
          <div className="mt-10 overflow-x-auto border border-gray-200 rounded">
            <table className="table w-full">
              <tbody>
                <tr>
                  <td>Total addresses</td>
                  <td className="font-bold text-right">
                    {batchTokenData.parsedAddress.length}
                  </td>
                </tr>
                <tr>
                  <td>Total token to send</td>
                  <td className="font-bold text-right">
                    {totalToken} <span>{batchTokenData.unit}</span>
                  </td>
                </tr>
                <tr>
                  <td>Your balance</td>
                  <td className="font-bold text-right">
                    {batchTokenData.balance} <span>{batchTokenData.unit}</span>
                  </td>
                </tr>
                <tr>
                  <td>Bitool fee</td>
                  <td className="font-bold text-right">
                    <i className="px-2 text-sm not-italic text-white bg-green-400 rounded">
                      free
                    </i>
                  </td>
                </tr>
                <tr>
                  <td>Gas fee estimation</td>
                  <td className="font-bold text-right">
                    {estimateGas} <span>{batchTokenData.gasUnit}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-2xl font-bold py-7">Address</h3>
          <div className="overflow-x-auto overflow-y-auto max-h-80">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>ADDRESS</th>
                  <th>AMOUNT</th>
                  <th>OPERATE</th>
                </tr>
              </thead>
              <tbody>
                {batchTokenData.parsedAddress.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{value[0]}</td>
                      <td>
                        {value[1]}
                        <span> {batchTokenData.unit}</span>
                      </td>
                      <td>
                        <span
                          className="text-red-500 cursor-pointer"
                          onClick={() => {
                            removeAddr(index)
                          }}
                        >
                          Remove
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 mt-5">
            <div>
              <button
                className="w-40 border-gray-300 btn btn-outline rounded-2xl"
                onClick={goBack}
              >
                back
              </button>
            </div>
            <div className="flex justify-end">
              {!approved && (
                <button
                  className="w-40 bg-green-500 border-gray-300 btn rounded-2xl"
                  onClick={approve}
                >
                  Approve
                </button>
              )}
              {approved && (
                <button
                  className="w-40 ml-5 bg-black border-gray-300 btn rounded-2xl"
                  onClick={batchSend}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {progress !== 'processing' && (
        <div className="flex flex-col items-center mt-10 bg-white border border-gray-200 rounded-xl">
          {progress === 'loading' && (
            <div className="my-72">
              <button className="loading btn spin"></button>
            </div>
          )}
          {progress === 'error' && (
            <>
              <Image
                src="/images/error.webp"
                width={60}
                height={60}
                alt="error"
                className="mt-20 mb-14"
              />
              <p className="mb-20 font-bold">{progressErrorMsg}</p>

              <div className="grid w-11/12 grid-cols-2 gap-5">
                <button
                  className="w-full mb-10 text-white bg-black btn btn-outline rounded-2xl"
                  onClick={goBack}
                >
                  back
                </button>
                <Link
                  className="w-full mb-10 text-white bg-black btn btn-outline rounded-2xl"
                  onClick={goBack}
                  href="https://t.me/Yvoone_Bitool"
                >
                  Contact us
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
