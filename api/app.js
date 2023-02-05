const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log(req.file);
        const { originalname, filename } = req.file;
        const modifiedFileName = uuidv4() + '-' + originalname;

        fs.rename
            (
                `uploads/${filename}`,
                `uploads/${modifiedFileName}`,
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

        res.json({ filePath: `http://localhost:5000/${modifiedFileName}` });
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(5000, () => {
    console.log('Example app listening on port : ' + 5000);
});