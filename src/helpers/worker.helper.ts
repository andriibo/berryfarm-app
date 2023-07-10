import {Worker} from 'src/stores/types/worker.type';

export const getFullname = (data: Worker) => {
  return `${data.firstName}${data.middleName ? ` ${data.middleName}` : ''} ${data.lastName}`;
};

export const capitalizeFirstLowercaseRest = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
