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
};
