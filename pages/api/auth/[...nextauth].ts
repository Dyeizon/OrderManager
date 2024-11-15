import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        username: {label: 'Usuário', type: 'text'},
        password: {label: 'Senha', type: 'password'},
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        

        const user = await verifyUser(credentials.username, credentials.password);
        
        if (user) {
          return {id: String(user.id), username: user.username}
        }
        else throw new Error('Falha na autenticação')
      }
    })
  ],

  pages: {
    signIn: '@/login/',
  },

  session: {
    strategy: 'jwt',
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  }
})

async function verifyUser(username: string, password: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ username }).select('-__v');
  
    if(!user) throw new Error('Usuário não encontrado');
  
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error('Credenciais inválidas');
  
    return { id: user._id, username: user.username, privilegeLevel: user.privilegeLevel };
    
  } catch (error) {
    throw new Error('Falha na autenticação');
  }

}
