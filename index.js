const express = require("express");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());

app.get("/createfile/:foldername", (req, res) => {
    const folderName = req.params.foldername;
    const dateTimeFormat = 'YYYY-MM-DD_HH-mm-ss';
    const fileName = `${moment().format(dateTimeFormat)}.txt`;
    const filePath = path.join(__dirname, folderName, fileName);

    fs.mkdir(path.join(__dirname, folderName), { recursive: true }, (err) => {
        if (err) {
            return res.status(500).send("Failed to create directory");
        }

        const content = new Date().toISOString();
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                return res.status(500).send("Failed to create file");
            }
            res.status(200).send(`${fileName} --- new file created`);
        });
    });
});

app.put("/updatefile/:foldername/:filename", (req, res) => {
    const folderName = req.params.foldername;
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, folderName, fileName);

    const newContent = req.body.content;

    fs.writeFile(filePath, newContent, (err) => {
        if (err) {
            return res.status(500).send("Failed to update file");
        }
        res.status(200).send(`${fileName} --- updated successfully`);
    });
});

app.use((req, res) => {
    res.status(404).send("The requested resource was found.");
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
