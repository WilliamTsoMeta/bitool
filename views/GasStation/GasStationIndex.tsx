import Header from 'components/Header'
import Footer from 'components/Footer'
import Image from 'next/image'
import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import { MainNet } from './components/MainNet'
import { TestNet } from './components/TestNet'
import { getGasStationContractInfo } from 'config/SupportChains'
import getSupportChains from 'util/SupportChains'
const GasStationIndex = () => {
  const [sendType, setsendType] = useState('main')
  const [supportChains, setsupportChains] = useState(getSupportChains())
  const [gasStationContractInfo, setgasStationContractInfo] = useState(
    getGasStationContractInfo()
  )

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
                src={`/images/support_chains/${chain.id}.png`}
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
        <MainNet gasStationContractInfo={gasStationContractInfo}></MainNet>
      ) : (
        <TestNet gasStationContractInfo={gasStationContractInfo}></TestNet>
      )}

      <Footer></Footer>
    </>
  )
}

export default GasStationIndex
