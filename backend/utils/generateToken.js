const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (user) => {
    const access_token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    );
    return access_token;
};

module.exports = generateToken;