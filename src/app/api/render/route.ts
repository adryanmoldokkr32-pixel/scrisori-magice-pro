import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);

export const maxDuration = 300; // 5 min timeout for video rendering

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recipientName = typeof body.recipientName === 'string'
      ? body.recipientName.trim().slice(0, 50)
      : 'Dragostea Mea';

    if (!recipientName) {
      return NextResponse.json(
        { error: 'Numele destinatarului este necesar.' },
        { status: 400 }
      );
    }

    // Generate unique output filename
    const fileId = crypto.randomBytes(8).toString('hex');
    const outputDir = path.join(os.tmpdir(), 'remotion-renders');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `love-letter-${fileId}.mp4`);

    // Use npx remotion render to generate the video
    const projectRoot = process.cwd();
    const entryPoint = path.join(projectRoot, 'src', 'remotion', 'index.ts');

    const inputProps = JSON.stringify({ recipientName });

    await execFileAsync(
      'npx',
      [
        'remotion',
        'render',
        entryPoint,
        'LoveLetter',
        outputPath,
        '--props',
        inputProps,
        '--codec',
        'h264',
        '--image-format',
        'jpeg',
        '--jpeg-quality',
        '90',
        '--log',
        'error',
      ],
      {
        cwd: projectRoot,
        timeout: 240000, // 4 min timeout
        env: { ...process.env, NODE_ENV: 'production' },
      }
    );

    // Read the file and return it
    if (!fs.existsSync(outputPath)) {
      return NextResponse.json(
        { error: 'Randarea video a eșuat. Fișierul nu a fost generat.' },
        { status: 500 }
      );
    }

    const videoBuffer = fs.readFileSync(outputPath);

    // Clean up
    try { fs.unlinkSync(outputPath); } catch {}

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="scrisoare-magica-${encodeURIComponent(recipientName)}.mp4"`,
        'Content-Length': String(videoBuffer.length),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Eroare necunoscută';
    console.error('Render error:', message);
    return NextResponse.json(
      { error: `Randarea video a eșuat: ${message}` },
      { status: 500 }
    );
  }
}
