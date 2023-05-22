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
      firstname: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.firstname),
      lastname: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.lastname),
      surname: yup
        .string()
        .required(errorMessages.required)
        .min(1)
        .max(20, errorMessages.surname),
      dob: yup.string().required(errorMessages.required),
    })
    .required(),
};
