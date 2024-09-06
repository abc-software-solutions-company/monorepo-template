import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, json, text } from '@nozbe/watermelondb/decorators';

import { WMTableName } from '../localdb.constant';
import type { WMPostSeoData } from '../localdb.interface';
import { rawInput, sanitizeStringArray } from '../localdb.sanitize';

export class WMPost extends Model {
  static table = WMTableName.POSTS;

  @field('title')
  title!: string;

  @text('body')
  body?: string;

  @json('tags', sanitizeStringArray)
  tags!: string[];

  @field('is_public')
  is_public!: boolean;

  @json('seo', rawInput)
  seo?: WMPostSeoData;
}

export const postSchema = tableSchema({
  name: WMTableName.POSTS,
  columns: [
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string', isOptional: true },
    { name: 'tags', type: 'string' },
    { name: 'is_public', type: 'boolean' },
    { name: 'seo', type: 'string', isOptional: true },
  ],
});
