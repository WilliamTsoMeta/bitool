import Link from 'next/link'
import Image from 'next/image'
import ConnectBtn from './ConnectBtn'

export default function Header() {
  return (
    <div className="fixed z-10 w-full bg-white">
      <div className="container mx-auto">
        <div className="w-full navbar bg-base-100">
          <div className="lg:mr-24">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="font-bold">
                  <a href="#popular">Popular</a>
                </li>
                <li className="font-bold">
                  <a href="#project_owner">Project owner</a>
                </li>
                <li className="font-bold">
                  <a>Investor</a>
                </li>
              </ul>
            </div>
            <Link className="text-xl normal-case btn btn-ghost" href="/">
              <Image
                className="hidden lg:block"
                src={'/logo.webp'}
                alt="logo"
                width={95}
                height={26}
              />
              <Image
                className="lg:hidden"
                src={'/logosm.png'}
                alt="logo"
                width={25}
                height={25}
              />
            </Link>
          </div>
          <div className="hidden navbar-center lg:flex">
            <ul className="px-1 menu menu-horizontal">
              <li className="px-4 font-bold">
                <a href="#popular">Popular</a>
                {/* <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="m-1 btn">
                    Click
                  </label>
                  <ul
                    tabIndex={0}
                    className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Item 2</a>
                    </li>
                  </ul>
                </div> */}
              </li>
              <li className="px-4 font-bold">
                <a href="#project_owner">Project owner</a>
              </li>
              <li className="px-4 font-bold">
                <a>Investor</a>
              </li>
            </ul>
          </div>
          <div className="ml-auto">
            <div className="justify-around hidden w-48 mr-14 md:flex">
              <a
                className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                href="https://t.me/Yvoone_Bitool"
                target="_blank"
                rel="noreferrer"
              >
                <Image alt="tg" src="/images/tg.webp" width={20} height={17} />
              </a>
              {/* <a className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full" href="">
                  <img src="/images/dc.webp" width={20} height={17}/>
                </a>    */}
              <a
                className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                href="https://twitter.com/Bitool_free"
                target="_blank"
                rel="noreferrer"
              >
                <Image alt="tg" src="/images/tw.webp" width={20} height={17} />
              </a>
            </div>
            <ConnectBtn></ConnectBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
