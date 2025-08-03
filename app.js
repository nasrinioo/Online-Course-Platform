const express = require("express");
const cors = require("cors");

const routes = require("./src/config/routes");
const { setupMiddleware, errorHandler } = require("./src/config/middleware");
const { setupSwagger } = require("./src/config/swagger");

const app = express();

app.set("trust proxy", true);
app.disable("x-powered-by");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupMiddleware(app);
setupSwagger(app);
app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
