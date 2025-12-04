import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './lib/mongodb';
import User from './models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // 新規ユーザーを作成
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: 'user',
            });
          } else {
            // 既存ユーザーの情報を更新（必要に応じて）
            existingUser.name = user.name || existingUser.name;
            existingUser.image = user.image || existingUser.image;
            existingUser.updatedAt = new Date();
            await existingUser.save();
          }
        } catch (error) {
          console.error('ユーザー保存エラー:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === 'google') {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error('JWT取得エラー:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};

