import { dev } from '$app/environment';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';

export const load = async ({ params, url }) => {

  let usertoken
  token.subscribe((value) => usertoken = value)

  const getSelectedConfig = async (serviceUrl) => {
    let config = null
    if (dev) {
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
    name: "device01",
    applicationEUI: null,
    applicationID: null,
    key: "LTcwNjYwMTcwMDAwNjM3MjU2NTE",
    userID: "tester1",
    type: "GENERIC",
    team: ",",
    channels: {
      temperature: {
        name: "temperature",
        type: null
      },
      humidity: {
        name: "humidity",
        type: null
      }
    },
    code: "",
    encoder: "",
    description: "                  ",
    lastSeen: 1693516148000,
    transmissionInterval: 0,
    lastFrame: -1,
    checkFrames: true,
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
    eui: "S-16-EA-1C-23-21",
    channelsAsString: "temperature,humidity",
    codeUnescaped: "",
    encoderUnescaped: "",
    configurationMap: {}
  }

  return await getSelectedConfig(utils.getBackendUrl(url))
}