import { dev } from '$app/environment';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';

export const load = async ({ params, url }) => {

  let usertoken
  token.subscribe((value) => usertoken = value)
  let endpoint = utils.getBackendUrl(url)+"/api/core/v2/groups/" + params.slug
  return sgxdata.getGroup(dev, endpoint, usertoken)

}