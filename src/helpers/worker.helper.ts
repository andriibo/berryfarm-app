import {Worker} from 'src/stores/types/worker.type';

export const getFullname = (data: Worker) => {
  return `${data.firstName}${data.middleName ? ` ${data.middleName}` : ''} ${data.lastName}`;
};
