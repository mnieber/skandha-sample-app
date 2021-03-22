export type EntityT = {
  id: string;
};

export type TodoT = EntityT & {
  name: string;
  state: string;
};

export type TodoByIdT = { [id: string]: TodoT };
