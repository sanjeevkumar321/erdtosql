import { ERDSchema } from '@/types/erd';

export const sampleSchema: ERDSchema = {
  entities: [
    {
      id: 'user',
      name: 'users',
      columns: [
        { id: 'user-id', name: 'id', type: 'SERIAL', isPrimaryKey: true, isUnique: true, isRequired: true },
        { id: 'user-name', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isUnique: false, isRequired: true },
        { id: 'user-email', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isUnique: true, isRequired: true },
        { id: 'user-created', name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isUnique: false, isRequired: true },
      ],
    },
    {
      id: 'order',
      name: 'orders',
      columns: [
        { id: 'order-id', name: 'id', type: 'SERIAL', isPrimaryKey: true, isUnique: true, isRequired: true },
        { id: 'order-user', name: 'user_id', type: 'INTEGER', isPrimaryKey: false, isUnique: false, isRequired: true },
        { id: 'order-total', name: 'total', type: 'DECIMAL', isPrimaryKey: false, isUnique: false, isRequired: true },
        { id: 'order-status', name: 'status', type: 'VARCHAR', isPrimaryKey: false, isUnique: false, isRequired: true },
        { id: 'order-created', name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isUnique: false, isRequired: true },
      ],
    },
    {
      id: 'product',
      name: 'products',
      columns: [
        { id: 'product-id', name: 'id', type: 'SERIAL', isPrimaryKey: true, isUnique: true, isRequired: true },
        { id: 'product-name', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isUnique: false, isRequired: true },
        { id: 'product-price', name: 'price', type: 'DECIMAL', isPrimaryKey: false, isUnique: false, isRequired: true },
        { id: 'product-desc', name: 'description', type: 'TEXT', isPrimaryKey: false, isUnique: false, isRequired: false },
      ],
    },
  ],
  relationships: [
    {
      id: 'rel-user-order',
      sourceEntityId: 'user',
      targetEntityId: 'order',
      type: '1:N',
    },
    {
      id: 'rel-order-product',
      sourceEntityId: 'order',
      targetEntityId: 'product',
      type: 'N:M',
    },
  ],
};

export const sampleNodePositions: Record<string, { x: number; y: number }> = {
  user: { x: 50, y: 50 },
  order: { x: 400, y: 50 },
  product: { x: 400, y: 350 },
};
