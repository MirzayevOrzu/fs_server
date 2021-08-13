const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/files", validate, (req, res) => {
  const { filename, content } = req.body;

  fs.writeFile(`./files/${filename}`, content, (err) => {
    if (err) {
      res.status(500).json({
        message: "Server error",
      });
    } else {
      res.status(200).json({
        message: "File created successfully",
      });
    }
  });
});

app.get("/api/files", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      res.status(500).json({
        message: "Server error",
      });
    } else {
      res.status(200).json({
        message: "success",
        files,
      });
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
