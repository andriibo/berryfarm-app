import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {Worker, WorkerStatus} from 'src/stores/types/worker.type';
import {firebase} from '@react-native-firebase/firestore';

export type IWorker = Omit<Worker, 'createdTimestamp' | 'syncTimestamp'>;

type IWorkerState = {
  worker: IWorker;
};

const initialState: IWorkerState = {
  worker: {
    uuid: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: firebase.firestore.Timestamp.now(),
    status: WorkerStatus.inactive,
  },
};

const workerSlice = createSlice({
  name: 'Worker',
  initialState,
  reducers: {
    setWorker: (state: IWorkerState, {payload}: PayloadAction<IWorker>) => {
      state.worker.uuid = payload.uuid;
      state.worker.firstName = payload.firstName;
      state.worker.lastName = payload.lastName;
      state.worker.middleName = payload.middleName;
      state.worker.birthDate = payload.birthDate;
      state.worker.status = payload.status;
    },
    cleanWorker: (state: IWorkerState) => {
      state.worker.uuid = '';
      state.worker.firstName = '';
      state.worker.lastName = '';
      state.worker.middleName = '';
      state.worker.birthDate = firebase.firestore.Timestamp.now();
      state.worker.status = WorkerStatus.inactive;
    },
  },
});

export const selectWorker = (state: RootState) => state.worker.worker;
export const useWorker = () => useAppSelector(selectWorker);

export const {
  reducer: workerReducer,
  actions: {setWorker, cleanWorker},
} = workerSlice;
