const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const { setupMiddleware, errorHandler } = require("./src/config/middleware");
const { setupSwagger } = require("./src/config/swagger");
const { setupRoutes } = require("./src/config/routes");

const app = express();
const PORT = process.env.PORT || 3000;

setupMiddleware(app);
setupSwagger(app);
setupRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(" Server is running!");
  console.log(`Port: ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
