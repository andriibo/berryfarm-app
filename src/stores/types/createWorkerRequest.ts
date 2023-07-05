import {WorkerStatus} from 'src/stores/types/worker.type';

export type CreateWorkerRequest = {
  uuid: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Date;
  status: WorkerStatus;
};
