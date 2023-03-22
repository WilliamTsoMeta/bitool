import Header from 'components/Header'
import Footer from 'components/Footer'
import Image from 'next/image'
// import Step1 from './components/Step1'
// import Step2 from './components/Step2'
// import Step3 from './components/Step3'
import { getBatchTokenClaimSuporrt } from 'config/SupportChains'
import { useEffect, useState, useCallback, useContext } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useContract,
  useProvider,
} from 'wagmi'
import arbTokenClaimABI from 'abi/arbTokenClaimABI.json'
import Context from 'context/Context'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { ethers, Wallet, BigNumber } from 'ethers'
import { fetchBalance } from '@wagmi/core'
import { randomBytes } from 'crypto'
import { erc20ABI, getContract } from '@wagmi/core'
import Countdown from 'react-countdown'

export default function BatchTokenSender() {
  const supportChains = getBatchTokenClaimSuporrt()
  const [step, setstep] = useState(1)
  const [address, setaddress] = useState('')
  const [walletConect, setwalletConect] = useState(false)
  const [splitArr, setsplitArr] = useState([] as any)
  const { setContext } = useContext(Context)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setloading] = useState(false)
  const [addrErr, setaddrErr] = useState({
    show: false,
    errs: [
      {
        row: 0,
        content: '',
        msg: '',
      },
    ],
  })
  const { address: accountAddr, isConnected } = useAccount()
  const [privateKeys, setprivateKeys] = useState([] as DataType[])
  const [selectedRows, setSelectedRows] = useState([] as DataType[])
  const [collectionAddr, setcollectionAddr] = useState(accountAddr ?? '')
  const [selectedRowsCollect, setSelectedRowsCollect] = useState(
    [] as DataType[]
  )
  const [collectAddress, setCollectAddress] = useState([] as DataType[])
  const [selectedRowKeysCollect, setSelectedRowKeysCollect] = useState<
    React.Key[]
  >([])
  const tokenAddr = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_BATCH_CLAIMER_TOKEN
  const claimStartTime =
    process.env.NEXT_PUBLIC_DEFAULT_CHAIN_BATCH_CLAIMER_START
  interface DataType {
    key: React.Key
    walletAddress: string
    balance: string
    balanceOrg: BigNumber
    cTokens: number
    wallet: Wallet
    contract: any
    contractProv: any
    tokenContract: any
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Wallet address',
      dataIndex: 'walletAddress',
    },
    {
      title: 'Claimable tokens($ARB)',
      dataIndex: 'cTokens',
    },
    {
      title: 'Balance ($ARB)',
      dataIndex: 'balance',
    },
  ]

  const columns2: ColumnsType<DataType> = [
    {
      title: 'Wallet address',
      dataIndex: 'walletAddress',
    },
    {
      title: 'Claimable tokens($ARB)',
      dataIndex: 'cTokens',
    },
    {
      title: 'Balance ($ARB)',
      dataIndex: 'balance',
    },
  ]

  useEffect(() => {
    setwalletConect(isConnected)
  }, [isConnected])

  const onChange = useCallback((value: any, viewUpdate: any) => {
    console.log('value:', value)
    setaddress(value.trim())
  }, [])

  function setExample() {
    setaddress(
      '0x4a668082078fe2bda4b607eb4782bdbc3b23df61a602d777c12a66936a6f78be\n0xab1c5cb15d8760a40f32c21fa61548b9b76ee1c4c39d1a0c86874c3b99c1d4f1'
    )
  }

  function createWallet(privateKey: string) {
    console.log('privateKey', privateKey)
    const url = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_BATCH_CLAIMER_URL

    const customHttpProvider = new ethers.providers.JsonRpcProvider(url)

    let wallet = new Wallet(privateKey, customHttpProvider)
    const walletSigner = wallet.connect(wallet.provider)
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DEFAULT_CHAIN_BATCH_CLAIMER_CONTRACT ?? '',
      arbTokenClaimABI,
      walletSigner
    )

    const contractProv = new ethers.Contract(
      process.env.NEXT_PUBLIC_DEFAULT_CHAIN_BATCH_CLAIMER_CONTRACT ?? '',
      arbTokenClaimABI,
      walletSigner
    )

    const tokenContract = getContract({
      address: tokenAddr ?? '',
      abi: erc20ABI,
      signerOrProvider: walletSigner,
    })

    return { wallet, contract, contractProv, tokenContract }
  }

  const nextStep = async () => {
    setloading(true)
    if (!address) {
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-error',
          message: "keys can't be empty",
          show: true,
        },
      })
      setloading(false)
      return
    }
    // setsplitArr(address.split('\n'))
    const addrs: DataType[] = []

    await Promise.all(
      address.split('\n').map(async (privateKey, index) => {
        privateKey = privateKey.trim()
        let {
          wallet: walletPrivateKey,
          contract,
          contractProv,
          tokenContract,
        } = createWallet(privateKey)
        const balance = await fetchBalance({
          address: walletPrivateKey.address as any,
          token: tokenAddr ?? ('' as any),
        })

        // claimableRewards 可领取的数量
        const claimableAmount = await contractProv.claimableTokens(
          walletPrivateKey.address
        )

        addrs.push({
          key: privateKey,
          walletAddress: walletPrivateKey.address,
          balance: balance.formatted,
          balanceOrg: balance.value,
          cTokens: Number(claimableAmount) / 1e18,
          wallet: walletPrivateKey,
          contract,
          contractProv,
          tokenContract,
        })
      })
    )
    setloading(false)
    console.log('addrs', addrs)
    setprivateKeys(addrs)
    setstep(2)
  }

  const ErrList = () => {
    if (addrErr.show) {
      return (
        <>
          <div className="h-32 p-5 overflow-y-auto text-red-600 border border-red-500 rounded-lg error">
            {addrErr.errs.map((value, index, array) => {
              return (
                <div className="grid grid-cols-3" key={index}>
                  <b>{value.row}</b>
                  <span className="truncate">{value.content}</span>
                  <span className="truncate">{value.msg}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end mt-2 text-red-500 cursor-pointer">
            {/* {<span onClick={removeErr}>Remove all error</span>} */}
            {/* <span className="ml-6" onClick={removeDuplicate}>
              Remove duplicate
            </span> */}
          </div>
        </>
      )
    }
    return <></>
  }

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: DataType[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys)
    console.log('selectedRows', selectedRows)
    setSelectedRows(selectedRows)
  }

  const onSelectChangeCollect = (
    newSelectedRowKeys: React.Key[],
    selectedRows: DataType[]
  ) => {
    setSelectedRowKeysCollect(newSelectedRowKeys)
    console.log('selectedRows', selectedRowKeysCollect)
    setSelectedRowsCollect(selectedRows)
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const rowSelectionCollect: TableRowSelection<DataType> = {
    selectedRowKeys: selectedRowKeysCollect,
    onChange: onSelectChangeCollect,
  }

  async function claim() {
    setloading(true)
    if (selectedRows.length <= 0) {
      setloading(false)
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-error',
          message: 'please select wallet',
          show: true,
        },
      })
      return
    }
    try {
      const claimList = await Promise.all(
        selectedRows.map(async (row, i) => {
          try {
            if (row.cTokens > 0) {
              const dis = row.contract
              // 查看结束
              let tx = await dis.claim()
              tx = await tx.wait()
              return row
            }
            return row
          } catch (error) {
            console.error(error)
            return row
          }
        })
      )
      console.log('claimList', claimList)

      const newAddr = await Promise.all(
        claimList.map(async (row, i) => {
          // claimableRewards 可领取的数量
          const claimableAmount: any = await row.contractProv.claimableTokens(
            row.wallet.address
          )
          const balance = await fetchBalance({
            address: row.wallet.address as any,
            token: tokenAddr ?? ('' as any),
          })
          return {
            ...row,
            cTokens: Number(claimableAmount),
            balance: balance.formatted,
            balanceOrg: balance.value,
          }
        })
      )
      setCollectAddress(newAddr)
      console.log('setCollectAddress', newAddr)
      setloading(false)
    } catch (error) {
      setloading(false)
      console.log('error', error)
    }
    setstep(3)
  }

  async function collect() {
    setloading(true)
    if (selectedRowsCollect.length <= 0 || collectionAddr === '') {
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-error',
          message: 'Please fullfiled form',
          show: true,
        },
      })
      setloading(false)
      return
    }

    const targetAddress = collectAddress
    const resultList = await Promise.all(
      selectedRowsCollect.map(async (row, i) => {
        console.log('row.balance', row.balance)
        try {
          if (Number(row.balance) > 0) {
            const token = row.tokenContract
            console.log('token----', targetAddress, Number(row.balance) * 1e18)
            let tx = await token.transfer(collectionAddr, row.balanceOrg)
            tx = await tx.wait()
            return tx['transactionHash']
          }
          return 0
        } catch (error) {
          setloading(false)
          console.error(error)
          return 0
        }
      })
    )

    console.log('row', resultList)
    try {
      const collRes = await Promise.all(
        selectedRowsCollect.map(async (row, i) => {
          // claimableRewards 可领取的数量
          const claimableAmount: any = await row.contractProv.claimableTokens(
            row.wallet.address
          )
          const balance = await fetchBalance({
            address: row.wallet.address as any,
            token: tokenAddr ?? ('' as any),
          })
          return {
            ...row,
            cTokens: Number(claimableAmount),
            balance: balance.formatted,
          }
        })
      )
      setCollectAddress(collRes)
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-success',
          message: 'Collection excuted',
          show: true,
        },
      })
      setloading(false)
    } catch (error) {}
  }

  async function changeCollectionAddr(e: React.ChangeEvent<HTMLInputElement>) {
    setcollectionAddr(e.target.value)
    // todo validate token address
  }

  function backStep2() {
    setstep(2)
    nextStep()
  }

  // Renderer callback with condition
  const rendererCountDown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: any) => {
    if (completed) {
      // Render a completed state
      return (
        <button
          className={`w-full mt-5 bg-black btn rounded-xl ${
            loading && 'loading'
          }`}
          onClick={claim}
        >
          Claim
        </button>
      )
    } else {
      // Render a countdown
      return (
        <button
          className={`w-full mt-5 bg-black btn rounded-xl ${
            loading && 'loading'
          }`}
        >
          Claiming will be live in : {days} days {hours}:{minutes}:{seconds}
        </button>
      )
    }
  }

  return (
    <>
      <Header></Header>
      <div className={`banner lg:px-0 px-5`}>
        <div className="container flex flex-col items-center mx-auto mt-16">
          <h2 className="mt-12 text-5xl font-bold">$ARB batch claimer</h2>

          <p className="hidden mt-11 mb-7 lg:block">Chain Supported</p>
          <div className="hidden w-4/6 mb-14 justify-evenly lg:flex">
            {supportChains.map((chain) => (
              <Image
                src={`/images/support_chains/${chain.name}.png`}
                width={44}
                height={44}
                alt="chains"
                key={chain.id}
              />
            ))}
          </div>

          <div className="lg:w-[47rem] w-full lg:mt-0 mt-10">
            <div className="flex justify-center">
              <div
                className={`p-3 font-semibold text-center border border-gray-200 rounded-full lg:block ${
                  step === 1 ? 'bg-blue-700 text-white block' : 'hidden'
                }`}
              >
                1.Import private keys
              </div>
              <div className="hidden lg:flex divider grow"></div>
              <div
                className={`p-3 font-semibold text-center border border-gray-200 rounded-full lg:block ${
                  step === 2 ? 'bg-blue-700 text-white block' : 'hidden'
                }`}
              >
                2.Batch claim
              </div>
              <div className="hidden lg:flex divider grow"></div>
              <div
                className={`p-3 font-semibold text-center border border-gray-200 rounded-full lg:block ${
                  step === 3 ? 'bg-blue-700 text-white block' : 'hidden'
                }`}
              >
                3.Batch collect $ARB
              </div>
            </div>
            {step === 1 && (
              <>
                <div className="flex items-center justify-between mt-8">
                  <p className="hidden text-gray-400 lg:block">
                    List of pprivate keys(one key per line)
                  </p>
                </div>
                <div className="w-full p-1 mt-3 outline-none h-58 textarea textarea-bordered">
                  <CodeMirror
                    value={address}
                    height="200px"
                    extensions={[javascript({ jsx: true })]}
                    onChange={onChange}
                  />
                </div>
                <p
                  className="text-right text-gray-500 cursor-pointer"
                  onClick={() => setExample()}
                >
                  Example
                </p>
                {walletConect && (
                  <button
                    className={`w-full mt-5 bg-black btn rounded-xl ${
                      loading && 'loading'
                    }`}
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="mt-5">
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={privateKeys}
                    key={2}
                  />
                </div>
                {walletConect && (
                  <Countdown
                    date={claimStartTime}
                    renderer={rendererCountDown}
                  />
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div className="mt-5">
                  <Table
                    rowSelection={rowSelectionCollect}
                    columns={columns2}
                    dataSource={collectAddress}
                    key={3}
                  />
                  <div className={`lg:col-span-2 col-span-3 mt-10`}>
                    <b className="block mb-5">
                      All $ARB balance in chosen address will be sent to:
                    </b>
                    <input
                      type="text"
                      placeholder="Receive address(or CEX Deposit address)"
                      className="w-full bg-gray-200 input"
                      value={collectionAddr}
                      onChange={changeCollectionAddr}
                    />
                  </div>
                </div>
                <button
                  className={`w-full mt-5 bg-gray-500 btn rounded-xl`}
                  onClick={backStep2}
                >
                  Back
                </button>
                {walletConect && (
                  <button
                    className={`w-full mt-5 bg-black btn rounded-xl ${
                      loading && 'loading'
                    }`}
                    onClick={collect}
                  >
                    Collect
                  </button>
                )}
              </>
            )}
          </div>
          <p className="mt-5 text-xl font-bold text-red-500">
            Security reminder: Please run in a safe enviroment. The private key
            is only stored in the browser cache.
          </p>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}
