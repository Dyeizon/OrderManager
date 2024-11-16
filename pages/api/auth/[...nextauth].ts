import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import jwt from 'jsonwebtoken';
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

interface JWTToken {
  privilegeLevel: string;
  id: string,
  username: string,
  [key: string]: any;
}

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
          return {
            id: user.id, 
            username: user.username,
            privilegeLevel: user.privilegeLevel,
          }
        }
        else throw new Error('Falha na autenticação')
      }
    })
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/',
    signOut: '/',
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({ secret, token }) => {
      const typedToken = token as JWTToken;
      return jwt.sign(typedToken, secret);
    },
    
    decode: async ({ secret, token }) => {
      if(!token) throw new Error('JWT Token is not defined');
      const decoded = jwt.verify(token, secret);
      return decoded as JWTToken;
    }
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as JWTToken).privilegeLevel = user.privilegeLevel;
        (token as JWTToken).id = user.id;
        (token as JWTToken).username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      session.privilegeLevel = (token as JWTToken).privilegeLevel;
      session.username = (token as JWTToken).username;
      return session;
    }
  }
})

async function verifyUser(username: string, password: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ username }).select('-__v');
  
    if(!user) throw new Error('Usuário não encontrado');
  
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error('Credenciais inválidas');
  
    return { 
      id: user._id, 
      username: user.username, 
      privilegeLevel: user.privilegeLevel 
    };
    
  } catch (error) {
    throw new Error('Falha na autenticação');
  }

}
