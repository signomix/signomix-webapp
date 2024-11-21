import { dev } from '$app/environment';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';

export const load = async ({ params, url }) => {

  let usertoken
  token.subscribe((value) => usertoken = value)
  let userlanguage
  language.subscribe((value) => userlanguage = value)

  const getSelectedPost = async (serviceUrl) => {
    let config = null
    if (dev) {
      config = newApp
    } else {
      try {
        let endpoint = serviceUrl + "/api/ms/news/" + params.slug +"?language=" + userlanguage
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

  const newApp = {
  }

  return await getSelectedPost(utils.getBackendUrl(url))
}