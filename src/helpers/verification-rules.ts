import * as yup from 'yup';
import {errorMessages} from 'src/constants/constants';

export const validation = {
  login: yup
    .object({
      username: yup.string().required(errorMessages.required).min(1).max(20, errorMessages.username),
    })
    .required(),
  createWorker: yup
    .object({
      uuid: yup.string(),
      firstName: yup.string().required(errorMessages.required).min(1).max(20, errorMessages.firstName),
      lastName: yup.string().required(errorMessages.required).min(1).max(20, errorMessages.lastName),
      middleName: yup.string().required(errorMessages.required).min(1).max(20, errorMessages.middleName),
      birthDate: yup.string().required(errorMessages.required),
    })
    .required(),
  createHarvest: yup
    .object({
      uuid: yup.string(),
      qty: yup.number().required(errorMessages.required),
      harvestPackageId: yup.number().required(errorMessages.required),
      locationId: yup.number().required(errorMessages.required),
      productId: yup.number().required(errorMessages.required),
      productQualityId: yup.number().required(errorMessages.required),
      weightTotal: yup
        .number()
        .typeError(errorMessages.number)
        .required(errorMessages.required)
        .min(0.1, errorMessages.minWeight)
        .max(999999.99, errorMessages.maxWeight),
    })
    .required(),
};
