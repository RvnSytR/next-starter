import { mediaMetadata } from "../const";

function readFileAsURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}

async function getFilesAsURL(files: File[] | null) {
  if (!files || !files.every((file) => file.type.startsWith("image/")))
    throw new Error("Invalid file(s) provided!");
  const results: string[] = [];
  for (const item of files) {
    if (item.size > mediaMetadata.image.size.byte)
      throw new Error("Ukuran File Terlalu Besar!");
    results.push(await readFileAsURL(item));
  }
  return results;
}

export async function fileOnChangeAsURL(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  if (!event.target.files) return [];
  return await getFilesAsURL(Array.from(event.target.files));
}
