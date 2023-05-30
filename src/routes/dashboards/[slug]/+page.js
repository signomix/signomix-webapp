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

  const getSelectedConfig = async (serviceUrl) => {
    if (dev || 'new' == params.slug) {
      return {
        id: params.slug,
        name: 'My Dasboard ',
        description: 'Dasboard description ',
        widgets: [
          { id: 0, title: 'widget 0', description: 'sample widget', width: 1, height: 1 },
          { id: 1, title: 'widget 1',description: 'sample widget', width: 2, height: 1 },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
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
                .replace('%2', response.statusText)
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