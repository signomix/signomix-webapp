// @ts-nocheck
import { browser, building, dev, version } from '$app/environment';
import { error } from '@sveltejs/kit';
import { userSession } from '$lib/stores.js';
import { utils } from '$lib/utils.js';
import { transform } from 'svelte-preprocess/dist/autoProcess.js';

export const load = async ({ params, url }) => {

  let session;
  userSession.subscribe(value => {
    session = value;
  });

  const getSelectedConfig = async (serviceUrl) => {
    let config = null
    if (dev) {
      if (browser) {
        console.log(window.localStorage.getItem(params.slug))
        config = JSON.parse(window.localStorage.getItem(params.slug))
      }
    } else {
      try {
        let endpoint = serviceUrl + "/api/core/v2/dashboards/" + params.slug
        let headers = new Headers();
        headers.set('Authentication', session.token);
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
    return config
  }

  async function transform() {
    let cfg = await getSelectedConfig(utils.getBackendUrl(url))
    if (!dev) {
      console.log("TRANSFORM " + JSON.stringify(cfg))
      for (let i = 0; i < cfg.items.length; i++) {
        console.log(cfg.items[i])
        let item = cfg.items[i]
        if (item['1'] !== null) {
          item['1'] = item['_el1']
          delete item['_el1']
        }
        if (item['10'] !== null) {
          item['10'] = item['_el10']
          delete item['_el10']
        }
      }
    }
    console.log(cfg)
    return cfg
  }

  //return await getSelectedConfig(utils.getBackendUrl(url))
  return await transform()
}