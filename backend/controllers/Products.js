import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes:['uuid','name','stockProduct'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Product.findAll({
                attributes:['uuid','name','stockProduct'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes:['uuid','name','stockProduct'],
                where:{
                    id: product.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Product.findOne({
                attributes:['uuid','name','stockProduct'],
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProduct = async(req, res) =>{
    const {name, stockProduct} = req.body;
    try {
        await Product.create({
            name: name,
            stockProduct: stockProduct,
            userId: req.userId
        });
        res.status(201).json({msg: "Product Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProduct = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, stockProduct} = req.body;
        if(req.role === "admin"){
            await Product.update({name, stockProduct},{
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Product.update({name, stockProduct},{
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteProduct = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, stockProduct} = req.body;
        if(req.role === "admin"){
            await Product.destroy({
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const addStock = async (req, res) => {
  try {
    const productId = req.params.productId;
    const amountToAdd = parseInt(req.body.amount);

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const product = await Product.findOne({
      where: {
        uuid: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Tambahkan stok
    product.stockProduct += amountToAdd;
    await product.save();

    res.status(200).json({ message: "Stock added successfully", product });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// routes/products.js
// ...

export const reduceStock = async (req, res) => {
    try {
      const productId = req.params.productId;
      const amountToReduce = parseInt(req.body.amount);
  
      if (isNaN(amountToReduce) || amountToReduce <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
  
      const product = await Product.findOne({
        where: {
          uuid: productId,
        },
      });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (product.stockProduct < amountToReduce) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
  
      // Kurangi stok
      product.stockProduct -= amountToReduce;
      await product.save();
  
      res.status(200).json({ message: "Stock reduced successfully", product });
    } catch (error) {
      console.error("Error reducing stock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  