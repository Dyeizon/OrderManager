
"use client";

import { Button, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Header() {
  const {data: session} = useSession();
  const router = useRouter();
  return (
    <Navbar fluid rounded className="w-11/12 m-auto">
      <Navbar.Brand href="#">
        <Image src="/favicon.ico" width={32} height={32} className="w-8 h-8 mr-3 sm:h-9" alt="OrderManager Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">OrderManager</span>
      </Navbar.Brand>
      <div className="flex md:order-2 items-center space-x-6">
        <span className="text-gray-500 text-md">{session?.username}</span>
        <Button onClick={() => signOut({callbackUrl: '/'})}>Desconectar</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {session && parseInt(session?.privilegeLevel) >= 3 && (
          <Navbar.Link className="hover:cursor-pointer" onClick={() => (router.push('/admin'))}><span className="px-8 py-2 bg-slate-200 rounded-lg">Admin</span></Navbar.Link>
        )}

        {session &&  parseInt(session?.privilegeLevel) >= 2 && (
          <Navbar.Link className="hover:cursor-pointer" onClick={() => (router.push('/caixa'))} disabled={parseInt(session?.privilegeLevel) < 2}><span className="px-8 py-2 bg-slate-200 rounded-lg">Caixa</span></Navbar.Link>
        )}

        {session &&  parseInt(session?.privilegeLevel) >= 1 && (
          <Navbar.Link className="hover:cursor-pointer" onClick={() => (router.push('/cozinha'))} disabled={parseInt(session?.privilegeLevel) < 1}><span className="px-8 py-2 bg-slate-200 rounded-lg">Cozinha</span></Navbar.Link>
        )}
        
        <Navbar.Link className="hover:cursor-pointer" onClick={() => (router.push('/telao'))}><span className="px-8 py-2 bg-slate-200 rounded-lg">Telão</span></Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
