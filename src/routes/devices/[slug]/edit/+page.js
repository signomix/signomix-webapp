// @ts-nocheck
import { browser, building, dev, version } from '$app/environment';
import { error } from '@sveltejs/kit';
import { userSession } from '$lib/stores.js';
import { utils } from '$lib/utils.js';

export const load = async ({ params, url }) => {
  let session;
  userSession.subscribe(value => {
    session = value;
  });

  const newDevice = {
    template: null,
    name: "",
    applicationEUI: null,
    applicationID: null,
    key: "",
    userID: session.user.login,
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
    organizationId: 0,
    writable: true,
    virtual: false,
    eui: "new",
    channelsAsString: "",
    codeUnescaped: "",
    encoderUnescaped: "",
    configurationMap: {}
  }
  const getSelectedConfig = async (serviceUrl) => {
    let config = null
    if (params.slug == 'new') {
      config = newDevice
    } else {
      if (dev) {
        if (browser) {
          config = newDevice
        }
      } else {
        try {
          let endpoint = serviceUrl + "/api/core/device/" + params.slug
          let headers = new Headers();
          headers.set('Authentication', session.user.token);
          await fetch(endpoint, { headers: headers }).then(response => {
            if (response.status == 200) {
              config = response.json()
            } else if (response.status == 401 || response.status == 403) {
              utils.setAuthorized(session, false)
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
    }
    return config
  }

  return await getSelectedConfig(utils.getBackendUrl(url))
}