import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {Worker} from 'src/stores/types/worker.type';

type IWorker = Pick<
  Worker,
  'uuid' | 'firstName' | 'lastName' | 'middleName' | 'birthDate'
>;

type IWorkerState = {
  worker: IWorker;
};

const initialState: IWorkerState | any = {
  worker: {
    uuid: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '' as unknown as Date,
  },
};

const authSlice = createSlice({
  name: 'Worker',
  initialState,
  reducers: {
    setWorker: (state: IWorkerState, {payload}: PayloadAction<IWorker>) => {
      state.worker.uuid = payload.uuid;
      state.worker.firstName = payload.firstName;
      state.worker.lastName = payload.lastName;
      state.worker.middleName = payload.middleName;
      state.worker.birthDate = payload.birthDate;
    },
    cleanWorker: (state: IWorkerState) => {
      state.worker.uuid = '';
      state.worker.firstName = '';
      state.worker.lastName = '';
      state.worker.middleName = '';
      state.worker.birthDate = '' as unknown as Date;
    },
  },
});

export const selectWorker = (state: RootState) => state.worker.worker;
export const useWorker = () => useAppSelector(selectWorker);

export const {
  reducer: workerReducer,
  actions: {setWorker, cleanWorker},
} = authSlice;
