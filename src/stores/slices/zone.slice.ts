import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {Location} from 'src/stores/types/location.type';
import {ZoneStatus} from 'src/stores/types/zone.type';

export type IZone = {
  id: number;
  title: string;
  locations: Array<Location>;
  status: ZoneStatus;
};

type IZoneState = {
  zone: IZone;
};

const initialState: IZoneState = {
  zone: {
    id: 0,
    title: '',
    locations: [],
    status: ZoneStatus.deleted,
  },
};

const zoneSlice = createSlice({
  name: 'Zone',
  initialState,
  reducers: {
    setZone: (state: IZoneState, {payload}: PayloadAction<IZone>) => {
      state.zone.id = payload.id;
      state.zone.title = payload.title;
      state.zone.locations = payload.locations;
      state.zone.status = payload.status;
    },
    cleanZone: (state: IZoneState) => {
      state.zone.id = 0;
      state.zone.title = '';
      state.zone.locations = [];
      state.zone.status = ZoneStatus.deleted;
    },
  },
});

export const selectZone = (state: RootState) => state.zone.zone;
export const useZone = () => useAppSelector(selectZone);

export const {
  reducer: zoneReducer,
  actions: {setZone, cleanZone},
} = zoneSlice;
