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
        let endpoint = serviceUrl + "/api/core/v2/dashboards/" + params.slug
        let headers = new Headers();
        headers.set('Authentication', session.token);
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