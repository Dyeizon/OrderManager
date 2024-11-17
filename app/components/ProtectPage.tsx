"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "flowbite-react";

interface ProtectPageProps {
  children: React.ReactNode;
  min: number;
}

export default function ProtectPage({ children, min }: ProtectPageProps) {
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

  if(parseInt(session!?.privilegeLevel) < min) {
    console.error(`Nível de privilégio mínimo: ${min}. Seu nível de privilégio: ${session?.privilegeLevel}`);
    return (
      <>
        <h1>Você não tem permissão para acessar esta página.</h1>
        <Button color="blue" style={{float: 'left'}} onClick={() => router.back()}>Voltar</Button>
      </>
    )
  }

  else {
    return (
      children
    );
  }
}