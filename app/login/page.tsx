"use client"

import { useSession, signIn } from "next-auth/react";

export default function Login() {
    const {data: session, status} = useSession();

    if(!session) {
        return (
            <div>
                <button className="btn btn-primary" onClick={() => signIn('google')}>Entrar com Google</button>
            </div>
        );
    } else {
        return <h1>{status}</h1>
    }
}