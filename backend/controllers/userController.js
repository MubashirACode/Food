import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Helper function to create JWT token
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Added token expiration
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        return res
            .status(200)
            .json({ success: true, token, message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Server error" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const exists = await userModel.findOne({ email }); // Fixed typo
        if (exists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res
                .status(400)
                .json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Sanitize name (basic example, adjust as needed)
        if (name.length > 50) {
            return res
                .status(400)
                .json({ success: false, message: "Name is too long" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res
            .status(201)
            .json({ success: true, token, message: "Registration successful" });
    } catch (error) {
        console.error("Registration error:", error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Server error" });
    }
};

export { loginUser, registerUser };