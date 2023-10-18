// @ts-nocheck
import { browser, dev } from '$app/environment';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';

export const load = async ({ params, url }) => {

let usertoken
token.subscribe((value) => usertoken = value) 
let userProfile
profile.subscribe((value) => userProfile = value)


  const getSelectedConfig = async (serviceUrl) => {
    let config = null
    if (params.slug == 'new' || (dev && browser)) {
      config = newGroup
    } else {
      try {
        let endpoint = serviceUrl + "/api/core/group/" + params.slug + "?full=true"
        let headers = new Headers();
        headers.set('Authentication', usertoken);
        await fetch(endpoint, { headers: headers }).then(response => {
          if (response.status == 200) {
            config = response.json()
          } else if (response.status == 401 || response.status == 403) {
            token.set(null)
          } else {
            alert(
              utils.getMessage(utils.FETCH_STATUS)
                .replace('%1', response.status)
                .replace('%2', response.statusText)
            )
          }
        })
      } catch (error) {
        console.log('ERROR')
        console.log(error)
      }
    }
    return config
  }

  const newGroup = {
  "EUI":"new",
  "name":"",
  "userID":"",
  "team":"",
  "administrators":"",
  "channels":{
    "pm2_5":{
      "name":"pm2_5",
      "type":null
    },
    "pm10":{
      "name":"pm10",
      "type":null
    },
    "pressure":{
      "name":"pressure",
      "type":null
    },
    "temperature":{
      "name":"temperature",
      "type":null
    },
    "humidity":{
      "name":"humidity",
      "type":null
    },
    "latitude":{
      "name":"latitude",
      "type":null
    },
    "longitude":{
      "name":"longitude",
      "type":null
    },
    "pm2_5avg":{
      "name":"pm2_5avg",
      "type":null
    },
    "pm10avg":{
      "name":"pm10avg",
      "type":null
    }
  },
  "description":"",
  "open":true,
  "organization":0
  }

  return await getSelectedConfig(utils.getBackendUrl(url))
}