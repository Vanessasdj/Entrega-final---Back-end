const express = require("express");
const ProductManager = require("../managers/ProductManager");
const router = express.Router();
const pm = new ProductManager();

router.get("/", (req, res) => {
  res.json(pm.getAllProducts());
});

router.get("/:pid", (req, res) => {
  const product = pm.getProductById(req.params.pid);
  if (product) res.json(product);
  else res.status(404).json({ error: "Produto não encontrado" });
});

router.post("/", (req, res) => {
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
  const newProduct = pm.addProduct({
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
});

router.put("/:pid", (req, res) => {
  const update = { ...req.body };
  delete update.id;
  const updated = pm.updateProduct(req.params.pid, update);
  if (updated) res.json(updated);
  else res.status(404).json({ error: "Produto não encontrado" });
});

router.delete("/:pid", (req, res) => {
  const deleted = pm.deleteProduct(req.params.pid);
  if (deleted) res.json({ message: "Produto removido" });
  else res.status(404).json({ error: "Produto não encontrado" });
});

module.exports = router;
