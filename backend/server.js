const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { diffLines } = require("diff");

const app = express();
const PORT = 6000;

app.use(cors());
app.use(express.json());

// Function to recursively get folder structure
const getFolderStructure = (dirPath) => {
    let result = [];
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        items.forEach((item) => {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                result.push({ name: item.name, type: "folder", children: getFolderStructure(fullPath) });
            } else {
                result.push({ name: item.name, type: "file" });
            }
        });
    } catch (error) {
        console.error("Error reading directory:", error);
    }
    return result;
};

// API to get folder structure
app.post("/getStructure", (req, res) => {
    const { basePath } = req.body;
    if (!fs.existsSync(basePath)) {
        return res.status(400).json({ error: "Path does not exist." });
    }
    const structure = getFolderStructure(basePath);
    res.json(structure);
});

// API to get file content
app.post("/getFileContent", (req, res) => {
    const { filePath } = req.body;
    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "File does not exist." });
    }
    const content = fs.readFileSync(filePath, "utf-8");
    res.json({ content });
});

// API to compare files
app.post("/compareFiles", (req, res) => {
    const { file1, file2 } = req.body;
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
        return res.status(400).json({ error: "One or both files do not exist." });
    }
    const content1 = fs.readFileSync(file1, "utf-8");
    const content2 = fs.readFileSync(file2, "utf-8");
    const differences = diffLines(content1, content2);
    res.json({ differences });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
