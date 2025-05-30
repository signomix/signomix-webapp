import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';


let usertoken
token.subscribe((value)=> usertoken=value)
let userprofile
profile.subscribe((value)=>userprofile=value)
let userAuthenticated
isAuthenticated.subscribe((value)=>userAuthenticated=value)

export async function load({params, url}) {
    if(!userAuthenticated){
        return {}
    }
    let apiUrl = utils.getBackendUrl(url) + '/api/account/user/'+params.slug
    console.log('apiUrl', apiUrl)
    return await sgxdata.getUserSettings(dev, apiUrl, userprofile, usertoken)
}