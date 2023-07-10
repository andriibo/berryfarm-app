import dayjs from 'dayjs';

export const showByFormat = (timeStamp: Date | string | number, format: string) => dayjs(timeStamp).format(format);
