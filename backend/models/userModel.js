const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    designation: { type: String },
    division: { type: String },
    department: { type: String },
    mobile: { type: String },
    dateOfBirth: { type: Date },
    memberId: { type: String, unique: true, sparse: true }, // Unique Member ID (ORD-XXXX or LIF-XXXX)
    membershipType: {
      type: String,
      enum: ["Ordinary", "Lifetime", "None"],
      default: "None",
    },
    isMember: { type: Boolean, default: false }, // True when membership is active
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    refreshToken: { type: String, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Helper method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
