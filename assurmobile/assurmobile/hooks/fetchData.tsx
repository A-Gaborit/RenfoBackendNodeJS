import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type Headers = {
    Accept: string,
    'Content-type': string,
    Authorization?: string
}

export async function fetchData(path: string, method: string, body?: object, useToken?: boolean) {
    const token = await AsyncStorage.getItem('token');
    const endpoint = process.env.EXPO_PUBLIC_API_URL;
    const headers: Headers = {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    };
    if(token !== undefined && useToken) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    return fetch(endpoint + path, {
      headers,
      method,
      ...(body && method !== 'GET'
            ? { body: JSON.stringify(body) }
            : {})
    })
      .then(async response => {
        // if (response.status === 401 || response.status === 403) {
        //     console.log('Error, access denied !')
        //     router.push({ pathname: '/login'});
        //     return;
        // }
        if (!response.ok) {
            const { message } = await response.json();
            throw new Error(message)
        }
        return response.json();
      })
      .catch(error => {
        console.log(error.message)
        throw Error(error.message)
      })
}

export async function fetchDocument(path: string, method: string, body?: any, useToken?: boolean) {
    const token = await AsyncStorage.getItem('token');
    const endpoint = process.env.EXPO_PUBLIC_API_URL;
    const headers: any = {
        'Accept': 'application/json'
    };
    if(token !== undefined && useToken) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    return fetch(endpoint + path, {
      headers,
      method,
      ...(body ? { body } : {})
    })
      .then(async response => {
        if (!response.ok) {
            console.log('Error, in route !')
            const { message } = await response.json()
            throw Error('Erreur : ' + message)
        }
        return response.json();
      })
      .catch(error => {
        throw Error(error.message)
      })
}

export async function fetchBlob(path: string, useToken?: boolean) {
    const token = await AsyncStorage.getItem('token');
    const endpoint = process.env.EXPO_PUBLIC_API_URL;
    const headers: any = {};
    
    if (token && useToken) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(endpoint + path, { headers, method: 'GET' });
    
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error('Erreur : ' + message);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const blob = await response.blob();
    
    return new Blob([blob], { type: contentType });
}