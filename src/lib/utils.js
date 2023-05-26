import { userSession } from '$lib/stores.js';

export const utils = {
  getBackendUrl: function (url) {
    let x = url.host
    if (x.startsWith('app.')) {
      x = x.substring(4)
    }
    return url.protocol + '//' + x
  },
  setAuthorized: function (session, value) {
    userSession.set(
      {
        logged: session.logged,
        login: session.login,
        password: session.password,
        authorized: value
      }
    )
  },
  getLocalDateFormat: function (dateString) {
    //zamienia ciąg znaków reprezentujący datę
    //z formatu stosowanego przez REST API
    //na format wymagany przez pole typu datetime-local formularza HTML
    //02.03.23'T'12:10:27
    if (dateString === null || dateString === undefined || dateString.trim().length === 0) {
      return ''
    }
    return dateString.substring(0, 16).replace('T', ' ')
  },
  getDateApiFormat: function (dateString) {
    //zamienia ciąg znaków reprezentujący datę
    //z formatu wymaganego przez pole typu datetime-local formularza HTML
    //na format stosowany przez REST API
    if (dateString === null || dateString === undefined || dateString.trim().length === 0) {
      return ''
    }
    //
    let offset = -1 * (new Date(dateString).getTimezoneOffset()) / 60;
    let plusOffset = offset > 0;
    offset = Math.abs(offset)
    let timeOffsetStr
    if (offset < 10) {
      timeOffsetStr = "_" + (plusOffset ? "+0" : "-0") + offset + "00"
    } else {
      timeOffsetStr = "_" + (plusOffset ? "+" : "-") + offset + "00"
    }
    timeOffsetStr = timeOffsetStr.substring(1)
    //
    return dateString + ':00' + timeOffsetStr
  },
  getText: function (name, language, texts) {
    return texts[name][language]
  },
  getMessage: function (code) {
    switch (code) {
      case this.AUTHORIZATION_FAILED:
        return 'Błąd dostępu.'
      case this.AUTHENTICATION_FAILED:
        return 'Nieudane logowanie.'
      case this.FETCH:
        return ' Możliwa przyczyna: self signed nie są obsługiwane.'
      case this.FETCH_STATUS:
        return "(⊙＿⊙')\n\nUps, tego się nie spodziewaliśmy!\nBłąd (%1): %2" //http://asciimoji.com/
      default:
        return 'Kod błędu: ' + code
    }

  },
  AUTHORIZATION_FAILED: 0,
  AUTHENTICATION_FAILED: 1,
  FETCH: 3,
  FETCH_STATUS: 4

}