import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {QrCode} from 'src/stores/types/qrCode.type';

export type IQrCode = Pick<QrCode, 'id' | 'uuid' | 'workerUuid' | 'qrCodeUuid' | 'connectedTimestamp'>;

type IQrCodeState = {
  qrCode: IQrCode;
};

const initialState: IQrCodeState = {
  qrCode: {
    id: 0,
    uuid: '',
  },
};

const qrCodeSlice = createSlice({
  name: 'QrCode',
  initialState,
  reducers: {
    setQrCode: (state: IQrCodeState, {payload}: PayloadAction<IQrCode>) => {
      state.qrCode.id = payload.id;
      state.qrCode.uuid = payload.uuid;
      state.qrCode.workerUuid = payload.workerUuid;
      state.qrCode.qrCodeUuid = payload.qrCodeUuid;
      state.qrCode.connectedTimestamp = payload.connectedTimestamp;
    },
    cleanQrCode: (state: IQrCodeState) => {
      state.qrCode.id = 0;
      state.qrCode.uuid = '';
      state.qrCode.workerUuid = undefined;
      state.qrCode.qrCodeUuid = undefined;
      state.qrCode.connectedTimestamp = undefined;
    },
  },
});

export const selectQrCode = (state: RootState) => state.qrCode.qrCode;
export const useQrCode = () => useAppSelector(selectQrCode);

export const {
  reducer: qrCodeReducer,
  actions: {setQrCode, cleanQrCode},
} = qrCodeSlice;
