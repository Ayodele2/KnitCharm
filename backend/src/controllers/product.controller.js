import { Product } from "../models/product.model.js";

// --- CREATE PRODUCT ---
export async function createProduct(req, res) {
  try {
    // 1. Check if images were uploaded via Multer
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    // 2. Extract file paths (or URLs if you use Cloudinary)
    // Note: If saving locally, ensure app.use('/uploads', express.static('uploads')) is in server.js
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    // 3. Create product (Multer puts text fields in req.body)
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      category: req.body.category,
      images: imageUrls, // Array of strings for your Mongoose schema
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ message: error.message });
  }
}

// --- UPDATE PRODUCT ---
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    
    // Find existing product first
    let product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Prepare update data from text fields
    const updateData = { ...req.body };

    // If new images are uploaded, replace the old ones
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // return the modified document
      runValidators: true, // ensure price/stock mins are respected
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(400).json({ message: error.message });
  }
}

// --- GET PRODUCT BY ID ---
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    // Catch CastError (invalid ObjectId format)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}