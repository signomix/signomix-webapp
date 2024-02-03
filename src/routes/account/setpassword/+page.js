export async function load({ params, url }) {
    let key = url.searchParams.get('key');
    let login = url.searchParams.get('login');
    let language = url.searchParams.get('language');
    let languageList=['en','pl'];
    if(language === null) language = 'en';
    language=language.toLowerCase();
    if(languageList.indexOf(language) === -1) language = 'en';   
    return { key, login, language};
}