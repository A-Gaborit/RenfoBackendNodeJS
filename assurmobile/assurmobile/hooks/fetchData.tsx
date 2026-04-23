import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type Headers = {
    Accept: string;
    'Content-Type': string;
    Authorization?: string;
};

export async function fetchData(path: string, method: string, body?: Object, useToken?: boolean) {
  const token = await AsyncStorage.getItem('token');
  const endpoint = process.env.EXPO_PUBLIC_API_URL;
  const headers: Headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  if(token !== undefined) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${endpoint}${path}`, {
    headers,
    method,
    ...(body  && method !== 'GET' 
        ? { body: JSON.stringify(body) } 
        : {})
  })
  .then(async response => {
    // if (response.status === 401 || response.status === 403) {
    //   console.log('Error, access denied');
    //   router.push('/login');
    //   return;
    // }
    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }
    return response.json();
  })
  .catch(error => {
    throw error;
  });
};