export type DataType = 
  | 'INTEGER' | 'BIGINT' | 'SERIAL' | 'BIGSERIAL'
  | 'VARCHAR' | 'TEXT' | 'CHAR'
  | 'BOOLEAN'
  | 'TIMESTAMP' | 'DATE' | 'TIME'
  | 'DECIMAL' | 'FLOAT' | 'DOUBLE'
  | 'UUID' | 'JSON' | 'JSONB';

export interface Column {
  id: string;
  name: string;
  type: DataType;
  isPrimaryKey: boolean;
  isUnique: boolean;
  isRequired: boolean;
}

export interface Entity {
  id: string;
  name: string;
  columns: Column[];
  color?: string;
}

export type RelationshipType = '1:1' | '1:N' | 'N:M';

export interface Relationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: RelationshipType;
  sourceColumnId?: string;
  targetColumnId?: string;
}

export interface ERDSchema {
  entities: Entity[];
  relationships: Relationship[];
}

export const DATA_TYPES: DataType[] = [
  'INTEGER', 'BIGINT', 'SERIAL', 'BIGSERIAL',
  'VARCHAR', 'TEXT', 'CHAR',
  'BOOLEAN',
  'TIMESTAMP', 'DATE', 'TIME',
  'DECIMAL', 'FLOAT', 'DOUBLE',
  'UUID', 'JSON', 'JSONB',
];
