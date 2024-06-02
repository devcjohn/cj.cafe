import { FC } from 'react'

const PortfolioItemList: PortfolioItemProps[] = [
  {
    src: '/img/resilia-initatives.webp',
    alt: 'Screenshot of Resilia Nonprofit Platform Web App',
    imageTitle: 'Resilia Nonprofit Platform Web App',
    href: 'https://www.resilia.com/nonprofit-platform',
    caption: 'Resilia - Nonprofit Platform',
  },
  {
    src: '/img/schnucks-rewards.webp',
    alt: 'iPhone showing Scnucks Rewards App Homescreen',
    imageTitle: 'Schnucks Rewards App',
    href: 'https://www.wwt.com/case-study/driving-delightful-shopping-experiences-at-schnucks-that-extend-beyond-the-brick-and-mortar',
    caption: 'Schnucks - Rewards App',
  },
  {
    src: '/img/blern.webp',
    alt: 'iPhone showing Pulse Oximetry App Homescreen',
    imageTitle: 'Pulse Oximetry App',
    href: 'https://www.wwt.com/article/bluetooth-low-energy-mobile-development',
    caption: 'Pulse Oximetry App',
  },
  {
    src: '/img/rpm-dashboard.webp',
    alt: 'Richard Petty Motorsports Pit Crew member looking at racing dashboard',
    imageTitle: 'Richard Petty Motorsports Dashboard',
    href: 'https://www.wwt.com/rpm',
    caption: 'Richard Petty Motorsports - Dashboard',
  },
]

export const Portfolio = () => {
  return (
    <div className="container py-16 md:py-20" id="portfolio">
      <h2 className="text-center font-header text-3xl font-semibold uppercase text-primary sm:text-4xl lg:text-5xl">
        Portfolio
      </h2>
      <h3 className="pt-6 text-center font-header text-xl font-medium text-black sm:text-2xl lg:text-3xl">
        Here&apos;s some of my past work
      </h3>
      <div className="mx-auto grid w-full grid-cols-1 gap-8 pt-12 sm:w-3/4 md:gap-10 lg:w-full lg:grid-cols-2 font-body">
        {PortfolioItemList.map(PortfolioItem)}
      </div>
    </div>
  )
}

type PortfolioItemProps = {
  src: string /* Image source */
  alt: string /* Image alt text */
  imageTitle: string /* Appears on hover */
  href: string /* Link to project page */
  caption: string /* Appears below image */
}

const PortfolioItem: FC<PortfolioItemProps> = ({ src, alt, imageTitle, href, caption }) => {
  return (
    <div key={caption} className="flex flex-col items-center justify-center mx-auto  md:mx-0">
      <a
        href={href}
        className="flex flex-col items-center justify-center transition-all hover:scale-105 mx-auto md:mx-0 mb-3"
      >
        <img src={src} className="w-full shadow" alt={alt} title={imageTitle} />
      </a>
      <a href={href}>{caption}</a>
    </div>
  )
}
