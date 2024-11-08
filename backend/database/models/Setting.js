import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    isSystemActive: { type: Boolean, required: true, default: true },
    sellProductCount: { type: Number, required: true, default: 0 },
    customerCount: { type: Number, required: true, default: 0 },
    isSystemPaymentActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', SettingsSchema);

export default Setting;
