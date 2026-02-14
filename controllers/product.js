const Product = require("../models/product");
const mongoose = require("mongoose");
const Collection = require("../models/collections");

async function handleCreateProduct(req, res) {
  const collectionId = req.params.id;
  if (!(await Collection.findById(collectionId))) {
    return res.status(400).json({ message: "Invalid Collection ID" });
  }
  const { name, desc, link } = req.body;
  if (!name || !desc || !link)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const product = await Product.create({
      name: name,
      desc: desc,
      link: link,
      cId: collectionId,
    });

    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { $addToSet: { products: product._id } },
      { new: true },
    ).populate({
      path: "products",
      options: { sort: { createdAt: -1 } },
    });

    return res
      .status(201)
      .json({ message: "created", updatedcollection: updatedCollection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleCreateProduct,
};
