export enum LocationStatus {
  active = 'active',
  inactive = 'inactive',
}

export type Location = {
  id: number;
  title: string;
  status: LocationStatus;
};
