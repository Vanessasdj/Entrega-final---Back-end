const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
    this.products = this.loadProducts();
  }

  loadProducts() {
    if (!fs.existsSync(this.filePath)) return [];
    const data = fs.readFileSync(this.filePath);
    return JSON.parse(data);
  }

  saveProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(pid) {
    return this.products.find((p) => String(p.id) === String(pid));
  }

  addProduct(product) {
    const newId =
      this.products.length > 0
        ? String(Number(this.products[this.products.length - 1].id) + 1)
        : "1";
    const newProduct = { id: newId, ...product };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(pid, update) {
    const idx = this.products.findIndex((p) => String(p.id) === String(pid));
    if (idx === -1) return null;
    const { id, ...rest } = this.products[idx];
    this.products[idx] = { id, ...rest, ...update };
    this.saveProducts();
    return this.products[idx];
  }

  deleteProduct(pid) {
    const idx = this.products.findIndex((p) => String(p.id) === String(pid));
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    this.saveProducts();
    return true;
  }
}

module.exports = ProductManager;
