"use client"

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label, TextInput, Button } from 'flowbite-react';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const {data: session, status} = useSession();

  useEffect(() => {
    if(session) {
      router.push('/admin');
    }
  }, [status])

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Verifique as informações e tente novamente.');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center' style={{backgroundColor: 'var(--theme-color)'}}>
      <form onSubmit={handleSubmit} className="flex max-w-md w-4/5 flex-col gap-4 h-min bg-slate-100 p-10 rounded-lg">
        <img src="/favicon.svg" className="w-20 m-auto" alt="OrderManager Logo"/>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Usuário" />
          </div>
          <TextInput style={{ borderColor: '#AAA' }} id="username" type="text" required value={username} onChange={(e) => setUsername(e.currentTarget.value)}/>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Senha" />
          </div>
          <TextInput style={{borderColor: '#AAA'}} id="password" type="password" required value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
        </div>
      <p className='min-h-6 text-red-600'>{error}</p>
      <Button type="submit" disabled={status == 'loading'}>Entrar {session?.user?.name}</Button>
    </form>
    </div>
  );
};

export default SignIn;
