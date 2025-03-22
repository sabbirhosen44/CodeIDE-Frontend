const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Code IDE Server!");
});

app.listen(8080, () => {
  console.log(`Server is listening on port 8080....`);
});
