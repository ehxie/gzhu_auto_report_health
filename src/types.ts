export interface Entity {
  id: string;
  name: string;
  status: string;
  create: number; // second
  update: number; // second
}

export type Entities = Array<Entity>;
