require("dotenv").config({path: "./env"});
const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key: `${process.env.API_KEY}`,
    api_secret: `${process.env.API_SECRET}`

});

const uploadController = {
   delete(req, res) {
        try {
            const { public_id } = req.body;
            console.log({public_id})
            if (!public_id) return res.status(400).json(responseDTO.badRequest('No images Selected'));

            cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
                if (err) return res.status(400).json({msg: err.message});
                console.log({ result })
                res.json({msg: "Deleted Image in successfully", result});
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error.message});
        }
    }
}

module.exports = uploadController;