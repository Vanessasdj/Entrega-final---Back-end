const express = require("express");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const viewsRouter = require("./routes/views");
const http = require("http");
const exphbs = require("express-handlebars");
const { Server } = require("socket.io");
const Product = require("./models/Product");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("addProduct", async (data) => {
    await Product.create({ ...data });
    const products = await Product.find().lean();
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async (id) => {
    await Product.findByIdAndDelete(id);
    const products = await Product.find().lean();
    io.emit("updateProducts", products);
  });
});

mongoose.connect("mongodb://localhost:27017/ecommerce");

server.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
