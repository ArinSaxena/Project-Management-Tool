const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

async function createUser(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all fields",
            });
        }

        if (!email.match(emailRegex)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
            });
        }

        if (!password.match(passwordRegex)) {
            return res.status(400).json({
                message:
                    "Password must be between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
            });
        }

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const token = await generateToken(user);

        res.status(201).json({
            messaage: "User created successfully",
            user : {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            }
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields",
            });
        }

        if (!email.match(emailRegex)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
            });
        }

        if (!password.match(passwordRegex)) {
            return res.status(400).json({
                message:
                    "Password must be between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
            });

        }




        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = await generateToken(user);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}


async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json({
            users,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await User.findByIdAndUpdate(id, {
            name,
            email,
            password,
            role,
        });
        res.status(200).json({
            message: "User updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}



module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
};

