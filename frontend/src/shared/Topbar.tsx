import { navBarLinks } from "@/constants/NavBarLinks"
import ThemeSwitch from "./ThemeSwitch"
import { INavLink } from "@/types/types"
import { useLocation } from "react-router-dom"


const TopBar = () => {
    const { pathname } = useLocation()
    return (


        <nav className="w-full bg-white border-gray-200 dark:bg-gray-900">
            <div className="flex items-center justify-between mx-auto p-4">
                <a href="/">
                    <div className="flex flex-row gap-3">
                        <img src="assets/figures/Black_Queen.svg" className="h-14" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CheckMate</span>
                    </div>
                </a>

                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>

                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg 0 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0"  >
                        {navBarLinks.map((link: INavLink) => {
                            const isActive = pathname === link.route;
                            return (
                                <li key={link.label}>
                                    <a href={link.route} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">{link.label}</a>
                                </li>
                            )
                        })}
                        <ThemeSwitch />
                    </ul>

                </div>

            </div>
        </nav>

    )
}

export default TopBar
