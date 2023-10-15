import { dev } from '$app/environment';
import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
import { utils } from '$lib/utils.js';
import { sgxdata } from '$lib/sgxdata.js';

export const load = async ({ params, url }) => {

  let usertoken
  token.subscribe((value) => usertoken = value)
  return sgxdata.getGroup(dev, url, usertoken)

}