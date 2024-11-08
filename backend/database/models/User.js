import mongoose from "mongoose";

const DevicesSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, required: true  },
    operatingSystem: { type: String, required: true  },
    browserInfo: { type: String, required: true  },
    version: { type: String, required: true  },
    platform: { type: String, required: true  },
    deviceType: { type: String, required: true  },
    source: { type: String, required: true  },
    loginDate: { type: Date, required: true  },
    location: {
      regionName: { type: String, required: true  },
      city: { type: String, required: true  },
      lat: { type: Number, required: true  },
      lon: { type: Number, required: true  },
      timezone: { type: String, required: true  },
      isp: { type: String, required: true  },
      org: { type: String, required: true  },
      as: { type: String, required: true  },
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    avatar: { type: String, required: true },

    isActive: { type: Boolean, default: true },
    isEmailVerification: { type: Boolean, default: false },
    lastLogin: { type: Date, required: true },
    ruleViolationCount: { type: Number, default: 0 },

    loginedDevices: [DevicesSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
