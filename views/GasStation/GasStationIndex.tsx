import Header from 'components/Header'
import Footer from 'components/Footer'
import Image from 'next/image'
import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import { MainNet } from './components/MainNet'
import { TestNet } from './components/TestNet'

const GasStationIndex = () => {
  const [sendType, setsendType] = useState('main')
  const [supportChains, setsupportChains] = useState([
    {
      id: 43113,
      name: 'Avalanch',
      token: 'AVAX',
      contractAddress: '0x94253f7AB560Ac9de9734c25eFee6FCa24310408',
      tokenOptions: [
        {
          label: 'AVAX',
          value: 'AVAX',
        },
        {
          label: 'USDC',
          value: '12312312',
        },
      ],
      staableCoinAddr: '0xfDD6Db3Afd662aFDD5ad35C15fE47B81B8b11532',
    },
    {
      id: 97,
      name: 'BSC',
      token: 'BNB',
      contractAddress: '0x03e07E3d286ef396C997d75F838b436474B6826F',
      tokenOptions: [
        {
          label: 'BNB',
          value: 'BNB',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 1,
      name: 'ETH',
      token: 'ETH',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 137,
      name: 'Polygon',
      token: 'MATIC',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'MATIC',
          value: 'MATIC',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 42161,
      name: 'Arbitru',
      token: 'ETH',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 10,
      name: 'Optimism',
      token: 'ETH',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 250,
      name: 'Fantom',
      token: 'FTM',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'FTM',
          value: 'FTM',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 1337,
      name: 'Geth Testnet',
      token: 'ETH',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
      staableCoinAddr: '',
    },
    {
      id: 66,
      name: 'OKC',
      token: 'OKT',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'OKT',
          value: 'OKT',
        },
      ],
      staableCoinAddr: '',
    },
  ])

  function toggleOperationType(type: string) {
    setsendType(sendType === 'main' ? 'test' : 'main')
  }

  return (
    <>
      <Header></Header>
      <div className={`banner lg:px-0`}>
        <div className="container flex flex-col items-center mx-auto mt-16">
          <h2 className="mt-12 text-5xl font-bold">Gas Station</h2>
          <p className="mt-11 mb-7">Chain Supported</p>
          <div className="flex w-4/6 mb-14 justify-evenly">
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
          <div className="flex bg-gray-200 border rounded-full cursor-pointer select-none">
            <div
              className={`px-16 py-3 font-medium ${
                sendType === 'main'
                  ? 'bg-blue-500 rounded-full text-white font-normal'
                  : ' rounded-full'
              }`}
              onClick={() => toggleOperationType('main')}
            >
              Main Net
            </div>
            <div
              className={`px-16 py-3 font-medium ${
                sendType !== 'main'
                  ? 'bg-blue-500 rounded-full text-white font-normal'
                  : ' rounded-full'
              }`}
              onClick={() => toggleOperationType('test')}
            >
              Test Net
            </div>
          </div>
        </div>
      </div>
      {sendType === 'main' ? (
        <MainNet supportChains={supportChains}></MainNet>
      ) : (
        <TestNet supportChains={supportChains}></TestNet>
      )}

      <Footer></Footer>
    </>
  )
}

export default GasStationIndex
