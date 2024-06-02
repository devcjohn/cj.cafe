import { Fragment, useEffect } from 'react'
import { AboutMe } from '../components/AboutMe'
import { Portfolio } from './Portfolio'
import { useLocation } from 'react-router-dom'
import { AboutThisSite } from '../components/AboutThisSite'

export const Home = () => {
  const location = useLocation()

  /* If the current URL has a hash (like /#portfolio), 
  scroll to that element once its images have finished loading */
  useEffect(() => {
    if (location.hash) {
      const elem = document.getElementById(location.hash.slice(1))
      if (elem) {
        Promise.all(
          Array.from(elem.getElementsByTagName('img'))
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  img.onload = img.onerror = resolve
                })
            )
        ).then(() => {
          elem.scrollIntoView({ behavior: 'smooth' })
        })
      }
    } else {
      //window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <Fragment>
      <div className="relative bg-laptop bg-cover bg-center bg-no-repeat py-8">
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-950 bg-cover bg-center
      bg-no-repeat opacity-80"
        />
        <div className="relative z-30 py-36">
          <div className="flex flex-col items-center justify-center lg:flex-row">
            <div className="rounded-full border-8  shadow-xl">
              <img
                src="/img/capy.webp"
                alt="Capybara with glasses and a coffee mug"
                className="h-48 rounded-full lg:h-60"
              />
            </div>
            <div className="mt-4 md:mt-0 md:pl-8 md:pt-8 ">
              <h1 className="text-center font-header text-4xl text-white md:text-6xl">
                Hi, I&apos;m Charles Johnson
              </h1>
              <div className="flex flex-col justify-center pt-3 sm:flex-row sm:pt-5 lg:justify-start">
                <div className="flex items-center justify-center pl-0 sm:justify-start md:pl-1">
                  <p className="font-header  text-lg text-white">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AboutMe />
      <Portfolio />
      <AboutThisSite />
    </Fragment>
  )
}
