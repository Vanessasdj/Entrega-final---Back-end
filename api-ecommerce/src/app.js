const express = require("express");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const viewsRouter = require("./routes/views");
const http = require("http");
const exphbs = require("express-handlebars");
const { Server } = require("socket.io");
const products = require("./data/products");
const carts = require("./data/carts");
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
  socket.on("addProduct", (data) => {
    products.push({ id: Date.now().toString(), ...data });
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      io.emit("updateProducts", products);
    }
  });
});

server.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
