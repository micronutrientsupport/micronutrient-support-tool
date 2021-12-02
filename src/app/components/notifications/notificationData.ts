import { NotificationType } from './notificationType.enum';

export interface NotificationData {
  type: NotificationType;
  message: string;
  description?: string;
  duration: number;
}
