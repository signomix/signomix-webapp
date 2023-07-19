
import { userSession } from '$lib/stores.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';

let session;


export async function load({params,url}) {
    userSession.subscribe(value => {
        session = value;
        if(!session.logged){
            try{
            if(window.localStorage.getItem('sgx.session.token')!=null){
                session.token = window.localStorage.getItem('sgx.session.token')
                session.logged = true
                session.authorized = true
            }
            }catch(error){
                console.log(error)
            }
        }
    });
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
            'Authentication': session.token
        }
    });
    if (response.status == 200) {
        return response.json();
    } else {
        return null;
    }
}

let nots=[]