const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    let filter = {};

    if (query) {
      if (query.startsWith("category=")) {
        filter.category = query.split("=")[1];
      } else if (query.startsWith("status=")) {
        filter.status = query.split("=")[1] === "true";
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
    };

    const result = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null,
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (product) res.json(product);
    else res.status(404).json({ error: "Produto não encontrado" });
  } catch {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (
      !title ||
      !description ||
      !code ||
      price == null ||
      status == null ||
      stock == null ||
      !category ||
      !thumbnails
    ) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }
    const newProduct = await Product.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.id;
    const updated = await Product.findByIdAndUpdate(req.params.pid, update, {
      new: true,
    });
    if (updated) res.json(updated);
    else res.status(404).json({ error: "Produto não encontrado" });
  } catch {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (deleted) res.json({ message: "Produto removido" });
    else res.status(404).json({ error: "Produto não encontrado" });
  } catch {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

module.exports = router;
