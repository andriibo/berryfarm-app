import {Dispatch} from '@reduxjs/toolkit';
import {setIsBleScanning} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';

export const stopScanBle = (dispatch: Dispatch) => {
  bleManager.stopDeviceScan();
  dispatch(setIsBleScanning(false));
};
