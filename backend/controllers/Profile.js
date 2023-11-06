import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const getProfileById = async(req, res) =>{
    try {
        const response = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProfile = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    
    let fileName = "";
    if(req.files === null){
        fileName = User.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        if(user.image !== null){
        const filepath = `./public/images/${user.image}`;
        fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    if(!fileName){
        fileName = user.image;
    }
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const {name, email, alamat, no_hp, tgl_lahir} = req.body;
    try {
        await User.update({
            name: name,
            email: email,
            alamat: alamat,
            no_hp: no_hp,
            tgl_lahir: tgl_lahir,
            image: fileName,
            url:url,    
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "Profile Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}