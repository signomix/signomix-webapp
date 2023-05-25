import { writable } from 'svelte/store';

export const userSession = writable(
    {
        logged: false,
        login: '',
        password: '',
        language: 'en',
        authorized: false,
        token: ''
    }
);
export const baseUrl = writable({ url: '' })