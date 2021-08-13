const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/api/files", validate, (req, res) => {
    const { filename, content } = req.body;

    fs.writeFile(`./files/${filename}`, content,  err => {
        if (err) {
        console.log(err.message);
           res.status(500).json({
            "message": "Server error"
          })
        } else {
            res.status(200).json({
                message: "File created successfully",
            })
        }
    })
})

function validate(req, res, next) {
    const {filename, content} = req.body;
    console.log(req.body);
    const allowedExtentions = ["log", "txt", "json", "yaml", "xml", "js"];

    if(filename === undefined) {
        res.status(400).json({
            message:  "Please specify 'filename' parameter"
        })
    } else if (content === undefined) {
        res.status(400).json({
            message:  "Please specify 'content' parameter"
        })
    } else {
        let extention = filename.slice(filename.lastIndexOf(".") + 1);
        if(!allowedExtentions.includes(extention)) {
            res.status(400).json({
                message: `File extention ${extention} is not allowed`
            })
        }
        next();
    }
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})