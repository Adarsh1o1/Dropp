const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required!"],
    },
    desc: {
      type: String,
      require: [true, "Description is required!"],
    },
    link: {
      type: String,
      require: [true, "Link is required!"],
    },
    media: {
      type: [String],
      default: "/images/book.svg",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    cId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "collection",
      required: [true, "Collection ID is required!"],
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
