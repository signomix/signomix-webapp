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
        console.log('getSelectedConfig of user ['+params.slug+']')
        if (params.slug == 'new' || (dev && browser)) {
            if(context!=null){
                newUser.pathRoot=contextRoot
            }else if(!utils.isDefaultOrganization(profile)){
                newUser.pathRoot=profile.pathRoot
            }
            return newUser
        } else {
            let apiUrl = serviceUrl + '/api/user/' + params.slug
            return await sgxdata.getUserSettings(dev, apiUrl, userprofile, usertoken)
        }
    }

    const newUser = {
        type: 0,
        uid: "new",
        email: "",
        name: "",
        surname: "",
        role: "",
        confirmed: true,
        unregisterRequested: false,
        confirmString: "",
        generalNotificationChannel: "",
        infoNotificationChannel: "",
        warningNotificationChannel: "",
        alertNotificationChannel: "",
        authStatus: 1,
        services: 0,
        phonePrefix: "",
        credits: 0,
        autologin: false,
        preferredLanguage: "pl",
        organization: userprofile.organization,
        newConfig: true
    }

    return await getSelectedConfig(utils.getBackendUrl(url))
}