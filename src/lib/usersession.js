import {writable, derived} from 'svelte/store';

export const profile = writable(null);
export const token = writable(null);
export const language = writable('pl');
export const isAuthenticated = derived([profile, token], (a) => {
    return a && a[0] && a[1];
});