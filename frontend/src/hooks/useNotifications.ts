import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { 
  addNotification, 
  clearNotifications, 
  markAllAsRead, 
  markAsRead, 
  removeNotification, 
  setNotifications 
} from '../store/slices/notificationSlice';
import { Notification } from '../types';
import { 
  useGetNotificationsQuery, 
  useMarkAllNotificationsAsReadMutation, 
  useMarkNotificationAsReadMutation 
} from '../store/services/apiSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notification);
  
  // RTK Query hooks
  const { data: apiNotifications, isLoading } = useGetNotificationsQuery();
  const [markAsReadApi] = useMarkNotificationAsReadMutation();
  const [markAllAsReadApi] = useMarkAllNotificationsAsReadMutation();
  
  // Update notifications in store when data changes
  if (apiNotifications && !isLoading) {
    dispatch(setNotifications(apiNotifications));
  }
  
  // Actions
  const handleAddNotification = useCallback((notification: Notification) => {
    dispatch(addNotification(notification));
  }, [dispatch]);
  
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    dispatch(markAsRead(notificationId));
    
    try {
      await markAsReadApi(notificationId).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read on server:', error);
      return false;
    }
  }, [dispatch, markAsReadApi]);
  
  const handleMarkAllAsRead = useCallback(async () => {
    dispatch(markAllAsRead());
    
    try {
      await markAllAsReadApi().unwrap();
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read on server:', error);
      return false;
    }
  }, [dispatch, markAllAsReadApi]);
  
  const handleRemoveNotification = useCallback((notificationId: string) => {
    dispatch(removeNotification(notificationId));
  }, [dispatch]);
  
  const handleClearNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification: handleAddNotification,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    removeNotification: handleRemoveNotification,
    clearNotifications: handleClearNotifications,
  };
};

