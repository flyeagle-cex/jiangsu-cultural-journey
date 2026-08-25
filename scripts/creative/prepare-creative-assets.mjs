import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import AdmZip from "adm-zip";
import sharp from "sharp";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, "../..");
const OUTPUT_DIRECTORY = path.join(
  PROJECT_ROOT,
  "public/assets/creative/water-spirit-global-voyage",
);

const SOURCE_WIDTH = 4961;
const SOURCE_HEIGHT = 7016;
const OUTPUT_LONG_EDGE = 1800;
const WEBP_QUALITY = 86;
const MAX_ASSET_BYTES = 1_200_000;
const MAX_TOTAL_BYTES = 8_000_000;

const ASSET_MAPPING = [
  ["1.png", "cover-overview.webp"],
  ["2.png", "gift-set.webp"],
  ["3.png", "collection-overview.webp"],
  ["4.png", "packaging-box.webp"],
  ["5.png", "cap.webp"],
  ["6.png", "phone-cases.webp"],
  ["7.png", "eye-mask.webp"],
  ["8.png", "tote-bag.webp"],
  ["9.png", "drawstring-pouch.webp"],
  ["10.png", "bottle.webp"],
  ["11.png", "badges.webp"],
  ["12.png", "mugs.webp"],
];

function readSourceArgument() {
  const sourceIndex = process.argv.indexOf("--source");
  const sourceValue = sourceIndex >= 0 ? process.argv[sourceIndex + 1] : undefined;

  if (!sourceValue || sourceValue.startsWith("--")) {
    throw new Error(
      'Missing --source. Usage: npm run creative:prepare -- --source "<ZIP_OR_DIRECTORY_PATH>"',
    );
  }

  return path.resolve(sourceValue);
}

async function createSourceReader(sourcePath) {
  const sourceStats = await stat(sourcePath);

  if (sourceStats.isDirectory()) {
    return {
      kind: "directory",
      read: (fileName) => readFile(path.join(sourcePath, fileName)),
      sourceHash: null,
    };
  }

  if (!sourceStats.isFile() || path.extname(sourcePath).toLowerCase() !== ".zip") {
    throw new Error("--source must point to a ZIP archive or an extracted directory.");
  }

  const archiveBuffer = await readFile(sourcePath);
  const archive = new AdmZip(archiveBuffer);
  const entries = new Map(
    archive
      .getEntries()
      .filter((entry) => !entry.isDirectory)
      .map((entry) => [path.basename(entry.entryName), entry]),
  );

  return {
    kind: "zip",
    read(fileName) {
      const entry = entries.get(fileName);
      if (!entry) throw new Error(`Missing source artwork: ${fileName}`);
      return entry.getData();
    },
    sourceHash: createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase(),
  };
}

async function validateSources(reader) {
  const validated = [];

  for (const [sourceName, destinationName] of ASSET_MAPPING) {
    const input = await reader.read(sourceName);
    const metadata = await sharp(input, { failOn: "error", limitInputPixels: false }).metadata();

    if (
      metadata.format !== "png" ||
      metadata.width !== SOURCE_WIDTH ||
      metadata.height !== SOURCE_HEIGHT
    ) {
      throw new Error(
        `${sourceName} must be a ${SOURCE_WIDTH}x${SOURCE_HEIGHT} PNG; received ${metadata.width}x${metadata.height} ${metadata.format}.`,
      );
    }

    validated.push({ sourceName, destinationName, input });
  }

  return validated;
}

async function removeIfPresent(filePath) {
  try {
    await access(filePath);
    await unlink(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

async function convertAsset({ sourceName, destinationName, input }) {
  const destinationPath = path.join(OUTPUT_DIRECTORY, destinationName);
  const temporaryPath = `${destinationPath}.tmp`;

  await removeIfPresent(temporaryPath);
  await sharp(input, { failOn: "error", limitInputPixels: false })
    .resize({
      height: OUTPUT_LONG_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ effort: 6, quality: WEBP_QUALITY })
    .toFile(temporaryPath);

  await removeIfPresent(destinationPath);
  await rename(temporaryPath, destinationPath);

  const [metadata, outputStats] = await Promise.all([
    sharp(destinationPath).metadata(),
    stat(destinationPath),
  ]);

  if (metadata.width !== 1273 || metadata.height !== 1800 || metadata.format !== "webp") {
    throw new Error(
      `Unexpected output for ${destinationName}: ${metadata.width}x${metadata.height} ${metadata.format}.`,
    );
  }

  if (outputStats.size > MAX_ASSET_BYTES) {
    throw new Error(`${destinationName} exceeds ${MAX_ASSET_BYTES} bytes.`);
  }

  return {
    source: sourceName,
    destination: destinationName,
    width: metadata.width,
    height: metadata.height,
    bytes: outputStats.size,
  };
}

async function main() {
  const sourcePath = readSourceArgument();
  const reader = await createSourceReader(sourcePath);
  const validatedSources = await validateSources(reader);

  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const results = [];
  for (const source of validatedSources) results.push(await convertAsset(source));

  const totalBytes = results.reduce((sum, asset) => sum + asset.bytes, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    throw new Error(`Creative assets total ${totalBytes} bytes, above ${MAX_TOTAL_BYTES}.`);
  }

  console.log(`Source type: ${reader.kind}`);
  if (reader.sourceHash) console.log(`Source archive SHA-256: ${reader.sourceHash}`);
  console.table(results);
  console.log(`Output directory: ${path.relative(PROJECT_ROOT, OUTPUT_DIRECTORY)}`);
  console.log(`Total Web assets: ${totalBytes} bytes`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
