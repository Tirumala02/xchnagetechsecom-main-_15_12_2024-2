import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// const authUser = async (req, res, next) => {
//     const authHeader = req.headers.authorization || req.headers.Authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
//     }

//     const token = authHeader.split(' ')[1]; // Extract token
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.body.userId = decoded.id;
//         next();
//     } catch (error) {
//         console.log("Token verification failed:", error);
//         res.status(401).json({ success: false, message: 'Invalid Token' });
//     }
// };
export default authUser;