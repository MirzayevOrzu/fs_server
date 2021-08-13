const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const bodyParser = require("body-parser");
const { validateFile, validateParams } = require("./middlewares");
const { catchError, ExpressError, grapExtention } = require("./utils");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.post(
  "/api/files",
  validateFile,
  catchError(async (req, res, next) => {
    const { filename, content } = req.body;
    const files = await readdir("./files");

    if (files.includes(filename))
      return next(new ExpressError(`File with ${filename} exists`, 400));

    await writeFile(`./files/${filename}`, content);
    res.status(200).json({
      message: "File created successfully",
    });
  })
);

app.put(
  "/api/files",
  validateFile,
  catchError(async (req, res, next) => {
    const { filename, content } = req.body;
    const files = await readdir("./files");

    if (!files.includes(filename))
      return next(new ExpressError(`File with ${filename} doesn't exist`, 400));

    await writeFile(`./files/${filename}`, content);
    res.status(200).json({
      message: "File updated successfully",
    });
  })
);

app.get(
  "/api/files",
  catchError(async (req, res) => {
    const files = await readdir("./files");
    res.status(200).json({
      message: "success",
      files,
    });
  })
);

app.get(
  "/api/files/:filename",
  validateParams,
  catchError(async (req, res, next) => {
    const { filename } = req.params;
    const files = await readdir("./files");

    if (!files.includes(filename))
      return next(new ExpressError(`No file with ${filename} found`, 400));

    const content = await readFile(`./files/${filename}`);
    const { birthtime } = fs.statSync(`./files/${filename}`);
    res.status(200).json({
      message: "success",
      filename,
      content: content.toString(),
      extension: grapExtention(filename),
      uploadedDate: birthtime,
    });
  })
);

app.delete(
  "/api/files/:filename",
  validateParams,
  catchError(async (req, res, next) => {
    const { filename } = req.params;
    const files = await readdir("./files");
    if (!files.includes(filename))
      return next(new ExpressError(`No file with ${filename} found`, 400));

    await unlink(`./files/${filename}`);
    res.status(200).json({
      message: "File deleted successfully",
    });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError());
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Server error";
  res.status(statusCode).json({
    message: err.message,
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
