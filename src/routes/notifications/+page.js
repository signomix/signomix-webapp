
import { token } from '$lib/usersession.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';

let usertoken
token.subscribe((value)=> usertoken=value)

export async function load({params,url}) {
    return {
        notifications: await getUserNotifications(utils.getBackendUrl(url))
    };
}

async function getUserNotifications(serviceUrl) {
    if(dev){
        return nots;
    }
    const response = await fetch(serviceUrl+'/api/alert', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': usertoken
        }
    });
    if (response.status == 200) {
        return response.json();
    } else {
        return null;
    }
}

let nots=[]