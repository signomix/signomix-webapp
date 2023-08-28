// @ts-nocheck
import { browser, building, dev, version } from '$app/environment';
import { error } from '@sveltejs/kit';
import { userSession } from '$lib/stores.js';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';

export const load = async ({ params, url }) => {
  let session;
  userSession.subscribe(value => {
    session = value;
  });

  const newDashboard = {
    id: params.slug,
    userID: session.user.login,
    title: 'My Dasboard',
    team: '',
    administrators: '',
    shared: false,  // true if shared with other users
    organizationId: session.user.organization,
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
    headers.set('Authentication', session.user.token);
    await fetch(utils.getBackendUrl(url) + '/api/core/organization/' + id, { mode: 'cors', headers: headers })
      .then(response => {
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
    return config
  }

  async function transform() {
    if (session == null || session == undefined
      || session.user.login == null || session.user.login == undefined || session.user.login == '') { // not logged in
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

  /*
    async function transform2() {
    Promise.all([
      getSelectedConfig(utils.getBackendUrl(url)),
      getOrganization(1)
    ]).then((values) => {
      console.log('VALUES', values)
    }).catch((error) => {
      console.log(error)
    })
  }
  */

  return await transform()
}