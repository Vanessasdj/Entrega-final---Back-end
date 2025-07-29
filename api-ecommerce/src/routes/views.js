const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Rota home - busca todos os produtos do MongoDB
router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("home", { products });
});

// Rota realtimeproducts - busca todos os produtos do MongoDB
router.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find().lean();
  res.render("realTimeproducts", { products });
});

// Página de produtos com paginação
router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query, cartId } = req.query; // <-- cartId via query param
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
    lean: true,
  };

  const result = await Product.paginate(filter, options);

  res.render("products", {
    products: result.docs,
    cartId, // <-- Passa o cartId para a view
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
      ? `/products?limit=${limit}&page=${result.prevPage}&cartId=${
          cartId || ""
        }`
      : null,
    nextLink: result.hasNextPage
      ? `/products?limit=${limit}&page=${result.nextPage}&cartId=${
          cartId || ""
        }`
      : null,
  });
});

// Página de detalhes do produto
router.get("/products/:pid", async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  if (!product) return res.status(404).render("404");
  res.render("productDetail", { product });
});

// Página de um carrinho específico
router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid)
    .populate("products.product")
    .lean();
  if (!cart) return res.status(404).render("404");
  res.render("cart", { cart });
});

module.exports = router;
