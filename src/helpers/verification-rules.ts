import * as yup from 'yup';
import {errorMessages} from 'src/constants/constants';

export const validation = {
  login: yup
    .object({
      username: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.username),
    })
    .required(),
  createWorker: yup
    .object({
      firstName: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.firstName),
      lastName: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.lastName),
      middleName: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.middleName),
      birthDate: yup.string().required(errorMessages.required),
    })
    .required(),
  createHarvest: yup
    .object({
      weight: yup
        .number()
        .typeError(errorMessages.number)
        .required(errorMessages.required)
        .min(0.1, errorMessages.minWeight)
        .max(999999.99, errorMessages.maxWeight),
    })
    .required(),
};
