import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    // {
    //   toVersion: 2,
    //   steps: [
    //     createTable({
    //       name: WMTableName.ANOTHER,
    //       columns: [
    //         { name: 'title', type: 'string' },
    //       ],
    //     }),
    //   ],
    // },
  ],
});
