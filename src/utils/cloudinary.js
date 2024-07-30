// import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../app/config";

// import axios from "axios";

// export const cloudinaryUpload = async (image) => {
//   if (!image) return "";
//   try {
//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     const response = await axios({
//       url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
//       method: "POST",
//       data: formData,
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     const imageUrl = response.data.secure_url;
//     return imageUrl;
//   } catch (error) {
//     throw error;
//   }
// };

//upgrade cloudinary for uploading even file word, exel

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../app/config";
import axios from "axios";

export const cloudinaryUpload = async (file) => {
  if (!file) return "";
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // Xác định loại file
    // const fileType = file.type.startsWith("image/") ? "image" : "raw";
    // const fileType = "image";
    const response = await axios({
      url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const fileUrl = response.data.secure_url;
    return fileUrl;
  } catch (error) {
    throw error;
  }
};
