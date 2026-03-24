export type Notification = {
  id: number;
  type: 'profile_update' | 'profile_delete' | 'profile_create' | 'order' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  changedFields?: string[];
};
