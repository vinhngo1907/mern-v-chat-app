export const checkImage = (file) => {
    // let err = "";
    if (!file) {
        return "File does not exist";
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type!=="image/jpg") {
        return "Image format is incorrect"
    }

    if (file.size > 1024 * 1024) {
        return "The largest image size is 1mb."
    }
}

export const imageUpload = async (images) => {
    let imgArr = [];
    for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const formData = new FormData();
        if (item.camera) {
            formData.append("file", item.camera);
        } else {
            formData.append("file", item);
        }

        formData.append("upload_preset", "vsosr4ei")
        formData.append("cloud_name", "v-webdev")
        const res = await fetch("https://api.cloudinary.com/v1_1/v-webdev/upload", {
            method: "POST",
            body: formData
        });
        const data = await res.json()
        console.log(data);
        imgArr.push({ public_id: data.public_id, url: data.secure_url });
    }
    return imgArr;
}