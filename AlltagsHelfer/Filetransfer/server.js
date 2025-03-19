const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // CORS-Modul laden

const app = express();
app.use(cors()); // CORS aktivieren

const uploadDir = path.join(__dirname, "uploads");

// Falls der Upload-Ordner nicht existiert, wird er erstellt
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.static("public"));

// Datei-Upload
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Keine Datei hochgeladen" });

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Statische Dateien aus dem Upload-Ordner bereitstellen
app.use("/uploads", express.static(uploadDir));

// Server starten
app.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));
