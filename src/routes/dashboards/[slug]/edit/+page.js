// @ts-nocheck
import { browser, building, dev, version } from '$app/environment';
import { error } from '@sveltejs/kit';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';

export const load = async ({ params, url }) => {
let usertoken
token.subscribe((value)=> usertoken=value)
let userprofile
profile.subscribe((value)=>userprofile=value)
let userAuthenticated
isAuthenticated.subscribe((value)=>userAuthenticated=value)

  const newDashboard = {
    id: params.slug,
    userID: userprofile.uid,
    title: 'My Dasboard',
    team: '',
    administrators: '',
    shared: false,  // true if shared with other users
    organizationId: userprofile.organization,
    organizationName: '',
    items: [],
    widgets: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const getSelectedConfig = async (serviceUrl) => {
    let config = null
    if (params.slug == 'new') {
      config = newDashboard
    } else {
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
    }
    return config
  }

  const getOrganization = async (id) => {
    if(dev){
      return {
        id: 0,
        name: 'Default organization',
        code: '',
        description: ''
      }
    }
    let config = null
    const headers = new Headers()
    headers.set('Accept', 'application/json');
    headers.set('Authentication', usertoken);
    await fetch(utils.getBackendUrl(url) + '/api/organization/' + id, { mode: 'cors', headers: headers })
      .then(response => {
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
    return config
  }

  async function transform() {
    if (!userAuthenticated) { // not logged in
      return newDashboard
    }
    let config = null
    await getSelectedConfig(utils.getBackendUrl(url))
      .then((cfg) => {
        try {
          for (let i = 0; i < cfg.items.length; i++) {
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
        } catch (e) {
          console.log(e)
        }
        config = cfg
      }).catch((error) => {
        console.log(error)
      })
    await getOrganization(config.organizationId)
    .then((cfg2) => {
      config.organizationName = cfg2.name
    }).catch((error) => {
      console.log(error)
    })
    return config
  }

  return await transform()
}