import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  callbacks: {
    session({ session, token, user }) {
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "OrderManager",
      credentials: {
        username: {label: 'Usuário', type: 'text'},
        password: {label: 'Senha', type: 'password'},
      },

      async authorize(credentials, req){
        const user = {id: "1", name: 'Dyeizon', email: 'aaa'}
        
        if (user) return user
        else return null
      }
    })
  ],
})


