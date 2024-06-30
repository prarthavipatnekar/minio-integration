const express = require("express");
const cors = require("cors");
const minio = require('./minio.js');

const app = express();

app.use(cors());

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`app listening at http://localhost:${port}`)
);

app.get('/pre-signed-url', minio.getPresignedUrl)