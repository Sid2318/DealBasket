import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Signup failed" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};


// 🔐 Signup Workflow (Short Steps)
// 1️⃣ Frontend sends name, email, password
// 2️⃣ Backend checks if email already exists
// 3️⃣ If exists → error
// 4️⃣ Hash password using bcrypt
// 5️⃣ Save user in MongoDB
// 6️⃣ Send success response


// 🔓 Login Workflow (Short Steps)
// 1️⃣ Frontend sends email & password
// 2️⃣ Backend finds user in MongoDB
// 3️⃣ If not found → error
// 4️⃣ Compare password using bcrypt
// 5️⃣ If match → create JWT token
// 6️⃣ Send token to frontend


// 🔁 After Login (Very Important)
// 7️⃣ Frontend stores JWT
// 8️⃣ Frontend sends JWT in Authorization header for protected APIs
// 9️⃣ Backend verifies JWT and allows access