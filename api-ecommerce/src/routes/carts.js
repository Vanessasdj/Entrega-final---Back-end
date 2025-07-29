const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// Criar carrinho vazio
router.post("/", async (req, res) => {
  const newCart = await Cart.create({ products: [] });
  res.status(201).json(newCart);
});

// Buscar todos os carrinhos
router.get("/", async (req, res) => {
  const carts = await Cart.find();
  res.json(carts);
});

// Buscar carrinho por id com populate
router.get("/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product");
  if (cart) res.json(cart);
  else res.status(404).json({ error: "Carrinho não encontrado." });
});

// Adicionar produto ao carrinho
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrinho não encontrado." });
  const product = await Product.findById(pid);
  if (!product)
    return res.status(404).json({ error: "Produto não encontrado." });
  const prodInCart = cart.products.find((p) => p.product.toString() === pid);
  if (prodInCart) prodInCart.quantity += 1;
  else cart.products.push({ product: pid, quantity: 1 });
  await cart.save();
  res.json({ message: "Produto adicionado ao carrinho com sucesso.", cart });
});

// Remover produto do carrinho
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrinho não encontrado" });
  cart.products = cart.products.filter((p) => p.product.toString() !== pid);
  await cart.save();
  res.json({ message: "Produto removido do carrinho", cart });
});

// Atualizar todos os produtos do carrinho
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrinho não encontrado" });
  cart.products = products;
  await cart.save();
  res.json({ message: "Carrinho atualizado.", cart });
});

// Atualizar quantidade de um produto do carrinho
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrinho não encontrado" });
  const prod = cart.products.find((p) => p.product.toString() === pid);
  if (!prod)
    return res
      .status(404)
      .json({ error: "Produto não encontrado no carrinho" });
  prod.quantity = quantity;
  await cart.save();
  res.json({ message: "Quantidade atualizada.", cart });
});

// Remover todos os produtos do carrinho
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrinho não encontrado" });
  cart.products = [];
  await cart.save();
  res.json({ message: "Todos os produtos removidos do carrinho", cart });
});

module.exports = router;
