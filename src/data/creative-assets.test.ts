import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { creativeManifest } from "@/data/creative-manifest";

const publicRoot = path.resolve(process.cwd(), "public");
const assetRoot = path.join(
  publicRoot,
  "assets",
  "creative",
  "water-spirit-global-voyage",
);

describe("prepared creative assets", () => {
  it("ships every manifest asset as a bounded WebP with matching dimensions", async () => {
    const [project] = creativeManifest;
    const assets = [project.coverAsset, ...project.gallery].filter(
      (asset): asset is NonNullable<typeof asset> => asset !== null,
    );
    let totalBytes = 0;

    expect(assets).toHaveLength(12);
    for (const asset of assets) {
      const filePath = path.join(publicRoot, asset.src.replace(/^\//, ""));
      const fileStat = await stat(filePath);
      const metadata = await sharp(filePath).metadata();

      totalBytes += fileStat.size;
      expect(path.extname(filePath)).toBe(".webp");
      expect(fileStat.size).toBeLessThanOrEqual(1_200_000);
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(asset.width);
      expect(metadata.height).toBe(asset.height);
    }

    expect(totalBytes).toBeLessThanOrEqual(8_000_000);
  });

  it("does not publish original PNG boards in the creative asset directory", async () => {
    const files = await readdir(assetRoot);

    expect(files).toHaveLength(12);
    expect(files.every((fileName) => fileName.endsWith(".webp"))).toBe(true);
  });
});
