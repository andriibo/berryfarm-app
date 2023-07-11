import {WorkerStatus} from 'src/stores/types/worker.type';

export type CreateWorkerRequest = {
  firstName: string;
  lastName: string;
  middleName: string | undefined;
  birthDate: Date | undefined;
  status: WorkerStatus;
};
