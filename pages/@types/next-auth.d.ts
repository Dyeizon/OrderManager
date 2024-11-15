import NextAuth from "next-auth";
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
