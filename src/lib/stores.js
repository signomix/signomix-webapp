import { writable } from 'svelte/store';
import { utils } from './utils.js';

export const defaultOrganizationId = writable(null);
export const platformInfo = writable(null);

export const getInfo=async (url)=>{
    let infoUrl = utils.getBackendUrl(url) + '/api/core/info'
    //console.log('getInfo', infoUrl)
    fetch(infoUrl)
        .then(response => response.json())
        .then(data => {
            console.log('layout data', data)
            platformInfo.set(data)
            defaultOrganizationId.set(data.defaultOrganizationId)
            return {}
        });
}
