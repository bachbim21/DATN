import { Moment } from 'moment';
import { NotificationType } from './notificationConfig.type';

export interface Notification<T> {
  id: string;
  notificationType: NotificationType;
  content?: string; //json
  createdAt?: Moment;
  equipmentId?: number;
  event?: T; // Replace 'any' with the specific type of 'event' if known
}

export interface EquipmentHistoryDto {
  id: string;
  content?: string; //json
  createdAt?: Moment;
}

export interface GetNotificationsQueryParams {
  isDeleted?: boolean;
  equipmentId?: Number;
  notificationType?: NotificationType;
}