import * as fs from 'fs';
import * as path from 'path';

export class SimpleLogEngine {
  private index = new Map<string, number>();
  private fileOffset = 0;
  private fd: number;

  constructor(private filepath: string) {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.fd = fs.openSync(filepath, 'a+');
    this.rebuildIndex();
  }

  private rebuildIndex(): void {
    try {
      const stats = fs.fstatSync(this.fd);
      this.fileOffset = stats.size;
    } catch {}
  }

  public async set(key: string, value: string): Promise<void> {
    const entry = JSON.stringify({ key, value }) + '\n';
    const buffer = Buffer.from(entry, 'utf-8');

    // Escritura secuencial al final del archivo (append-only)
    fs.writeSync(this.fd, buffer, 0, buffer.length, this.fileOffset);

    // Actualizar índice en memoria con el offset exacto
    this.index.set(key, this.fileOffset);
    this.fileOffset += buffer.length;
  }

  public async get(key: string): Promise<string | null> {
    const offset = this.index.get(key);
    if (offset === undefined) return null;

    const buffer = Buffer.alloc(1024);
    fs.readSync(this.fd, buffer, 0, buffer.length, offset);
    const line = buffer.toString('utf-8').split('\n')[0];
    const parsed = JSON.parse(line);
    return parsed.value;
  }
}
