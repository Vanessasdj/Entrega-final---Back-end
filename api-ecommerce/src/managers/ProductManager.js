const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor(filePath = path.join(__dirname, "../data/products.json")) {
    this.filePath = filePath;
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async addProduct(product) {
    const products = await this.getAllProducts();
    const newProduct = {
      id: Date.now().toString(),
      ...product,
    };
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async deleteProduct(id) {
    const products = await this.getAllProducts();
    const filtered = products.filter((p) => p.id !== id);
    await fs.writeFile(this.filePath, JSON.stringify(filtered, null, 2));
    return filtered;
  }

  async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find((p) => p.id === id);
  }

  async updateProduct(id, update) {
    const products = await this.getAllProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...update };
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return products[idx];
  }
}

module.exports = ProductManager;
