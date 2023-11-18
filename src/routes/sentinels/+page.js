
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';
import { sgxsentinel } from '../../lib/sgxsentinel.js';

let usertoken
token.subscribe((value)=> usertoken=value)

export async function load({params,url}) {
    return sgxsentinel.getSentinels(dev, utils.getBackendUrl(url)+'/api/sentinel', 10, 0, usertoken);
}