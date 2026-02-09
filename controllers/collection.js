const Collection = require("../models/collections");

async function handleCreateCollection(req, res) {
  const { title, desc } = req.body;
  if (!title || !desc)
    return res.status(400).json({ error: "All fields are required" });
  try {
    await Collection.create({
      title: title,
      desc: desc,
      createdBy: req.user._id,
    });
    return res.status(201).json({ status: "collection created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

async function handleEditCollection(req, res) {
  const cId = req.params.id;

  try {
    const updates = {};
    const allowed_updates = ["title", "desc"];
    for (const key of allowed_updates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }
    const updatedCollection = await Collection.findByIdAndUpdate(
      cId,
      { $set: updates },
      { new: true },
    );
    if (!updatedCollection)
      return res.json({ result: "error updating collection" });
    return res.json({ status : "updated successfully", result: updatedCollection });
  } catch (error) {
    return res.status(400).json({ status: "invalid request" });
  }
}

async function handleMyCollection(req, res) {
  const userId = req.user._id;
  try {
    const collections = await Collection.find({ createdBy: userId });
    if (!collections) return res.status(204).send(); 
    return res.json({ result: collections });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

// all the relevent data related to collection deletion is pending (future work)

async function handleDeleteCollection(req, res) {
  const userId = req.user._id;
  const collectionId = req.params.id;
  try {
    const collection = await Collection.findById(collectionId);
    if (!collection)
      return res.status(404).json({ error: "no collection found" });
    if (collection.createdBy.toString() === userId.toString()) {
      const deletedColl = await Collection.findByIdAndDelete(req.params.id);
      if (!deletedColl)
        return res.status(400).json({ error: "cannot delete collection" });
      return res.json({
        status: "collection deleted",
        collectionDeleted: deletedColl,
      });
    }
    return res.status(400).json({ error: "unauthorized action" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

async function handleGetCollectionById(req, res) {
  const cId = req.params.id;
  try {
    const collection = await Collection.findById(cId).populate(
      "createdBy",
      "_id fullName profileImageUrl followers username",
    );
    if (!collection) return res.status(204).send(); 
    return res.json({ result: collection });
  } catch (error) {
    return res.status(400).json({ status: "invalid request" });
  }
}

async function handleExploreCollections(req, res) {
  try {
    const collections = await Collection.find({}).populate(
      "createdBy",
      "_id fullName profileImageUrl followers username",
    );
    if (!collections) return res.status(204).send(); 
    return res.json({ result: collections });
  } catch (error) {
    return res.status(400).json({ status: "invalid request" });
  }
}

async function handleSearchCollection(req, res) {
  const query = req.params.q;
  try {
    const result = await Collection.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
      ],
    });
    if (result.length === 0) return res.status(204).send(); 
    return res.json({ results: result });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "An error occured", error: error.name });
  }
}

module.exports = {
  handleCreateCollection,
  handleEditCollection,
  handleMyCollection,
  handleDeleteCollection,
  handleGetCollectionById,
  handleExploreCollections,
  handleSearchCollection,
};
