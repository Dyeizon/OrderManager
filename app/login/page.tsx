"use client"

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label, TextInput, Button } from 'flowbite-react';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Verifique a senha e tente novamente.');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center bg-slate-300'>
      <form onSubmit={handleSubmit} className="flex max-w-md w-4/5 flex-col gap-4 h-min bg-slate-100 p-10 rounded-lg">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="username" value="Usuário" />
        </div>
        <TextInput id="username" type="text" required value={username} onChange={(e) => setUsername(e.currentTarget.value)}/>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Senha" />
        </div>
        <TextInput id="password" type="password" required value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
      </div>
      <p style={{ color: 'red' }}>{error}</p>
      <Button type="submit">Login</Button>
    </form>
    </div>
  );
};

export default SignIn;
