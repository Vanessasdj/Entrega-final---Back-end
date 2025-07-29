const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor(filePath = path.join(__dirname, "../data/carts.json")) {
    this.filePath = filePath;
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async saveCarts(carts) {
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.loadCarts();
    const newId =
      carts.length > 0 ? String(Number(carts[carts.length - 1].id) + 1) : "1";
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.loadCarts();
    return carts.find((c) => String(c.id) === String(cid));
  }

  async getAllCarts() {
    return await this.loadCarts();
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const carts = await this.loadCarts();
    const cart = carts.find((c) => String(c.id) === String(cid));
    if (!cart) return null;
    const prod = cart.products.find((p) => String(p.product) === String(pid));
    if (prod) {
      prod.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await this.saveCarts(carts);
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    const carts = await this.loadCarts();
    const cart = carts.find((c) => String(c.id) === String(cid));
    if (!cart) return null;
    cart.products = cart.products.filter(
      (p) => String(p.product) !== String(pid)
    );
    await this.saveCarts(carts);
    return cart;
  }

  async updateCart(cid, products) {
    const carts = await this.loadCarts();
    const cart = carts.find((c) => String(c.id) === String(cid));
    if (!cart) return null;
    cart.products = products;
    await this.saveCarts(carts);
    return cart;
  }
}

module.exports = CartManager;
