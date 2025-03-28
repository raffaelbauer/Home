const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const uploadDir = path.join(__dirname, "uploads");

// Upload-Verzeichnis erstellen, falls nicht vorhanden
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer-Konfiguration mit eindeutigem Dateinamen
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Frontend (index.html + CSS/JS) aus Ordner "public" bereitstellen
app.use(express.static("public"));

// Datei-Upload-Route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        console.error("❌ Keine Datei erhalten");
        return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }

    // URL zur späteren Verwendung im Link
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Download-Route mit erzwungenem Download über Content-Disposition
app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);

    // Prüfen, ob Datei existiert
    if (!fs.existsSync(filePath)) {
        console.error("❌ Datei nicht gefunden:", filePath);
        return res.status(404).send("Datei nicht gefunden");
    }

    // Download erzwingen (öffnet "Speichern unter..." Dialog im Browser)
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
