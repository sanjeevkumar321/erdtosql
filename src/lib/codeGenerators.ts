import { ERDSchema, Entity, Column, Relationship } from '@/types/erd';

function colDef(col: Column): string {
  let def = `  ${col.name} ${col.type}`;
  if (col.isPrimaryKey) def += ' PRIMARY KEY';
  if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
  if (col.isRequired && !col.isPrimaryKey) def += ' NOT NULL';
  return def;
}

function getFKs(entity: Entity, relationships: Relationship[], entities: Entity[]): string[] {
  const fks: string[] = [];
  for (const rel of relationships) {
    if (rel.type === '1:N' && rel.targetEntityId === entity.id) {
      const source = entities.find(e => e.id === rel.sourceEntityId);
      if (source) {
        const pk = source.columns.find(c => c.isPrimaryKey);
        if (pk) {
          fks.push(`  FOREIGN KEY (${source.name.replace(/s$/, '')}_id) REFERENCES ${source.name}(${pk.name})`);
        }
      }
    }
    if (rel.type === '1:1') {
      if (rel.targetEntityId === entity.id) {
        const source = entities.find(e => e.id === rel.sourceEntityId);
        if (source) {
          const pk = source.columns.find(c => c.isPrimaryKey);
          if (pk) {
            fks.push(`  FOREIGN KEY (${source.name.replace(/s$/, '')}_id) REFERENCES ${source.name}(${pk.name}) UNIQUE`);
          }
        }
      }
    }
  }
  return fks;
}

function getJunctionTables(relationships: Relationship[], entities: Entity[]): string[] {
  const tables: string[] = [];
  for (const rel of relationships) {
    if (rel.type === 'N:M') {
      const src = entities.find(e => e.id === rel.sourceEntityId);
      const tgt = entities.find(e => e.id === rel.targetEntityId);
      if (src && tgt) {
        const srcPk = src.columns.find(c => c.isPrimaryKey);
        const tgtPk = tgt.columns.find(c => c.isPrimaryKey);
        if (srcPk && tgtPk) {
          const name = `${src.name}_${tgt.name}`;
          tables.push(
            `CREATE TABLE ${name} (\n` +
            `  ${src.name.replace(/s$/, '')}_id ${srcPk.type} NOT NULL,\n` +
            `  ${tgt.name.replace(/s$/, '')}_id ${tgtPk.type} NOT NULL,\n` +
            `  PRIMARY KEY (${src.name.replace(/s$/, '')}_id, ${tgt.name.replace(/s$/, '')}_id),\n` +
            `  FOREIGN KEY (${src.name.replace(/s$/, '')}_id) REFERENCES ${src.name}(${srcPk.name}),\n` +
            `  FOREIGN KEY (${tgt.name.replace(/s$/, '')}_id) REFERENCES ${tgt.name}(${tgtPk.name})\n` +
            `);`
          );
        }
      }
    }
  }
  return tables;
}

export function generateSQL(schema: ERDSchema): string {
  if (schema.entities.length === 0) return '-- Add entities to generate SQL';
  
  const parts: string[] = [];
  for (const entity of schema.entities) {
    const cols = entity.columns.map(colDef);
    const fks = getFKs(entity, schema.relationships, schema.entities);
    const allLines = [...cols, ...fks];
    parts.push(`CREATE TABLE ${entity.name} (\n${allLines.join(',\n')}\n);`);
  }
  parts.push(...getJunctionTables(schema.relationships, schema.entities));
  return parts.join('\n\n');
}

export function generatePostgreSQL(schema: ERDSchema): string {
  if (schema.entities.length === 0) return '-- Add entities to generate PostgreSQL';

  const parts: string[] = [];
  for (const entity of schema.entities) {
    const cols = entity.columns.map(col => {
      let t = col.type;
      if (t === 'TIMESTAMP') t = 'TIMESTAMP WITH TIME ZONE' as any;
      if (t === 'FLOAT') t = 'REAL' as any;
      if (t === 'DOUBLE') t = 'DOUBLE PRECISION' as any;
      let def = `  ${col.name} ${t}`;
      if (col.isPrimaryKey) def += ' PRIMARY KEY';
      if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
      if (col.isRequired && !col.isPrimaryKey) def += ' NOT NULL';
      if (col.type === 'TIMESTAMP') def += ' DEFAULT NOW()';
      return def;
    });
    const fks = getFKs(entity, schema.relationships, schema.entities);
    parts.push(`CREATE TABLE ${entity.name} (\n${[...cols, ...fks].join(',\n')}\n);`);
  }
  parts.push(...getJunctionTables(schema.relationships, schema.entities));
  
  // Add indexes
  for (const entity of schema.entities) {
    const uniqueCols = entity.columns.filter(c => c.isUnique && !c.isPrimaryKey);
    for (const col of uniqueCols) {
      parts.push(`CREATE UNIQUE INDEX idx_${entity.name}_${col.name} ON ${entity.name}(${col.name});`);
    }
  }
  
  return parts.join('\n\n');
}

export function generateMySQL(schema: ERDSchema): string {
  if (schema.entities.length === 0) return '-- Add entities to generate MySQL';

  const parts: string[] = [];
  for (const entity of schema.entities) {
    const cols = entity.columns.map(col => {
      let t = col.type;
      if (t === 'SERIAL') t = 'INT AUTO_INCREMENT' as any;
      if (t === 'BIGSERIAL') t = 'BIGINT AUTO_INCREMENT' as any;
      if (t === 'UUID') t = 'VARCHAR(36)' as any;
      if (t === 'TEXT') t = 'LONGTEXT' as any;
      
      let def = `  ${col.name} ${t}`;
      if (col.isPrimaryKey) def += ' PRIMARY KEY';
      if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
      if (col.isRequired && !col.isPrimaryKey) def += ' NOT NULL';
      return def;
    });
    const fks = getFKs(entity, schema.relationships, schema.entities);
    parts.push(`CREATE TABLE ${entity.name} (\n${[...cols, ...fks].join(',\n')}\n) ENGINE=InnoDB;`);
  }
  parts.push(...getJunctionTables(schema.relationships, schema.entities).map(t => t.replace(');', ') ENGINE=InnoDB;')));
  return parts.join('\n\n');
}

export function generateSQLite(schema: ERDSchema): string {
  if (schema.entities.length === 0) return '-- Add entities to generate SQLite';

  const parts: string[] = [];
  for (const entity of schema.entities) {
    const cols = entity.columns.map(col => {
      let t = col.type;
      if (t === 'SERIAL' || t === 'BIGSERIAL') t = 'INTEGER' as any; // SQLite auto-increments INTEGER PRIMARY KEY
      if (t === 'UUID' || t === 'TIMESTAMP' || t === 'DATE' || t === 'TIME') t = 'TEXT' as any;
      if (t === 'DECIMAL' || t === 'FLOAT' || t === 'DOUBLE') t = 'REAL' as any;
      
      let def = `  ${col.name} ${t}`;
      if (col.isPrimaryKey) def += ' PRIMARY KEY';
      if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
      if (col.isRequired && !col.isPrimaryKey) def += ' NOT NULL';
      return def;
    });
    const fks = getFKs(entity, schema.relationships, schema.entities);
    parts.push(`CREATE TABLE ${entity.name} (\n${[...cols, ...fks].join(',\n')}\n);`);
  }
  parts.push(...getJunctionTables(schema.relationships, schema.entities));
  return parts.join('\n\n');
}

export function generatePrisma(schema: ERDSchema): string {
  if (schema.entities.length === 0) return '// Add entities to generate Prisma Schema';

  const typeMap: Record<string, string> = {
    INTEGER: 'Int', BIGINT: 'BigInt', SERIAL: 'Int', BIGSERIAL: 'BigInt',
    VARCHAR: 'String', TEXT: 'String', CHAR: 'String',
    BOOLEAN: 'Boolean',
    TIMESTAMP: 'DateTime', DATE: 'DateTime', TIME: 'DateTime',
    DECIMAL: 'Decimal', FLOAT: 'Float', DOUBLE: 'Float',
    UUID: 'String', JSON: 'Json', JSONB: 'Json',
  };

  const models: string[] = [];
  for (const entity of schema.entities) {
    const fields: string[] = [];
    for (const col of entity.columns) {
      let line = `  ${col.name} ${typeMap[col.type] || 'String'}${col.isRequired ? '' : '?'}`;
      if (col.isPrimaryKey) line += ' @id';
      if (col.type === 'SERIAL' || col.type === 'BIGSERIAL') line += ' @default(autoincrement())';
      if (col.isUnique && !col.isPrimaryKey) line += ' @unique';
      if (col.type === 'TIMESTAMP') line += ' @default(now())';
      if (col.type === 'UUID') line += ' @default(uuid())';
      fields.push(line);
    }
    
    // Relationships
    for (const rel of schema.relationships) {
      if (rel.sourceEntityId === entity.id) {
        const target = schema.entities.find(e => e.id === rel.targetEntityId);
        if (target) {
          if (rel.type === '1:N') {
            fields.push(`  ${target.name.toLowerCase()}s ${target.name}[]`);
          } else if (rel.type === '1:1') {
            fields.push(`  ${target.name.toLowerCase()} ${target.name}?`);
          }
        }
      } else if (rel.targetEntityId === entity.id) {
        const source = schema.entities.find(e => e.id === rel.sourceEntityId);
        if (source) {
          const pk = source.columns.find(c => c.isPrimaryKey);
          if (pk) {
            const fkName = `${source.name.toLowerCase()}_id`;
            fields.push(`  ${source.name.toLowerCase()} ${source.name} @relation(fields: [${fkName}], references: [${pk.name}])`);
            fields.push(`  ${fkName} ${typeMap[pk.type] || 'Int'}`);
          }
        }
      }
    }
    
    models.push(`model ${entity.name} {\n${fields.join('\n')}\n}`);
  }

  return `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n` + models.join('\n\n');
}

export function generateJSONSchema(schema: ERDSchema): string {
  if (schema.entities.length === 0) return '{}';

  const typeMap: Record<string, string> = {
    INTEGER: 'integer', BIGINT: 'integer', SERIAL: 'integer', BIGSERIAL: 'integer',
    VARCHAR: 'string', TEXT: 'string', CHAR: 'string',
    BOOLEAN: 'boolean',
    TIMESTAMP: 'string', DATE: 'string', TIME: 'string',
    DECIMAL: 'number', FLOAT: 'number', DOUBLE: 'number',
    UUID: 'string', JSON: 'object', JSONB: 'object',
  };

  const schemas: Record<string, any> = {};
  for (const entity of schema.entities) {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    for (const col of entity.columns) {
      const prop: any = { type: typeMap[col.type] || 'string' };
      if (col.type === 'TIMESTAMP' || col.type === 'DATE') prop.format = 'date-time';
      if (col.type === 'UUID') prop.format = 'uuid';
      properties[col.name] = prop;
      if (col.isRequired || col.isPrimaryKey) required.push(col.name);
    }
    schemas[entity.name] = {
      type: 'object',
      properties,
      required,
    };
  }

  return JSON.stringify({ $schema: 'http://json-schema.org/draft-07/schema#', definitions: schemas }, null, 2);
}
