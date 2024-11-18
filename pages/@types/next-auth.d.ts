// eslint-disable-next-line
import NextAuth from "next-auth";

// eslint-disable-next-line
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    privilegeLevel: string;
    username: string;
  }

  interface User {
    privilegeLevel: string;
    username: string;
  }
}
