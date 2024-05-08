import { browser, dev, } from '$app/environment';
import { utils } from '$lib/utils.js';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

let usertoken
token.subscribe((value)=> usertoken=value)

export const load = async ({ params, url }) => {

  const getSelectedConfig = async (serviceUrl) => {
    let config = null
    if (dev) {
      if (browser) {
        config = JSON.parse(window.localStorage.getItem(params.slug))
      }
    } else {
      try {
        let endpoint = serviceUrl + "/api/core/v2/dashboards/" + params.slug
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
      }

    }
    return config
  }

  async function transform() {
    let cfg = await getSelectedConfig(utils.getBackendUrl(url))
    if (!dev) {
      for (let i = 0; i < cfg.items.length; i++) {
        let item = cfg.items[i]
        if (item['1'] !== null) {
          item['1'] = item['_el1']
          delete item['_el1']
        }/* else if(item['1']==undefined && item['_el1']!=undefined){
          item['1'] = item['_el1']
          delete item['_el1']
        } */
        if (item['10'] !== null) {
          item['10'] = item['_el10']
          delete item['_el10']
        }/* else if(item['10']==undefined && item['_el10']!=undefined){
          item['10'] = item['_el10']
          delete item['_el10']
        } */
        cfg.items[i] = item
      }
    }
    //console.log('cfg after transform:',cfg)
    return cfg
  }

  return await transform()
}