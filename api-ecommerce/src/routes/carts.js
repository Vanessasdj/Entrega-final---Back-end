const express = require("express");
const router = express.Router();
const products = require("../data/products");
const carts = require("../data/carts");

router.get("/", (req, res) => {
  res.json(carts);
});

router.post("/:cartId/products/:productId", (req, res) => {
  const { cartId, productId } = req.params;

  const productExists = products.find((p) => p.id === productId);
  if (!productExists) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  const cart = carts.find((c) => c.id === cartId);
  if (!cart) {
    return res.status(404).json({ error: "Carrinho não encontrado." });
  }

  cart.products.push(productId);
  res
    .status(200)
    .json({ message: "Produto adicionado ao carrinho com sucesso." });
});

module.exports = router;
