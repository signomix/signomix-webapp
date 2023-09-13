import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';
import { goto } from '$app/navigation';

let usertoken
token.subscribe((value)=> usertoken=value)
let userauthenticated
isAuthenticated.subscribe((value)=> userauthenticated=value)
let userprofile
profile.subscribe((value)=> userprofile=value)

export async function load({url}) {
    if(!userauthenticated){
        return {}
    }
    let apiUrl = utils.getBackendUrl(url) + '/api/core/organization/'+userprofile.organization
    console.log('load({url})', url)
    return await sgxdata.getOrganization(dev, apiUrl, usertoken)
}