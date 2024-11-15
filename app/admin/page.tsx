"use client"

import { useSession } from "next-auth/react";

export default function Admin() {
  const {data: session, status} = useSession();

  if(!session) {
    return (
      <div>nao ta logado amigo {status}</div>
    )
  } else {
    console.log(session);
    return (
      <div>
        <h1>Página Administrativa - {session?.user?.name} - {status}</h1>
      </div>
    );
  }
}