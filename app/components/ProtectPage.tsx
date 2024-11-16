"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectPage({children}: {children: React.ReactNode}) {
  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(!session) {
      if(status != 'loading') {
        router.push('/')
      }
    }
  }, [session])


  if(!session) {
    if(status != 'loading') {
      return (
        <h1>Usuário não autenticado.<br/>Redirecionando para a página de Login...</h1>
      )
    }
  }

  else {
    return (
      children
    );
  }
}