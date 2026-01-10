// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const AdminSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       select: true, // IMPORTANT for login
//     },

//     role: {
//       type: String,
//       enum: ["SUPER_ADMIN", "ADMIN", "OFFICER"],
//       default: "ADMIN",
//     },

//     active: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// /* --------------------------------------------------
//    HASH PASSWORD BEFORE SAVE (FIXED)
// -------------------------------------------------- */
// AdminSchema.pre("save", async function (next) {
//   try {
//     // Only hash if password is new or modified
//     if (!this.isModified("password")) {
//       return next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /* --------------------------------------------------
//    PASSWORD COMPARISON METHOD (CRITICAL FIX)
// -------------------------------------------------- */
// AdminSchema.methods.comparePassword = async function (plainPassword) {
//   return bcrypt.compare(plainPassword, this.password);
// };

// module.exports = mongoose.model("Admin", AdminSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: true,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "OFFICER"],
      default: "ADMIN",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* --------------------------------------------------
   HASH PASSWORD BEFORE SAVE (CORRECT)
-------------------------------------------------- */
AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* --------------------------------------------------
   PASSWORD COMPARISON METHOD
-------------------------------------------------- */
AdminSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
