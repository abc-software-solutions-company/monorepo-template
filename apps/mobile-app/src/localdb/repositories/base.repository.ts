import { Database, Model } from '@nozbe/watermelondb';

class BaseRepository<T extends Model> {
  private readonly database: Database;
  private readonly collectionName: string;

  constructor(database: Database, collectionName: string) {
    this.database = database;
    this.collectionName = collectionName;
  }

  getCollection() {
    return this.database.collections.get<T>(this.collectionName);
  }

  async getAll(): Promise<T[]> {
    const collection = this.getCollection();
    const response = await collection.query().fetch();

    return response;
  }

  async getById(id: string): Promise<T> {
    const collection = this.getCollection();
    const response = await collection.find(id);

    return response;
  }

  async create(data: Partial<T>): Promise<T> {
    const collection = this.getCollection();

    return await this.database.write(async () => {
      const response = await collection.create(model => {
        if (data.id) {
          model._raw.id = data.id;
        }
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'id' && value !== undefined) {
            model[key as keyof T] = value as T[keyof T];
          }
        });
      });

      return response;
    });
  }

  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<T> {
    const collection = this.getCollection();

    return await this.database.write(async () => {
      const record = await collection.find(id);
      const response = await record.update(model => {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            model[key as keyof T] = value as T[keyof T];
          }
        });
      });

      return response;
    });
  }

  async delete(id: string): Promise<void> {
    const collection = this.getCollection();

    return await this.database.write(async () => {
      const record = await collection.find(id);

      await record.destroyPermanently();
    });
  }

  async count(): Promise<number> {
    const collection = this.getCollection();
    const response = await collection.query().fetchCount();

    return response;
  }
}

export default BaseRepository;
