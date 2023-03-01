import React, { FC } from 'react'

type BannerProps = { title: string }

const Banner: FC<BannerProps> = ({ title }: BannerProps) => {
  return (
    <div className="z-0 w-screen bg-cover bg-local bg-no-repeat bg-center bg-gradient-to-tl from-secondary-contrast-colour to-contrast-colour">
      <div className="flex items-center justify-start h-full w-full bg-[url('/background_svg/circuit-board.svg')]">
        <div className="flex items-center w-11/12 mx-auto p-4">
          <span className="text-left text-gray-100 w-max mt-10">
            <h1 className="leading-0 text-2xl font-bold lg:shadow-xl rounded select-none">
              {title}
            </h1>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Banner
