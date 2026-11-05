import fs from 'node:fs';
import path from 'node:path';

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

// True when the file is in /public (or the src is an external URL).
// On the built site, missing files are left out; `npm run dev` shows placeholders for them.
export const showMedia = (src: string) => import.meta.env.DEV || mediaExists(src);

export const mediaExists = (src: string) =>
  /^https?:/.test(src) || fs.existsSync(path.join(process.cwd(), 'public', src));
