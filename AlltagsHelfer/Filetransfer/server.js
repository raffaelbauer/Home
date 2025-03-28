const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const uploadDir = path.join(__dirname, "uploads");

// Sicherstellen, dass der Upload-Ordner existiert
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer-Konfiguration für Dateinamen mit Zeitstempel
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Statische Dateien für das Frontend
app.use(express.static("public"));

// Datei-Upload-Route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        console.error("❌ Kein Upload erhalten.");
        return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Datei-Download-Route mit Download-Erzwingung
app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);

    // Sicherstellen, dass die Datei existiert
    if (!fs.existsSync(filePath)) {
        console.error("❌ Datei nicht gefunden:", filePath);
        return res.status(404).send("Datei nicht gefunden");
    }

    // Download starten
    res.download(filePath, req.params.filename, err => {
        if (err) {
            console.error("❌ Fehler beim Download:", err);
            res.status(500).send("Download fehlgeschlagen");
        }
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
