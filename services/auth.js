const jwt = require("jsonwebtoken");

const secret = "Adar$h i5 a node nOde Devel0per#23484 feer4"

function generateToken(user) {
    const payload = {
        _id : user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullname: user.fullName,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        followers: user.followers,
        following: user.following
    }
    const token = jwt.sign(payload, secret);
    return token;
}

function validateToken(token) {
    try {
        const payload = jwt.verify(token, secret);
    
        return payload;
        
    } catch (error) {
        return null;
    }
}



module.exports = {
    generateToken,
    validateToken
}