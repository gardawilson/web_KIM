import express from "express";
import {
    getProfileById,
    updateProfile
} from "../controllers/Profile.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/profile/:id', getProfileById);
router.patch('/profile/:id',  updateProfile);

export default router;

// import express from "express";
// import multer from "multer"; // Import multer
// import {
//     getProfileById,
//     updateProfile
// } from "../controllers/Profile.js";
// import { verifyUser } from "../middleware/AuthUser.js";

// const router = express.Router();

// // Definisikan storage dan upload multer di sini
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../filePhoto"); // Lokasi penyimpanan file
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// router.get('/profile/:id', verifyUser, getProfileById);

// // Gunakan upload.single() untuk menghandle pengunggahan satu berkas
// router.patch('/profile/:id', verifyUser, upload.single('file'), updateProfile);

// export default router;
