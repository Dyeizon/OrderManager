
"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const {data: session} = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const isActive = (path: string) => (pathname === path ? "text-blue-700 dark:text-blue-500" : "");
  
  return (
    <nav className="bg-white dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-600 mb-4">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/favicon.ico" width={32} height={32} className="mr-3 sm:h-9" alt="Agiliza Aí Logo"/>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Agiliza Aí</span>
      </a>
      <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
          <span className="text-gray-500 text-md mr-2">{session?.username}</span>
          <button onClick={() => signOut({callbackUrl: '/'})} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Desconectar</button>
          <button onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
      </div>
      <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${menuOpen ? "block" : "hidden"}`}>
        <ul className="text-center flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a onClick={() => (router.push('/admin'))} href="#" className={`block py-2 px-3 rounded md:p-0 hover:text-blue-700 dark:hover:text-blue-500 ${isActive("/admin")}`} aria-current="page">Admin</a>
          </li>
          <li>
            <a onClick={() => (router.push('/caixa'))} href="#" className={`block py-2 px-3 rounded md:p-0 hover:text-blue-700 dark:hover:text-blue-500 ${isActive("/caixa")}`}>Caixa</a>
          </li>
          <li>
            <a onClick={() => (router.push('/pedidos'))} href="#" className={`block py-2 px-3 rounded md:p-0 hover:text-blue-700 dark:hover:text-blue-500 ${isActive("/pedidos")}`}>Pedidos</a>
          </li>
          <li>
            <a onClick={() => (router.push('/cozinha'))} href="#" className={`block py-2 px-3 rounded md:p-0 hover:text-blue-700 dark:hover:text-blue-500 ${isActive("/cozinha")}`}>Cozinha</a>
          </li>
          <li>
            <a onClick={() => (router.push('/telao'))} href="#" className={`block py-2 px-3 rounded md:p-0 hover:text-blue-700 dark:hover:text-blue-500 ${isActive("/telao")}`}>Telão</a>
          </li>
        </ul>
      </div>
      </div>
    </nav>
  );
}
