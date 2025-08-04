const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\x1b[32m✓ Server is listening on port ${PORT}...\x1b[0m`);
});
