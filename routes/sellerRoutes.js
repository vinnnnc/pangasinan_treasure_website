const express = require("express");
const router = express.Router();
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");
const upload = require("../helpers/multerConfig");

// Get all sellers
router.get("/", async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new seller
router.post("/", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, location } = req.body;
    const profilePic = req.file; // Uploaded file object

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = "/uploads/" + profilePic.filename;
    const { originalname, filename, size } = req.file;
    console.log("Uploaded file:", { originalname, filename, size });

    const seller = new Seller({
      user: userId,
      location,
      name,
      storeLogo: imageUrl,
    });

    const newSeller = await seller.save();
    res.status(201).json(newSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get seller by ID
router.get("/:id", getSeller, (req, res) => {
  console.log(res.seller);
  res.json(res.seller);
});

// Update seller by ID
router.patch("/:id", getSeller, async (req, res) => {
  if (req.body.name != null) {
    res.seller.name = req.body.name;
  }
  if (req.body.storeLogo != null) {
    res.seller.storeLogo = req.body.storeLogo;
  }
  try {
    const updatedSeller = await res.seller.save();
    res.json(updatedSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete seller by ID
router.delete("/:id", getSeller, async (req, res) => {
  try {
    await res.seller.remove();
    res.json({ message: "Seller deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get seller by ID
async function getSeller(req, res, next) {
  try {
    let seller = await Seller.findOne({ user: req.params.id });
    if (seller == null) {
      seller = await Seller.findById(req.params.id);
      if (seller == null)
        return res.status(404).json({ message: "Seller not found" });
    }
    res.json({ name: seller.name, _id: seller._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// // Route to add product to seller's products list
// router.post(
//   "/addproduct",
//   upload.array("productGallery", 5),
//   async (req, res) => {
//     const {
//       user,
//       productCategory,
//       productName,
//       productDescription,
//       productVariants,
//     } = req.body;
//     const productGallery = req.files.map((file) => file.path);

//     try {
//       // Find the seller by user ID
//       const seller = await Seller.findOne({ user });

//       if (!seller) {
//         return res.status(404).json({ message: "Seller not found" });
//       }

//       // Create a new product
//       const product = new Product({
//         category: productCategory,
//         name: productName,
//         description: productDescription,
//         gallery: productGallery,
//         variants: productVariants,
//       });

//       // Save the product
//       await product.save();

//       // Add the product to seller's products list
//       seller.products.push(product);
//       await seller.save();

//       res.status(201).json(product);
//     } catch (error) {
//       console.error("Error adding product:", error.message);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

module.exports = router;
