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

export async function load({url}) {
    if(!userAuthenticated){
        return {}
    }
    //let apiUrl = utils.getBackendUrl(url) + '/api/core/user/'+userprofile.uid
    //console.log('load({url})', url)
    let apiUrl=''
    return await sgxdata.getAlertConfig(dev, apiUrl, userprofile, usertoken)
}