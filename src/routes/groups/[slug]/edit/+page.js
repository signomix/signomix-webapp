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
        let endpoint = serviceUrl + "/api/core/group/" + params.slug
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
  "eui":"new",
  "name":"",
  "userID":"",
  "team":"",
  "administrators":"",
  "channels":{},
  "description":"",
  "open":true,
  "new":true
  }

  return await getSelectedConfig(utils.getBackendUrl(url))
}