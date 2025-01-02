import express from "express";
import bodyParser from "body-parser";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
