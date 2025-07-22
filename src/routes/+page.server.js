import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import {env} from '$env/dynamic/public';

export async function load(params) {    
    let data = {};
    try {
        let documentName = getFileName(params);
        console.log('getDocument', documentName);
        console.log('PUBLIC_HCMS_URL', env.PUBLIC_HCMS_URL);
        console.log('PUBLIC_HCMS_ROOT', env.PUBLIC_HCMS_ROOT);
        //console.log('PUBLIC_HCMS_LANGUAGE', env.PUBLIC_HCMS_LANGUAGE);
        data.pl = await hcms.getDocument(
            dev,
            env.PUBLIC_HCMS_URL,
            getFileName(params,'pl'),
            env.PUBLIC_HCMS_ROOT,
            env.PUBLIC_HCMS_INDEX
        );
        data.en = await hcms.getDocument(
            dev,
            env.PUBLIC_HCMS_URL,
            getFileName(params,'en'),
            env.PUBLIC_HCMS_ROOT,
            env.PUBLIC_HCMS_INDEX
        );
    } catch (err) {
        console.log(err);
    }
    console.log('load', data);
    return data;
}

function getFileName(params, language) {
    console.log('getFileName', params);
    //console.log('language', $language);
    //let defaultLanguage = env.PUBLIC_HCMS_LANGUAGE || 'pl';
    let subdomain = params.url.hostname.substring(0, params.url.hostname.indexOf('.')).toLowerCase();
    switch (subdomain) {
        case 'cloud':
        case 'hotel':
            return '/' + env.PUBLIC_HCMS_ROOT + '/'+language+'/sub/'+subdomain+'/index.html';
        default:
            return '/' + env.PUBLIC_HCMS_ROOT + '/'+language+'/sub/default/index.html';
    }
}