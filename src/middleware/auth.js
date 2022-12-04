const jwt = require('jsonwebtoken')
const userModel = require("../models/user.model");

const verifyToken = async (req, res, next) => {
	const authHeader = req.header('Authorization');
	const token = authHeader && authHeader.split(' ')[1];

	if (!token)
		return res
			.status(400)
			.json({ success: false, message: 'Access token not found' });

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		if (!decoded) return res.status(403).json({ success: false, message: 'You don\'t have permission' });

		const user = await userModel.findById(decoded.userId).select("-password");
		if (!user) return res.status(401).json({ msg: "Invalid token" });
		req.user = user;

		next()
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Invalid token"' });
	}
}

module.exports = verifyToken;
