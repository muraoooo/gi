import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, '名前は必須です'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'メールアドレスは必須です'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '有効なメールアドレスを入力してください'],
  },
  subject: {
    type: String,
    required: [true, '件名は必須です'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, '本文は必須です'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;


