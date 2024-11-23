type EntityKeys<T> = Extract<keyof T, string>;

export type EntityType<T> = T | (new () => T);

export interface IFieldConfig<T> {
  fields?: (keyof T)[];
  alias?: string;
}

export function createEntityField<T extends object>(_entity: EntityType<T>, config: IFieldConfig<T> = {}): (EntityKeys<T> | string)[] {
  return [config.fields.map(field => `${config.alias}.${field.toString()}`).join(' ')];
}
