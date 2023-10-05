import mongoose, { Document, Schema } from 'mongoose';

interface Notification {
  receiverId : mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  type: 'Message' | 'Rescheduled' | 'Canceled' | 'Update';
  date: Date;
}

const notificationSchema = new Schema<Notification & Document>({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum:['Message' , 'Rescheduled' , 'Canceled' , 'Update'],required: true },
    date: { type: Date, required: true },
  
});

const NotificationModel = mongoose.model<Notification & Document>('Notification', notificationSchema);

export default NotificationModel;
