import jwt from "jsonwebtoken";

const genToken = async (userId) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"});
        return token;
    } catch (err) {
        console.log(`Error ${err} in token.js`);
    }
}

export default genToken;