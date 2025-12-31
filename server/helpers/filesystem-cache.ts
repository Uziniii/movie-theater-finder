import { mkdir } from "node:fs/promises";
import * as path from 'path'

export const GLOBAL_CACHE_DIR = '.cache'

export class FileSystemCache {
  private basePath: string
  private cacheDir: string

  constructor(basePath: string) {
    this.basePath = basePath
    this.cacheDir = path.join(GLOBAL_CACHE_DIR, basePath)
  }

  private async ensureCacheDir(): Promise<void> {
    await mkdir(this.cacheDir, { recursive: true })
  }

  private resolveKeyPath(key: string): string {
    const fileName = path.basename(key)
    return path.join(this.cacheDir, fileName)
  }

  async set(key: string, value: string): Promise<void> {
    await this.ensureCacheDir()
    const filePath = this.resolveKeyPath(key)
    await Bun.write(filePath, value)
  }

  async get(key: string): Promise<string | null> {
    const filePath = this.resolveKeyPath(key)
    const file = Bun.file(filePath)
    if (!(await file.exists())) return null
    return await file.text()
  }
}

export default FileSystemCache
