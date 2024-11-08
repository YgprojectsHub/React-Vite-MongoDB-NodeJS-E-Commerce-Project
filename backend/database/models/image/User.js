import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    avatarId: {type: String, required: true},
    filename: {type: String, required: true},
    imgUrl: { type: String, required: true }
  },
  { timestamps: true }
);

const UserImage = mongoose.model("userImage", imageSchema);

export default UserImage