const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generalAccessToken = async payload => {
    const expiresIn = 30 * 60; // 30 minutes
    const access = jwt.sign(
        {
            ...payload,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn }
    );

    const expirationTime = Date.now() + expiresIn * 1000;
    const expirationTimeUTC = new Date(expirationTime).toUTCString();

    return {
        access,
        expires: expirationTimeUTC,
    };
};

// tạo private key - public key để bảo mật token
const generalRefreshToken = async payload => {
    const expiresIn = 2 * 24 * 60 * 60; // 2 day
    const refresh = jwt.sign(
        {
            ...payload,
        },
        process.env.REFRESH_TOKEN,
        { expiresIn }
    );

    const expirationTime = Date.now() + expiresIn * 1000;
    const expirationTimeUTC = new Date(expirationTime).toUTCString();

    return {
        refresh,
        expires: expirationTimeUTC,
    };
};

 
const createTokenPair = (payload, privateKey) => {
    try {
        const access = jwt.sign(payload, privateKey, {
            algorithm: "HS256",
            expiresIn: "1h",
        });

        const expiresAccess = convertTimeUTC(24 * 60 * 60);
        const accessToken = {
            access,
            expiresAccess,
        };

        // refresh
        const refresh = jwt.sign(payload, privateKey, {
            algorithm: "HS256",
            expiresIn: "7 days",
        });
        const expiresRefresh = convertTimeUTC(7 * 24 * 60 * 60);
        const refreshToken = {
            refresh,
            expiresRefresh,
        };

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("error.message", error.message);

        new Error(error.message);
    }
};

const convertTimeUTC = expiresIn => {
    const expirationTime = Date.now() + expiresIn * 1000;
    const expirationTimeUTC = new Date(expirationTime).toUTCString();

    return expirationTimeUTC;
};

const verifyToken = (token, privateKey) => {
    try {
        const payload = jwt.verify(token, privateKey, { complete: true });
        return payload;
    } catch (error) {
        new Error(error.message);
    }
};
module.exports = {
    generalAccessToken,
    generalRefreshToken,
    createTokenPair,
    verifyToken,
};