import path from 'path';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';

const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error("Error creating directory", error);
  }
};

export const POST = async (req: Request): Promise<NextResponse> => {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const filename = formData.get('fileName') as string | null || 'default.jpg';
  
  if (!filename) {
    return NextResponse.json({ error: "Filename not provided." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await ensureDirectoryExists(uploadDir);

  try {
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.error("Error occurred while saving file", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
