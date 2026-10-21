export interface IStorageService {
  uploadFile(filePath: string, destination: string): Promise<string>;
}

export class DiskStorageService implements IStorageService {
  constructor(private uploadDir: string) {}

  public async uploadFile(filePath: string, destination: string): Promise<string> {
    return `${this.uploadDir}/${destination}`;
  }
}

export class S3StorageService implements IStorageService {
  constructor(private bucket: string, private region: string) {}

  public async uploadFile(filePath: string, destination: string): Promise<string> {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${destination}`;
  }
}
