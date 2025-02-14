const [imageReferences, setImageReferences] = useState([]);

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  try {
    const response = await fetch(`http://localhost:${PORT}/upload`, {
      method: "POST",
      body: formData,
    });
    const newImageReferences = await response.json();
    setImageReferences((prev) => [...prev, ...newImageReferences]);
  } catch (error) {
    console.error("Error uploading files:", error);
    setToastMessage("Error uploading files.");
  }
};

import multer from "multer";
import path from "path";
import crypto from "crypto";
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.array("images"), (req, res) => {
  const imageReferences = req.files.map((file) => ({
    id: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
  }));
  res.json(imageReferences);
});
