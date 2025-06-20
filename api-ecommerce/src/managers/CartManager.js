const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
    this.carts = this.loadCarts();
  }

  loadCarts() {
    if (!fs.existsSync(this.filePath)) return [];
    const data = fs.readFileSync(this.filePath);
    return JSON.parse(data);
  }

  saveCarts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
  }

  createCart() {
    const newId =
      this.carts.length > 0
        ? String(Number(this.carts[this.carts.length - 1].id) + 1)
        : "1";
    const newCart = { id: newId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(cid) {
    return this.carts.find((c) => String(c.id) === String(cid));
  }

  addProductToCart(cid, pid, quantity = 1) {
    const cart = this.getCartById(cid);
    if (!cart) return null;
    const prod = cart.products.find((p) => String(p.product) === String(pid));
    if (prod) {
      prod.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    this.saveCarts();
    return cart;
  }
}

module.exports = CartManager;
