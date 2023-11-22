import { browser, dev } from '$app/environment';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';
import sgxsentinel from '$lib/sgxsentinel.js';


let usertoken
token.subscribe((value) => usertoken = value )
let userProfile
profile.subscribe((value) => userProfile = value)


export async function load({ params, url }) {
    if (params.slug == 'new' || (dev && browser)) {
        return {sentinel:newConfig}
      }
    let apiUrl = utils.getBackendUrl(url) + '/api/sentinel/'+params.slug
    return await sgxsentinel.getSentinel(dev, apiUrl, usertoken)
}

const newConfig = {
    "name": "",
    "active": true,
    "conditionOk": false,
    "conditionOkMessage": "",
    "everyTime": true,
    "target": {
        "eui": "",
        "group": "",
        "tag": {
            "name": "",
            "value": ""
        }
    },
    "conditions": [
        {
            "measurement": "",
            "condition1": -1,
            "value1": null,
            "orOperator": false,
            "condition2": -1,
            "value2": null
        }
    ],
    "result": {
        "alertType": 1,
        "message": "",
        "everytime": true,
    }
}
