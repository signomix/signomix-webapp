import { userSession } from '$lib/stores.js';
import { dev } from '$app/environment';

let session;
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

export async function load() {
    return {
        settings: await getUserSettings()
    };
}

async function getUserSettings() {
    if(dev){
        return devUser;
    }
    const response = await fetch('https://api.signomix.com/user/settings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': 'Bearer ' + session.token
        }
    });
    if (response.status == 200) {
        return response.json();
    } else {
        return null;
    }
}


let devUser =
{
  "type":8,
  "uid":"tester",
  "email":"test@localhost",
  "name":"Test name",
  "surname":"Test surname",
  "role":"",
  "confirmed":true,
  "unregisterRequested":false,
  "confirmString":"1234567890",
  "generalNotificationChannel":"SIGNOMIX:",
  "infoNotificationChannel":"SMTP:test@localhost;support@localhost",
  "warningNotificationChannel":"SIGNOMIX:",
  "alertNotificationChannel":"WEBHOOK:http://localhost:9999/webhooks/alerts",
  "createdAt":1551182548848,
  "number":0,
  "services":1,
  "phonePrefix":"+48",
  "credits":100,
  "autologin":true,
  "preferredLanguage":"pl",
  "organization":0,
  "sessionToken":null
}