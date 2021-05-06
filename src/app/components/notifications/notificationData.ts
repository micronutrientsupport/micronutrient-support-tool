import { NotificationType } from './notificationType.enum';

export interface NotificationData {
  type: NotificationType;
  message: string;
  boldMessage?: string;
  duration: number;
  beingDispatched: boolean;
}
