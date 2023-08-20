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
    if(!session.user.logged || !session.user.authorized || session.user.login==''){
        return {}
    }
    let apiUrl = utils.getBackendUrl(url) + '/api/core/user/'+session.user.login
    console.log('load({url})', url)
    return await sgxdata.getUserSettings(dev, apiUrl, session.user)
}