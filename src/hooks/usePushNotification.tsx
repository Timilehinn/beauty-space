import React, { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '../app/firebase';

export default function usePushNotification() {
  const [webToken, setWebToken] = useState('');
  const messaging = getMessaging(app);

  useEffect(() => {

    const getPushNotificationToken = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: 'BLt_8UxyxKJBrzp-v3lFSC3BvcPg8UNQpk3EVBXcy_gB-RhKVCxOJK78EOZNe6U1UX1wAUr9SQn2ycHUpxtr7Nc',
        });
        if (token) {
          console.log('FCM Token:', token);
          setWebToken(token);
        } else {
          console.log('No registration token available.');
        }
      } catch (error) {
        console.error('Error getting FCM token:', error.message);
      }
    };

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        getPushNotificationToken();
      } else {
        console.error('Notification permission denied.');
      }
    };

    requestPermission();
  }, []);

  return { webToken };
}
