export interface ITaskReader {
  getById(id: string): Promise<any | null>;
  listAll(): Promise<any[]>;
}

export interface ITaskWriter {
  save(task: any): Promise<void>;
  delete(id: string): Promise<void>;
}

// Un servicio de consulta solo depende de la interfaz de lectura
export class TaskQueryService {
  constructor(private readonly reader: ITaskReader) {}

  async fetchActiveTasks(): Promise<any[]> {
    return await this.reader.listAll();
  }
}
