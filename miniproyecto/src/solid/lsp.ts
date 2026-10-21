export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
}

export class InMemoryTaskRepository implements IRepository<{ id: string; title: string }> {
  private readonly items = new Map<string, { id: string; title: string }>();

  async findById(id: string): Promise<{ id: string; title: string } | null> {
    return this.items.get(id) || null;
  }

  async save(task: { id: string; title: string }): Promise<void> {
    this.items.set(task.id, task);
  }
}
