import React, { FC, MouseEvent } from 'react'

type BannerProps = { title: string }

const Banner: FC<BannerProps> = ({ title }: BannerProps) => {

const handleClick = (event: MouseEvent<HTMLDivElement>) => {
  event.preventDefault()

  chrome.tabs.create({ url: 'https://www.recurso.tech', active: false });
}

  return (
    <div className="z-0 w-screen bg-cover bg-local bg-no-repeat bg-center bg-gradient-to-tl from-secondary-contrast-colour to-contrast-colour">
      <div className="flex items-end justify-start align-top h-full w-full bg-[url('/background_svg/circuit-board.svg')]">
        <div className="flex items-start w-full mx-auto p-4">
          <span className="text-left text-gray-100 w-max">
            <h1 className="leading-0 text-2xl font-bold select-none mb-8">
              {title}
            </h1>
          </span>
        </div>
        <div className="m-2" onClick={handleClick}>
          <img src="/images/icon-128.png" alt="recurso-brand-logo" className="w-8 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

export default Banner
