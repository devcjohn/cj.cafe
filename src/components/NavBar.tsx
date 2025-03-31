import { Link } from 'react-router-dom'

export const NavBar = () => {
  /* 'Demos' Nested Dropdown menu */
  const dropDownOptions = (
    <div
      id="dropdownNavbar"
      className="absolute left-0 top-full z-50 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white font-normal shadow-sm   group-hover:block"
    >
      <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownLargeButton">
        {/* <li>
          <Link className="block px-4 py-2 hover:bg-gray-100 " to="/what-i-know-about-you">
            What I Know About You
          </Link>
        </li> */}
        <li>
          <Link className="block px-4 py-2 hover:bg-gray-100 " to="/whiteboard">
            Whiteboard
          </Link>
        </li>
        <li>
          <Link className="block px-4 py-2 hover:bg-gray-100 " to="/FormFill">
            Form Fill
          </Link>
        </li>
        <li>
          <Link className="block px-4 py-2 hover:bg-gray-100" to="/contact">
            Captcha
          </Link>
        </li>
      </ul>
    </div>
  )

  return (
    <header>
      <nav>
        <div className="flex flex-wrap items-center justify-evenly bg-gray-50 px-4">
          <a href="/" className="flex items-center">
            <span className="mt-2 self-center whitespace-nowrap font-header text-2xl font-semibold md:my-5">
              CJ.Cafe
            </span>
          </a>

          <div className="w-full md:block md:w-auto" id="navbar-dropdown">
            <ul className="flex flex-col rounded-lg p-2 font-medium  md:mt-0  md:flex-row md:space-x-8 md:p-0 ">
              <li>
                <Link
                  className="block rounded-sm py-2 pl-3 pr-4 font-header font-semibold text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 "
                  to="/#portfolio"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  className="block rounded-sm py-2 pl-3 pr-4 font-header font-semibold text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 "
                  to="/blog"
                >
                  Blog
                </Link>
              </li>

              <li className="group relative">
 <button
                  id="dropdownNavbarLink"
                  data-dropdown-toggle="dropdownNavbar"
                  className="flex w-full items-center justify-between rounded py-2 pl-3 pr-4 font-header font-semibold text-gray-900 hover:bg-gray-100 md:w-auto border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700  
                  focus:outline-hidden cursor-default" 
                  /* cursor-default added so cursor doesn't change to pointer when hovering over button
                   focus:outline-hidden added so button doesn't get outline when clicked
                   Reasoning: We want this to be a button on mobile, but a hover on desktop
                   */
                >
                  Mini Demos{' '}
                  <svg /* Caret icon.  Rotates 180 when dropdown is open */
                    className="ml-2.5 h-2.5 w-2.5 transition-transform group-hover:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div className="relative">
                  {/* Relative class added so dropdown options appear in correct location */}
                  {dropDownOptions}
                </div>
              </li>
              <li>
                <Link
                  className="block rounded-sm py-2 pl-3 pr-4 font-header font-semibold text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 "
                  to="/hintle"
                >
                  Hintle
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
