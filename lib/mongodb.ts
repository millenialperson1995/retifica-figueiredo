import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://matrix:stayFrosty2*@cluster-rectify-managem.1qivctf.mongodb.net/rectifydb?appName=Cluster-Rectify-Management';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'rectifydb',
    bufferCommands: false,
  });

  cached.conn = await cached.promise;
  return cached.conn;
};