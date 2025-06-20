const express = require("express");
const CartManager = require("../managers/CartManager");
const router = express.Router();
const cm = new CartManager();

router.post("/", (req, res) => {
  const newCart = cm.createCart();
  res.status(201).json(newCart);
});

router.get("/:cid", (req, res) => {
  const cart = cm.getCartById(req.params.cid);
  if (cart) res.json(cart.products);
  else res.status(404).json({ error: "Carrinho não encontrado" });
});

router.post("/:cid/product/:pid", (req, res) => {
  const quantity = req.body.quantity ? Number(req.body.quantity) : 1;
  const updatedCart = cm.addProductToCart(
    req.params.cid,
    req.params.pid,
    quantity
  );
  if (updatedCart) res.json(updatedCart);
  else res.status(404).json({ error: "Carrinho não encontrado" });
});

module.exports = router;
