import { token, profile, language, isAuthenticated, context, contextRoot } from '$lib/usersession.js';
import { dev } from '$app/environment';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';

let usertoken
token.subscribe((value) => usertoken = value)
let userprofile
profile.subscribe((value) => userprofile = value)
let userAuthenticated
isAuthenticated.subscribe((value) => userAuthenticated = value)


export async function load({ params, url }) {

    if (!userAuthenticated) {
        return {}
    }

    const getSelectedConfig = async (serviceUrl) => {
        console.log('getSelectedConfig of tenant ['+params.slug+']')
        if (params.slug == 'new' || (dev && browser)) {
            return newUser
        } else {
            let apiUrl = serviceUrl + '/api/tenant/' + params.slug
            return await sgxdata.getTenant(dev, apiUrl, userprofile, usertoken)
        }
    }

    const newUser = {
        name: "",
        root: ""
    }

    return await getSelectedConfig(utils.getBackendUrl(url))
}