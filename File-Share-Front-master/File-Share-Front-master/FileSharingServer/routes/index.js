'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

module.exports = router;

const express = require('express');
const app = express();
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/filedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(5000, () => console.log('Server started on port 5000'));

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

const FileSchema = new mongoose.Schema({
    fileName: String,
    sharedLink: String,
});
const File = mongoose.model('File', FileSchema);

app.post('/share/:id', async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    const sharedLink = `http://localhost:5000/view/${file._id}`;
    file.sharedLink = sharedLink;
    await file.save();
    res.send(sharedLink);
});

app.get('/view/:id', async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    file.views = (file.views || 0) + 1;
    await file.save();

    res.sendFile(__dirname + '/uploads/' + file.fileName);
});
