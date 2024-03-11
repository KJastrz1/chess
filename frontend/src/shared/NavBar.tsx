import { navBarLinks } from '@/constants/NavBarLinks';
import { useUserContext } from '@/context/AuthContext';
import { INavLink } from '@/types/types';
import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';

const Navbar = () => {
    const { pathname } = useLocation()
    const { logout } = useUserContext();
    const [showMenu, setShowMenu] = useState(false);

    const handleNav = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className='bg-white dark:bg-gray-900 flex justify-between items-center mx-auto p-4 font-semibold'>
            {/* Logo */}
            <a href="/">
                <div className="flex flex-row gap-3">
                    <img src="assets/figures/Black_Queen.svg" className="h-14" alt="CheckMate Logo" />
                    <span className="self-center text-3xl font-semibold whitespace-nowrap">CheckMate</span>
                </div>
            </a>

            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                {navBarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <li key={link.label}>
                            <NavLink to={link.route} onClick={handleNav} className={`p-2 hover:bg-[#00df9a] rounded-xl cursor-pointer duration-300 hover:text-black ${isActive ? 'bg-[#00df9a] text-black' : ''
                                }`}>
                                {link.label}
                            </NavLink>
                        </li>)
                })}
                <ul className="p-5">
                    <ThemeSwitch />
                    <button onClick={logout} className="mt-3">Logout</button>
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
                        ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 p-5'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                {/* Mobile Logo */}
                <a href="/" >
                    <div className="flex flex-row gap-3 mb-5">
                        <img src="assets/figures/Black_Queen.svg" className="h-14" alt="CheckMate Logo" />
                        <span className="self-center text-3xl font-semibold whitespace-nowrap">CheckMate</span>
                    </div>
                </a>

                {/* Mobile Navigation Items */}
                {navBarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <li key={link.label} className='my-5'>
                            <NavLink to={link.route} onClick={handleNav} className={`p-2 hover:bg-[#00df9a] rounded-xl cursor-pointer duration-300 hover:text-black ${isActive ? 'bg-[#00df9a] text-black' : ''
                                }`}>
                                {link.label}
                            </NavLink>
                        </li>)
                })}
                <ThemeSwitch />
                <button onClick={logout} className="block">Logout</button>
            </ul>
        </div>
    );
};

export default Navbar;