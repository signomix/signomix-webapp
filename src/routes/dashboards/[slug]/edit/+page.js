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

  const widgetObject = {
    name: "",
    dev_id: "",
    channel: "",
    channelTranslated: "",
    unitName: "",
    rounding: 2,
    type: "",
    query: "last 1",
    range: "",
    title: "",
    icon: "",
    description: "",
    format: "",
    chartOption: "",
    group: "",
    config: "",
    cubicInterpolation: false,
    imageUrl: "",
    app_id: "",
    role: ""
  }

  const newDashboard = {
    id: params.slug,
    userID: session.login,
    title: 'My Dasboard',
    team: '',
    administrators: '',
    shared: false,  // true if shared with other users
    items: [],
    widgets: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const getSelectedConfig = async (serviceUrl) => {
    if ('new' == params.slug) {
      //console.log(new Date().toLocaleString())
      return {
        id: params.slug,
        userID: session.login,
        title: 'My Dasboard ',
        team: '',
        administrators: '',
        shared: true,  // true if shared with other users
        items: [],
        widgets: [],
        /* items:  [
          {
              "1": {
                  "fixed": false,
                  "resizable": true,
                  "draggable": true,
                  "customDragger": false,
                  "customResizer": false,
                  "min": {
                      "w": 1,
                      "h": 1
                  },
                  "max": {},
                  "w": 2,
                  "h": 2,
                  "x": 0,
                  "y": 0
              },
              "10": {
                  "fixed": false,
                  "resizable": true,
                  "draggable": true,
                  "customDragger": false,
                  "customResizer": false,
                  "min": {
                      "w": 1,
                      "h": 1
                  },
                  "max": {},
                  "w": 1,
                  "h": 1,
                  "x": 2,
                  "y": 0,
                  "id": "_rovr8yqsx"
              },
              "id": "_rovr8yqsx"
          },
          {
              "1": {
                  "fixed": false,
                  "resizable": true,
                  "draggable": true,
                  "customDragger": false,
                  "customResizer": false,
                  "min": {
                      "w": 1,
                      "h": 1
                  },
                  "max": {},
                  "w": 2,
                  "h": 2,
                  "x": 0,
                  "y": 0
              },
              "10": {
                  "fixed": false,
                  "resizable": true,
                  "draggable": true,
                  "customDragger": false,
                  "customResizer": false,
                  "min": {
                      "w": 1,
                      "h": 1
                  },
                  "max": {},
                  "w": 2,
                  "h": 2,
                  "x": 0,
                  "y": 0
              },
              "id": "_di4cofrgw"
          }
      ],
        widgets: [
          { id: 0, title: 'sample widget 0', type: 'line_chart' },
          { id: 1, title: 'sample widget 1', type: 'line' },
        ], */
        createdAt: new Date(),
        updatedAt: new Date()
      }
    } else if (dev) {
      let config = newDashboard
      if (browser) {
        console.log(window.localStorage.getItem(params.slug))
        config = JSON.parse(window.localStorage.getItem(params.slug))
        if (config == null) {
          return newDashboard
        }
      }
      return config
    } else {
      let config = null
      try {
        let endpoint = serviceUrl + "/api/dashboards/" + params.slug
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(session.login + ":" + session.password));
        await fetch(endpoint, { headers: headers }).then(response => {
          if (response.status == 200) {
            config = response.json();
          } else if (response.status == 401 || response.status == 403) {
            utils.setAuthorized(session, false)
          } else {
            alert(
              utils.getMessage(utils.FETCH_STATUS)
                .replace('%1', response.status)
                .replace('%2', response.configstatusText)
            )
          }
        })
      } catch (error) {
        console.log('ERROR')
        console.log(error)
      }
      return config
    }
  }

  return await getSelectedConfig(utils.getBackendUrl(url))
}