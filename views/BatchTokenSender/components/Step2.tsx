import { useContext, useState, useEffect, useMemo } from 'react'
import BatchTokenContext from 'context/BatchTokenContext'
import {
  useFeeData,
  useContract,
  useAccount,
  useProvider,
  useSigner,
} from 'wagmi'
import { BigNumber, BigNumberish, Contract, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { erc20ABI } from 'wagmi'
import { BatchTokenContract } from 'config/Contracts'
import Image from 'next/image'
import Link from 'next/link'
import multiSenderABI from 'abi/multiSender.json'
import { getContract } from '@wagmi/core'
import { IJsonRPCError } from 'types'
import Context from 'context/Context'
import { chunk, clone } from 'lodash'

export default function Step2() {
  const batchTokenData = useContext(BatchTokenContext)
  const { sendType, setBatchTokenData } = useContext(BatchTokenContext)
  const [totalToken, settotalToken] = useState(0)
  const [estimateGas, setestimateGas] = useState('')
  const [estimateGasOrg, setestimateGasOrg] = useState([] as any)
  const { data: gasFee, isError, isLoading } = useFeeData()
  const [approved, setapproved] = useState(true)
  const { address: walletAddr, isConnecting, isDisconnected } = useAccount()
  const [contract, setcontract] = useState({} as Contract | null)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [tokenContract, settokenContract] = useState({} as any)
  const [progress, setprogress] = useState('processing')
  const { setContext } = useContext(Context)
  const [progressErrorMsg, setprogressErrorMsg] = useState(
    'Some of your transfer transactions failed, please contact customer service to resolve.'
  )
  const [approveLoading, setapproveLoading] = useState('')

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

        getEstimation(contract).then((estimation) => {
          if (gasFee?.gasPrice && estimation) {
            console.log('gasFee', gasFee)
            let gasPrice = BigNumber.from(gasFee?.gasPrice)
            let estmationB = BigNumber.from(estimation)

            setestimateGas(
              formatUnits(gasPrice.mul(estmationB).toString(), 'ether')
            )
            console.log(
              'fee---',
              gasPrice.mul(estmationB).toString(),
              'gasarr',
              estimateGasOrg
            )
          }
        })
      }
    } catch (error) {
      console.log('error step2 65', error)
    }
  }, [batchTokenData.parsedAddress, gasFee, approved])

  useEffect(() => {
    if (batchTokenData.contractAddress) {
      const contract = getContract({
        address: batchTokenData.contractAddress,
        abi: multiSenderABI,
        signerOrProvider: provider,
      })
      setcontract(contract)
    }
    console.log('contract', contract)
  }, [batchTokenData.contractAddress])

  const caculateGas = async (addrs: string[][]) => {
    let addr: string[] = []
    let amn: string[] = []
    let sum: BigNumber = BigNumber.from('0')
    addrs.map((value) => {
      addr.push(value[0])
      const value1 = ethers.utils.parseUnits(
        value[1],
        batchTokenData.tokenDecimals
      )
      sum = BigNumber.from(value1).add(sum)
      amn.push(
        ethers.utils
          .parseUnits(value[1], batchTokenData.tokenDecimals)
          .toString()
      )
    })

    if (
      batchTokenData.unit === batchTokenData.gasUnit &&
      batchTokenData.tokenDecimals
    ) {
      console.log('batchTokenData.tokenDecimals', batchTokenData.tokenDecimals)
      // platform token
      let sumAmn = sum.toString()
      console.log('sum', sumAmn)
      const rawGasEstimation = await contract
        ?.connect(signer as any)
        .estimateGas.sendMultiETH(addr, amn, {
          value: sumAmn,
        })
      return BigNumber.from(rawGasEstimation)
    } else {
      // wildcard token
      if (batchTokenData.tokenAddress) {
        const rawGasEstimation = await contract
          ?.connect(signer as any)
          .estimateGas.sendMultiERC20(batchTokenData.tokenAddress, addr, amn)
        return BigNumber.from(rawGasEstimation)
      }
    }
    return 0
  }

  const getEstimation = async (contract: any) => {
    console.log('approved', approved)
    if (contract.estimateGas) {
      try {
        let chunkedAddr = chunk(batchTokenData.parsedAddress, 100)
        let totoalEstimation = BigNumber.from(0)
        let gasArr = []

        for (let index = 0; index < chunkedAddr.length; index++) {
          const addrs = chunkedAddr[index]
          const gas = await caculateGas(addrs)
          gasArr.push(gas)
          if (gas === 0) {
            throw new Error('Gas calculate error')
          }
          totoalEstimation = totoalEstimation.add(gas) // totoalEstimation += gas
        }
        console.log('gasArr', gasArr)
        setestimateGasOrg(gasArr)
        return totoalEstimation
      } catch (error: any) {
        console.log('estttttt err', error.message)
        if (error.message.indexOf('allowance') >= 0) {
          setContext({
            type: 'SET_ALERT',
            payload: {
              type: 'alert-error',
              message: 'Please approve first to get gas fee estimation',
              show: true,
            },
          })
          return false
        }

        setprogress('error')
        if (
          error.message.indexOf('cannot estimate gas') >= 0 ||
          error.message.indexOf('invalid decimal value')
        ) {
          setprogressErrorMsg(
            'Please set a reasonable amount or Check your wallet funds. Cannot estimate gas. transaction may fail or may require manual gas limit.'
          )
        }
        if (error?.data?.message?.indexOf('insufficient funds') >= 0) {
          setprogressErrorMsg('Insufficient funds')
        }
      }
    }
  }

  const getAllowance = async (contract: any) => {
    // contract batch token contract --mutisender
    try {
      if (batchTokenData.tokenAddress) {
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
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const approve = async () => {
    setapproveLoading('loading')
    try {
      let ap = await tokenContract
        ?.connect(signer)
        .approve(
          contract?.address,
          ethers.utils.parseUnits('20000000', batchTokenData.tokenDecimals)
        )
      const res = await ap.wait()
      setapproveLoading('')
      setapproved(true)
    } catch (error) {
      console.log('approve error', error)
      setapproveLoading('')
    }
  }

  const disApprove = async () => {
    let ap = await tokenContract
      ?.connect(signer)
      .approve(
        contract?.address,
        ethers.utils.parseUnits('0', batchTokenData.tokenDecimals)
      )
    ap.wait()
    setapproved(true)
  }

  useMemo(() => {
    if (batchTokenData.unit !== batchTokenData.gasUnit && contract) {
      getAllowance(contract)
    }
  }, [batchTokenData.gasUnit, batchTokenData.unit, contract])

  const goBack = () => {
    setBatchTokenData({ type: 'UPDATE_STEP', payload: 1 })
  }

  const preBatchSend = async () => {
    let res = false
    try {
      if (batchTokenData.parsedAddress.length > 100) {
        setContext({
          type: 'SET_ALERT',
          payload: {
            type: 'alert-warning',
            message: 'Sender will invoke many times due to too many addresses',
            show: true,
          },
        })

        const chunkedAddr = chunk(batchTokenData.parsedAddress, 100)
        console.log('chunkedAddr', chunkedAddr)

        for (let index = 0; index < chunkedAddr.length; index++) {
          const addrs = chunkedAddr[index]
          let end = false
          if (batchTokenData.parsedAddress.length === index + 1) {
            end = true
          }
          res = await batchSend(addrs, index)
          if (!res) {
            break
          }
        }
      } else {
        res = await batchSend(batchTokenData.parsedAddress, 0)
      }
      if (res) {
        setBatchTokenData({ type: 'UPDATE_STEP', payload: 3 })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const batchSend = async (addresses: string[][], index: number) => {
    console.log('estimateGasOrg', estimateGasOrg)
    if (contract && estimateGasOrg.length > 0) {
      let txn
      let result
      try {
        let addr: string[] = []
        let amn: string[] = []
        let sum: BigNumber = BigNumber.from('0')
        addresses.map((value) => {
          addr.push(value[0])
          const value1 = ethers.utils.parseUnits(
            value[1],
            batchTokenData.tokenDecimals
          )
          sum = BigNumber.from(value1).add(sum)
          amn.push(
            ethers.utils
              .parseUnits(value[1], batchTokenData.tokenDecimals)
              .toString()
          )
        })
        setprogress('loading')

        if (batchTokenData.unit === batchTokenData.gasUnit) {
          // platform token
          let sumAmn = sum.toString()

          txn = await contract?.connect(signer as any).sendMultiETH(addr, amn, {
            value: sumAmn,
            gasLimit: estimateGasOrg[index],
            maxFeePerGas: gasFee?.maxFeePerGas,
            maxPriorityFeePerGas: gasFee?.maxPriorityFeePerGas,
          })
          result = await txn.wait()
        } else {
          // wildcard token
          txn = await contract
            ?.connect(signer as any)
            .sendMultiERC20(batchTokenData.tokenAddress, addr, amn, {
              gasLimit: estimateGasOrg[index],
              maxFeePerGas: gasFee?.maxFeePerGas,
              maxPriorityFeePerGas: gasFee?.maxPriorityFeePerGas,
            })
          result = await txn.wait()
        }

        console.log('txn', txn)

        const txns = batchTokenData.txn
        txns.push(txn.hash)
        console.log('batchTokenData.txn', txns)
        setBatchTokenData({ type: 'UPDATE_TXN', payload: txns })

        return true
      } catch (error: unknown) {
        setprogress('error')
        const e = error as IJsonRPCError
        if (e.message.indexOf('user rejected') >= 0) {
          setprogressErrorMsg('User Rejected')
        }
        if (e.message === 'Internal JSON-RPC error.') {
          if (e.data.message.indexOf('gas required exceeds') >= 0) {
            setprogressErrorMsg('gas required exceeds')
          }
        }
        console.log('send err', e.message, e.code, e.data)
        return false
      }
    }
    return false
  }

  const removeAddr = (index: number) => {
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

              {/* <button
                className="w-40 bg-green-500 border-gray-300 btn rounded-2xl"
                onClick={disApprove}
              >
                DisApprove
              </button> */}
            </div>
            <div className="flex justify-end">
              {!approved && (
                <div
                  className={`w-40 bg-green-500 border-gray-300 btn rounded-2xl ${approveLoading}`}
                  onClick={approve}
                >
                  {/* <button className="h-1 bg-green-500 border-0 btn btn-square ">
                    xxx
                  </button> */}
                  Approve
                </div>
              )}
              {approved && estimateGas && (
                <button
                  className="w-40 ml-5 bg-black border-gray-300 btn rounded-2xl"
                  onClick={preBatchSend}
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
              <p className="w-full px-3 mb-20 font-bold text-center">
                {progressErrorMsg}
              </p>

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
