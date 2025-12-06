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
          
          // ADMIN_EMAILS環境変数から管理者メールアドレスを取得
          const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
          const isAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // 新規ユーザーを作成（管理者メールアドレスの場合はadmin、それ以外はuser）
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: isAdmin ? 'admin' : 'user',
            });
          } else {
            // 既存ユーザーの情報を更新
            existingUser.name = user.name || existingUser.name;
            existingUser.image = user.image || existingUser.image;
            // ADMIN_EMAILSに含まれている場合は管理者権限を付与
            if (isAdmin && existingUser.role !== 'admin') {
              existingUser.role = 'admin';
            }
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
    async jwt({ token, user, account, trigger }) {
      // 初回ログイン時
      if (user && account?.provider === 'google') {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.email = dbUser.email;
            console.log('JWT - Initial login, role:', dbUser.role);
          }
        } catch (error) {
          console.error('JWT取得エラー:', error);
        }
      } else if (token.email) {
        // 既存セッションの場合も、毎回MongoDBから最新のroleを取得
        // trigger === 'update' の場合はセッション更新時
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            const oldRole = token.role;
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
            if (oldRole !== dbUser.role) {
              console.log('JWT - Role updated:', oldRole, '->', dbUser.role);
            }
          }
        } catch (error) {
          console.error('JWT更新エラー:', error);
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

