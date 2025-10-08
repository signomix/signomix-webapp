import { browser, dev, } from '$app/environment';
import { utils } from '$lib/utils.js';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';

let usertoken
token.subscribe((value) => usertoken = value)

export const load = async ({ params, url }) => {

  try{
  if (!params.slug.startsWith('~~')) {
    return null
  }
  const euiList = url.searchParams.get('euis')

  const fetchToken = async () => {
    //let endpoint = utils.getBackendUrl(url) + "/api/auth/token/" + params.slug;
    let endpoint = "http://signomix-auth:8080/api/auth/token/" + params.slug;
    console.log('Fetching token from:', endpoint);
    const response = await fetch(endpoint).then((res) => {
      if (!res.ok) {
        throw new Error('Response not ok');
      }
      console.log('Response status:', res.status);
      return res.json();
    }).then((token) => {
      console.log('Fetched token data:', token);
      return getSelectedConfig(token);
    })
      .catch((error) => {
        console.error('Error fetching token:', error);
        return null;
      })
  }

  const getSelectedConfig = async (token) => {
    let tokenObject = await token
    console.log('Fetched token2:', tokenObject)
    let endpoint = "http://signomix-ta-core:8080/api/core/v2/dashboards/" + tokenObject.payload
    console.log('Fetching config from', endpoint)
    let headers = new Headers();
    headers.set('Authentication', tokenObject.token);
    fetch(endpoint, { headers: headers }).then(response => {
      if (response.status == 200) {
        return response.json().then(data => {
          data.euiList = euiList
          console.log('Fetched config:', data)
          return transform(data)
        })
      } else if (response.status == 401 || response.status == 403) {
        token.set(null)
        return null
      } else {
        alert(
          utils.getMessage(utils.FETCH_STATUS)
            .replace('%1', response.status)
            .replace('%2', response.statusText)
        )
        return null
      }
    }).catch((error) => {
      console.error('Error fetching config:', error);
      return null;
    });
    return {}
  }

  function transform(cfg) {
    console.log('cfg before transform:', cfg)
    if (cfg == null) {
      return null
    }
    if (!dev) {
      for (let i = 0; i < cfg.items.length; i++) {
        let item = cfg.items[i]
        if (item['1'] !== null) {
          item['1'] = item['_el1']
          delete item['_el1']
        }
        if (item['10'] !== null) {
          item['10'] = item['_el10']
          delete item['_el10']
          cfg.items[i] = item
        }
      }

      return cfg
    }
  }


  return fetchToken();

}catch(err){
  console.error('Error in load function:', err);
  return null;  
}
}