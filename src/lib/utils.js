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
    userSession.user.set(
      {
        logged: session.user.logged,
        login: session.user.login,
        password: session.user.password,
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
  getLocalDateFormatFromTimestamp(timestamp) {
    var dt = new Date(timestamp),
      current_date = dt.getDate(),
      current_month = dt.getMonth() + 1,
      current_year = dt.getFullYear(),
      current_hrs = dt.getHours(),
      current_mins = dt.getMinutes(),
      current_secs = dt.getSeconds(),
      current_datetime;

    // Add 0 before date, month, hrs, mins or secs if they are less than 0
    current_date = current_date < 10 ? '0' + current_date : current_date;
    current_month = current_month < 10 ? '0' + current_month : current_month;
    current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
    current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
    current_secs = current_secs < 10 ? '0' + current_secs : current_secs;

    // Current datetime
    // String such as 2016-07-16T19:20:30
    current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;
    return current_datetime;
  },
  getText: function (name, language, texts) {
    return texts[name][language]
  },
  /**
   * Returns text for given name and language
   * @param {*} name - label name
   * @param {*} labels - object with labels for each language
   * @param {*} session - user session
   * @returns text of label name for given language
   */
  getLabel: function (name, labels, session) {
    try {
      return labels[name][session.user.language]
    } catch (err) {
      console.log('getLabel error: ' + err)
      return name
    }
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