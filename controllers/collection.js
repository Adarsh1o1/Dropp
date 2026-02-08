const Collection = require("../models/collections");

async function handleCreateCollection(req, res) {
  const { name, desc } = req.body;
  if (!name || !desc)
    return res.status(400).json({ error: "All fields are required" });
  try {
    await Collection.create({
      title: name,
      desc: desc,
      createdBy: req.user._id,
    });
    return res.status(201).json({ status: "collection created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

async function handleMyCollection(req, res) {
  const userId = req.user._id;
  try {
    const collections = await Collection.find({ createdBy: userId });
    if (!collections) return res.json({result: "no collection found"});
    return res.json({result: collections});
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

module.exports = {
  handleCreateCollection,
  handleMyCollection,
};
