import fs from "fs";
import path from "path";
import https from "https";

const destDir = path.resolve("./public/dock-icons");
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const icons = [
  "html5", "css", "js", "typescript", "react", "nextjs", "tailwindcss",
  "materialui", "reactnative", "nodejs", "nestjs", "express",
  "graphql", "mongodb", "postgresql", "mysqli", "firebase", "supabase",
  "docker", "figma", "adobexd", "illustrator", "photoshop", "webflow"
];

const baseUrl = "https://raw.githubusercontent.com/waseemakram-dev/forteve-yasir/main/public/dock-icons";

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on("finish", () => {
            file.close(resolve);
          });
        }).on("error", reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  console.log("Starting download of dock icons...");
  for (const id of icons) {
    const filename = `${id}.png`;
    const url = `${baseUrl}/${filename}`;
    const dest = path.join(destDir, filename);
    try {
      await downloadFile(url, dest);
      console.log(`✓ Downloaded ${filename}`);
    } catch (e) {
      console.error(`✗ Error downloading ${filename}:`, e.message);
    }
  }
  console.log("All dock icons downloaded successfully!");
}

main();
