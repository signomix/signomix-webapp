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
      config = newDevice
    } else {
      try {
        let endpoint = serviceUrl + "/api/core/device/" + params.slug + "?full=true"
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

  const newDevice = {
    template: null,
    name: "",
    applicationEUI: null,
    applicationID: null,
    key: "",
    userID: userProfile.uid,
    type: "GENERIC",
    team: ",",
    channels: {
    },
    code: "",
    encoder: "",
    description: "                  ",
    lastSeen: 1693516148,
    transmissionInterval: 0,
    lastFrame: -1,
    checkFrames: false,
    pattern: null,
    downlink: null,
    commandScript: null,
    groups: ",",
    alertStatus: 0,
    deviceID: "",
    active: true,
    project: "",
    latitude: 0.0,
    longitude: 0.0,
    altitude: 0.0,
    state: 0.0,
    retentionTime: 0,
    administrators: ",",
    configuration: "",
    orgApplicationId: 0,
    applicationConfig: null,
    organizationId: userProfile.organization,
    writable: true,
    virtual: false,
    eui: "new",
    channelsAsString: "",
    codeUnescaped: "",
    encoderUnescaped: "",
    configurationMap: {}
  }

  return await getSelectedConfig(utils.getBackendUrl(url))
}