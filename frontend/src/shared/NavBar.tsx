import { navBarLinks } from '@/constants/NavBarLinks';
import { useUserContext } from '@/context/AuthContext';

import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import { Black, INavLink, White } from '@/types/index';



const Navbar = () => {
    const { pathname } = useLocation()
    const { logout } = useUserContext();
    const [showMenu, setShowMenu] = useState(false);

    const handleNav = () => {
        setShowMenu(!showMenu);
    };

    return (
        <nav className='bg-white dark:bg-gray-900 flex justify-between items-center mx-auto p-4 font-semibold'>
            {/* Logo */}
            <a href="/">
                <div className="flex flex-row gap-3">
                    <img src={`assets/figures/${Black.Queen}.svg`} className="h-14 block dark:hidden" alt="CheckMate Logo" />
                    <img src={`assets/figures/${White.Queen}.svg`} className="h-14 hidden dark:block" alt="CheckMate Logo" />
                    <span className="self-center text-2xl lg:text-3xl font-semibold whitespace-nowrap">CheckMate</span>
                </div>
            </a>

            {/* Desktop Navigation */}
            <ul className='hidden md:flex items-center gap-3'>
                {navBarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <li key={link.label}>
                            <NavLink to={link.route} onClick={handleNav} className={`p-2 hover:bg-primary-500 rounded-xl cursor-pointer duration-300 hover:text-black ${isActive ? 'bg-primary-500 text-black' : ''
                                }`}>
                                {link.label}
                            </NavLink>
                        </li>)
                })}
                <ul className="flex lg:mx-10 justify-content gap-5 items-center">
                    <ThemeSwitch />
                    <button onClick={logout}>Logout</button>
                </ul>
            </ul>

            {/* Menu hamburger icon*/}
            <div onClick={handleNav} className='block md:hidden'>
                {showMenu ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
            </div>

            {/* Mobile Navigation Menu */}
            <ul
                className={
                    showMenu
                        ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-white dark:bg-gray-900 ease-in-out duration-500 p-5'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                {/* Mobile Logo */}
                <a href="/" >
                    <div className="flex flex-row gap-3 mb-5">
                        <img src={`assets/figures/${Black.Queen}.svg`} className="h-14 block dark:hidden" alt="CheckMate Logo" />
                        <img src={`assets/figures/${White.Queen}.svg`} className="h-14 hidden dark:block" alt="CheckMate Logo" />
                        <span className="self-center text-3xl font-semibold whitespace-nowrap">CheckMate</span>
                    </div>
                </a>

                {/* Mobile Navigation Items */}
                {navBarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <li key={link.label} className='my-5'>
                            <NavLink to={link.route} onClick={handleNav} className={`p-2 hover:bg-primary-500 rounded-xl cursor-pointer duration-300 hover:text-black ${isActive ? 'bg-primary-500 text-black' : ''
                                }`}>
                                {link.label}
                            </NavLink>
                        </li>)
                })}
                <ThemeSwitch />
                <button onClick={logout} className="block">Logout</button>
            </ul>
        </nav>
    );
};

export default Navbar;