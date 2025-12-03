import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB接続成功');
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('MongoDB接続エラー:', error);
        console.error('MONGODB_URI:', MONGODB_URI ? '設定済み' : '未設定');
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB接続エラー:', e);
    if (e instanceof Error) {
      console.error('エラーメッセージ:', e.message);
      console.error('エラースタック:', e.stack);
    }
    throw e;
  }

  return cached.conn;
}

export default connectDB;

