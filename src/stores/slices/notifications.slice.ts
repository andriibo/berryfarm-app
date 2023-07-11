import {createEntityAdapter, createSlice, nanoid, PayloadAction, SerializedError} from '@reduxjs/toolkit';
import {FetchBaseQueryError} from '@reduxjs/toolkit/dist/query';
import {ValueOf} from 'react-native-gesture-handler/lib/typescript/typeUtils';
import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from '../store';

export const NotificationDict = {
  Warning: 'warning',
  Error: 'error',
  Success: 'success',
  Info: 'info',
} as const;

export type NotificationType = ValueOf<typeof NotificationDict>;
export type AddNotificationPayload = Omit<INotification, 'id'>;
export interface INotification {
  id: string;
  type: NotificationType;
  message: string;
}

type ResponseError = {error: {message: string}};
export type ErrorNotification = string | ResponseError | FetchBaseQueryError | SerializedError;
export type ErrorNotificationPayload = PayloadAction<ErrorNotification>;
const isResponseError = (payload: any): payload is FetchBaseQueryError =>
  (payload as FetchBaseQueryError).data !== undefined;

export const notificationsAdapter = createEntityAdapter<INotification>();
const initialState = notificationsAdapter.getInitialState();
const notificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    addNotification: (state, {payload}: PayloadAction<AddNotificationPayload>) => {
      notificationsAdapter.addOne(state, {id: `${nanoid()}`, ...payload});
    },
    addErrorNotification: (state, {payload}: ErrorNotificationPayload) => {
      // @ts-ignore
      if (payload?.status !== 'FETCH_ERROR') {
        const message =
          typeof payload === 'string'
            ? payload
            : isResponseError(payload)
            ? (payload.data as {error: {message: string}})?.error?.message
            : JSON.stringify(payload);

        notificationsAdapter.addOne(state, {
          id: `${nanoid()}`,
          type: 'error',
          message,
        });
      }
    },
    addInfoNotification: (state, {payload}: PayloadAction<string>) => {
      notificationsAdapter.addOne(state, {id: `${nanoid()}`, type: 'info', message: payload});
    },
    addSuccessNotification: (state, {payload}: PayloadAction<string>) => {
      notificationsAdapter.addOne(state, {id: `${nanoid()}`, type: 'success', message: payload});
    },
    addWarningNotification: (state, {payload}: PayloadAction<string>) => {
      notificationsAdapter.addOne(state, {id: `${nanoid()}`, type: 'warning', message: payload});
    },
    removeNotification: notificationsAdapter.removeOne,
  },
});

export const {
  reducer: notificationsReducer,
  actions: {
    addNotification,
    removeNotification,
    addErrorNotification,
    addInfoNotification,
    addSuccessNotification,
    addWarningNotification,
  },
} = notificationSlice;

export {initialState as initialNotificationState};
const {selectAll: selectNotificationsAll, selectTotal: selectNotificationsTotal} = notificationsAdapter.getSelectors(
  (state: RootState) => state.notifications,
);

export const useNotificationsAll = () => useAppSelector(selectNotificationsAll);
export const useNotificationsTotal = () => useAppSelector(selectNotificationsTotal);
