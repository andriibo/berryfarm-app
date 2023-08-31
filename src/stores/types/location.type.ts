export enum LocationStatus {
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted',
}

export type Location = {
  id: number;
  title: string;
  status: LocationStatus;
};
