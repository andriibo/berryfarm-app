export enum WorkerStatus {
  active = 'active',
  deleted = 'deleted',
  inactive = 'inactive',
}

export type Worker = {
  uuid: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Date;
  status?: WorkerStatus;
  createdTimestamp: Date;
  syncTimestamp: Date;
};
