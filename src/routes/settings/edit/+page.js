import { userSession } from '$lib/stores.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';
import { goto } from '$app/navigation';

let session;
userSession.subscribe(value => {
    session = value;
});


export async function load({url}) {
    if(!session.logged || !session.authorized || session.login==''){
        return {}
    }
    let apiUrl = utils.getBackendUrl(url) + '/api/user/'
    console.log('load({url})', url)
    return await sgxdata.getUserSettings(dev, apiUrl, session.token)
}



let settings =
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