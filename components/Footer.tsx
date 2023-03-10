import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="container grid w-full gap-0 mb-24 lg:max-w-6xl lg:mx-auto mt-44 lg:grid-cols-2">
      <div className="mx-5 mb-10 lg:mb-0 lg:mx-0">
        <Image src="/images/logo2.webp" alt="logo" width={175} height={10} />

        <div className="justify-around hidden w-48 mt-10 mr-14 md:flex">
          <a
            className="flex items-center justify-center w-12 h-12 "
            href="https://t.me/Yvoone_Bitool"
          >
            <Image src="/images/tg.webp" width={20} height={17} alt="tg" />
          </a>
          {/* <a className="flex items-center justify-center w-12 h-12" href="">
                <img src="/images/dc.webp" width={20} height={17}/>
              </a>    */}
          <a
            className="flex items-center justify-center w-12 h-12 "
            href="https://twitter.com/Bitool_free"
          >
            <Image src="/images/tw.webp" width={20} height={17} alt="tg" />
          </a>
        </div>
      </div>
      <div className="mx-5 lg:mx-0">
        <div className="flex">
          <span className="mr-10 font-bold lg:mr-10">Resources</span>
          <span className="mr-0 lg:mr-10">Career Opportunity</span>
          <span className="mr-0 lg:mr-10">Business Cooperation</span>
        </div>
        <hr className="mt-5 mb-6 lg:mt-14" />
        <p className="text-xs text-gray-400">
          © 2023 Bitool. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
