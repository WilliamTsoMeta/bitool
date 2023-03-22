import style from '../styles/Home.module.css'
import Link from 'next/link'
import Header from 'components/Header'
import Footer from 'components/Footer'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Header></Header>

      <div className={`banner grid lg:grid-cols-2 px-5 lg:px-0 pt-28`}>
        <div className={`lg:mt-28 ${style.description}`}>
          <div className={style.desc}>
            <h2 className="mb-5 text-5xl font-bold">
              Bitool{' '}
              <img
                src="/images/free-tool-box.webp"
                alt="free toolbox"
                className="inline w-36"
              />
            </h2>
            <h3 className="mb-5 text-3xl font-bold">
              Improve efficiency & save time
            </h3>
            <p className="mb-5 text-xl font-medium">
              The best blockchain toolkit for project owners and investors
            </p>
          </div>
        </div>
        <img
          src="/images/banner.webp"
          alt="banner"
          className={`hidden lg:block ${style['desc-img']}`}
        />
      </div>

      <div className="mx-5 lg:mx-0">
        <h3 className="text-3xl font-bold text-center" id="popular">
          Popular
        </h3>
        <div className="container grid max-w-5xl gap-5 mx-auto mb-24 mt-14 lg:grid-cols-3">
          <div
            className={`rounded-3xl relative ${style['tool-card']} flex flex-col items-center pt-9`}
          >
            <img
              src="/images/free.webp"
              alt="free"
              className="absolute top-0 right-0"
              width={80}
            />
            <div className={`${style['tool-card-icon']} bg-blue-600`}>
              <img src="/images/tokensender.webp" alt="batch sender" />
            </div>

            <h4 className="my-6 text-2xl font-bold">Token batch sender</h4>
            <hr className="mb-6" />
            <ul className="h-20 mb-10">
              <li>
                {' '}
                <i className="bg-blue-500"></i> Air drop to community
              </li>
              <li>
                {' '}
                <i className="bg-blue-500"></i> prepare gas for multiple wallets
              </li>
            </ul>

            <Link
              href="/batch_token_sender"
              className={`bg-white text-black rounded-full btn mb-10 ${style.btn}`}
            >
              View
              <img
                className={style['card-arrow']}
                src="/images/card-arrow-black.webp"
                width="20"
              ></img>
            </Link>
          </div>

          {/* <div
            className={`rounded-3xl relative ${style['tool-card']} flex flex-col items-center pt-9`}
          >
            <img
              src="/images/free.webp"
              alt="free"
              className="absolute top-0 right-0"
              width={80}
            />
            <div className={`${style['tool-card-icon']} bg-amber-500`}>
              <img src="/images/nftsender.webp" alt="batch sender" />
            </div>

            <h4 className="my-6 text-2xl font-bold">NFT batch sender</h4>
            <hr className="mb-6" />
            <ul className="h-20 mb-10">
              <li>
                {' '}
                <i className="bg-violet-600"></i> Air drop to community
              </li>
            </ul>
            <div
              className={`bg-white rounded-full btn mb-10 text-amber-500 ${style.btn}`}
            >
              View
              <img
                className={style['card-arrow']}
                src="/images/card-arrow-yellow.webp"
              ></img>
            </div>
          </div> */}

          <div
            className={`rounded-3xl relative ${style['tool-card']} flex flex-col items-center pt-9`}
          >
            <img
              src="/images/free.webp"
              alt="free"
              className="absolute top-0 right-0"
              width={80}
            />
            <div className={`${style['tool-card-icon']} bg-amber-500`}>
              <img src="/images/nftsender.webp" alt="batch sender" />
            </div>

            <h4 className="my-6 text-2xl font-bold text-center">
              Arbitrum Airdrop batch Claim
            </h4>
            <hr className="mb-6" />
            <ul className="h-20 mb-10">
              <li>
                {' '}
                <i className="bg-violet-600"></i> Batch claim $ARB Airdrop
              </li>
              <li>
                {' '}
                <i className="bg-violet-600"></i> Batch collect $ARB to one
                address
              </li>
            </ul>
            <Link
              // href="/"
              href="/batch_claimer"
              className={`bg-white rounded-full btn mb-10 text-amber-500 ${style.btn}`}
            >
              View
              <img
                className={style['card-arrow']}
                src="/images/card-arrow-yellow.webp"
              ></img>
            </Link>
          </div>

          <div
            className={`rounded-3xl relative ${style['tool-card']} flex flex-col items-center pt-9`}
          >
            <img
              src="/images/free.webp"
              alt="free"
              className="absolute top-0 right-0"
              width={80}
            />
            <div className={`${style['tool-card-icon']} bg-red-500`}>
              <img src="/images/gasstation.webp" alt="batch sender" />
            </div>

            <h4 className="my-6 text-2xl font-bold">Gas station</h4>
            <hr className="mb-6" />
            <ul className="h-20 mb-10">
              <li>
                <i className="bg-red-500"></i> Get gas of any blockchain in 1
                click
              </li>
              <li>
                <i className="bg-red-500"></i> Get gas of any blockchain testnet
              </li>
            </ul>
            <Link
              // href="/"
              href="/gas_station"
              className={`bg-white text-red-500 rounded-full btn mb-10 ${style.btn}`}
            >
              View
              <img
                className={style['card-arrow']}
                src="/images/card-arrow-orange.webp"
              ></img>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-5 lg:mx-0">
        <h3 className="text-3xl font-bold text-center">
          Tools for project owner
        </h3>
        <div className="container max-w-6xl mx-auto mb-24 mt-14">
          <img src="/images/comingsoon.webp" alt="comming soon" width="1180" />
        </div>
      </div>

      <div className="mx-5 lg:mx-0">
        <h3 className="text-3xl font-bold text-center">
          Request to develop new tools
        </h3>
        <div className="container max-w-full mx-auto mb-24 text-center lg:max-w-6xl mt-14">
          <a href="https://t.me/Yvoone_Bitool" target="_blank" rel="noreferrer">
            <button className="w-full p-2 text-white bg-black rounded-md lg:w-96">
              Contact us
            </button>
          </a>
        </div>
      </div>

      {/* <div className="container grid items-center max-w-6xl gap-10 mx-auto mb-24 align-baseline mt-14 lg:grid-cols-6">
        <Image
          src="/images/partsx.webp"
          alt="partener"
          width={168}
          height={40}
        />
        <Image
          src="/images/partsx1.webp"
          alt="partener"
          width={168}
          height={40}
        />
        <Image
          src="/images/partsx2.webp"
          alt="partener"
          width={168}
          height={40}
        />
        <Image
          src="/images/partsx3.webp"
          alt="partener"
          width={168}
          height={40}
        />
        <Image
          src="/images/partsx4.webp"
          alt="partener"
          width={168}
          height={40}
        />
        <Image
          src="/images/partsx5.webp"
          alt="partener"
          width={168}
          height={40}
        />
      </div> */}

      <Footer></Footer>
    </>
  )
}
