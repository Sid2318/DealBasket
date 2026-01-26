import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 2592000, // 30 days in seconds
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Method to add refresh token
userSchema.methods.addRefreshToken = function (refreshToken) {
  this.refreshTokens.push({ token: refreshToken });
  return this.save();
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = function (refreshToken) {
  this.refreshTokens = this.refreshTokens.filter(
    (tokenObj) => tokenObj.token !== refreshToken,
  );
  return this.save();
};

// Method to clear all refresh tokens
userSchema.methods.clearAllRefreshTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

export default mongoose.model("User", userSchema);

/* 
=== USER MODEL OVERVIEW ===

Schema Fields:
1. name (String, required) - User's display name
2. email (String, required, unique) - User's email address
3. password (String, required) - Hashed password using bcrypt
4. role (String, enum) - User role: 'customer', 'seller', 'admin'
5. refreshTokens (Array) - Stores active refresh tokens for multiple devices
6. timestamps - Automatically managed createdAt and updatedAt

Schema Methods:
1. addRefreshToken(token)
   - Adds new refresh token to user's token array
   - Supports multiple device login
   - Saves user document after adding token
   - Returns saved user document

2. removeRefreshToken(token)
   - Removes specific refresh token from array
   - Used for single device logout
   - Saves user document after removal
   - Returns saved user document

3. clearAllRefreshTokens()
   - Removes all refresh tokens from array
   - Used for logout from all devices
   - Saves user document after clearing
   - Returns saved user document

Security Features:
- Unique email constraint prevents duplicate accounts
- Password field excluded from default queries
- Refresh tokens stored as array for multi-device support
- Automatic timestamp tracking for audit trails
- Enum validation for user roles
*/
