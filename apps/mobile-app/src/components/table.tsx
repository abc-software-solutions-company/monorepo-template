import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type Alignment = 'left' | 'center' | 'right';

interface ICustomColumnMeta {
  align?: Alignment;
}

type TableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  rowIdAccessor: (row: T) => string;
};

const Table = <T extends object>({ data, columns, rowIdAccessor }: TableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: rowIdAccessor,
    getCoreRowModel: getCoreRowModel(),
  });

  const getColumnAlignment = (columnMeta: unknown): Alignment => {
    return (columnMeta as ICustomColumnMeta)?.align || 'center';
  };

  const renderRow = ({ item }: { item: T }) => (
    <View style={styles.row}>
      {table
        .getRowModel()
        .rowsById[rowIdAccessor(item)]?.getVisibleCells()
        .map(cell => {
          const columnAlign = getColumnAlignment(cell.column.columnDef.meta);

          return (
            <Text key={cell.id} style={[styles.cell, { textAlign: columnAlign }]}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Text>
          );
        })}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {table.getHeaderGroups().map(headerGroup => (
        <View key={headerGroup.id} style={styles.row}>
          {headerGroup.headers.map(header => {
            const columnAlign = getColumnAlignment(header.column.columnDef.meta);

            return (
              <Text key={header.id} style={[styles.cell, styles.headerCell, { textAlign: columnAlign }]}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );

  return <FlatList data={data} renderItem={renderRow} keyExtractor={rowIdAccessor} ListHeaderComponent={renderHeader} stickyHeaderIndices={[0]} />;
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
  },
});

export default Table;
