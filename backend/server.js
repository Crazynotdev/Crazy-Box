const express = require('express');
const multer = require('multer');
const mime = require('mime-types');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const PUBLIC_DIR = path.join(__dirname, '../frontend');

// Création du dossier uploads s’il n’existe pas
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(express.static(PUBLIC_DIR));
app.use('/file', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${nanoid(8)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const forbidden = ['.exe', '.sh', '.php', '.bat'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (forbidden.includes(ext)) return cb(new Error('Fichier interdit'));
    cb(null, true);
  }
}).single('file');

app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/file/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });
});

app.listen(PORT, () => console.log(`🟢 CrazyBox lancé sur http://localhost:${PORT}`));
