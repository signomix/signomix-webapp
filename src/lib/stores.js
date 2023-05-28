import { writable } from 'svelte/store';

export const userSession = writable(
    {
        logged: false,
        login: '',
        password: '',
        language: 'en',
        authorized: false,
        token: '',
        organization: 0,
        type: 0
    }
);
export const baseUrl = writable({ url: '' })