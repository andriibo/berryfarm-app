import {Location} from 'src/stores/types/location.type';

export enum ZoneStatus {
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted',
}

export type Zone = {
  id: number;
  title: string;
  locations: Array<Location>;
  status: ZoneStatus;
};
