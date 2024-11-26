"use client";

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label, TextInput, Button } from 'flowbite-react';
import Image from 'next/image';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      switch (parseInt(session.privilegeLevel)) {
        case 3:
          router.push('/admin');
          break;
        case 2:
          router.push('/caixa');
          break;
        case 1:
          router.push('/cozinha');
          break;
        default:
          router.push('/telao');
          break;
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FFE0B1' }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-w-md w-4/5 flex-col gap-6 h-min bg-white p-10 rounded-xl shadow-md"
        style={{
          border: '2px solid #FF9800', // Borda laranja
        }}
      >
        {/* Logo e Boas-Vindas */}
        <div className="flex flex-col items-center justify-center mb-6">
          <Image
            src="/favicon.svg"
            width={100} // Logo maior
            height={100}
            alt="Agiliza Aí Logo"
            className="rounded-full border-4 border-orange-500"
          />
          <p className="text-orange-800 font-semibold text-lg mt-4">
            Boas Vindas ao <span className="font-bold">Agiliza Aí!</span>
          </p>
        </div>

        {/* Campos de Texto */}
        <div>
          <div className="mb-2">
            <Label
              htmlFor="username"
              value="Usuário"
              className="text-orange-800 font-semibold"
            />
          </div>
          <TextInput
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <div className="mb-2">
            <Label
              htmlFor="password"
              value="Senha"
              className="text-orange-800 font-semibold"
            />
          </div>
          <TextInput
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Mensagem de Erro */}
        <p className="text-sm text-red-600 text-center min-h-6">{error}</p>

        {/* Botão de Enviar */}
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded"
        >
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default SignIn;