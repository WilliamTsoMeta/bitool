import Header from 'components/Header'
import Footer from 'components/Footer'
import Image from 'next/image'
import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import { MainNet } from './components/MainNet'
import { TestNet } from './components/TestNet'
import { getGasStationContractInfo } from 'config/SupportChains'
import getSupportChains from 'config/SupportChainsWagmi'
import { Chain } from 'wagmi'
const GasStationIndex = () => {
  const [sendType, setsendType] = useState('main')
  const [supportChains, setsupportChains] = useState([] as any)
  const [gasStationContractInfo, setgasStationContractInfo] = useState(
    getGasStationContractInfo()
  )

  function toggleOperationType(type: string) {
    setsendType(sendType === 'main' ? 'test' : 'main')
  }

  useEffect(() => {
    const chains = getSupportChains()
    const newChains = []
    for (let index = 0; index < chains.length; index++) {
      const element = chains[index]
      if (
        Object.keys(gasStationContractInfo).includes(element?.id.toString())
      ) {
        newChains.push(element)
      }
    }
    setsupportChains(newChains)
  }, [])

  return (
    <>
      <Header></Header>
      <div className={`banner lg:px-0`}>
        <div className="container flex flex-col items-center px-2 mx-auto mt-16">
          <h2 className="mt-12 text-5xl font-bold">Gas Station</h2>
          <p className="hidden lg:block mt-11 mb-7">Chain Supported</p>
          <div className="hidden w-4/6 lg:flex mb-14 justify-evenly">
            {supportChains.length > 0 &&
              supportChains.map((chain: any) => (
                <Image
                  src={`/images/support_chains/${chain.id}.png`}
                  width={44}
                  height={44}
                  alt="chains"
                  key={chain.id}
                />
              ))}
          </div>
          <div className="flex mt-5 bg-gray-200 border rounded-full cursor-pointer select-none lg:mt-0">
            <div
              className={`lg:px-16 px-4 py-3 font-medium ${
                sendType === 'main'
                  ? 'bg-blue-500 rounded-full text-white font-normal'
                  : ' rounded-full'
              }`}
              onClick={() => toggleOperationType('main')}
            >
              Main Net
            </div>
            <div
              className={`lg:px-16 px-4 py-3 font-medium ${
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
