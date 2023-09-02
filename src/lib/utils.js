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
  isObjectAdmin: function (session, objectOwner) {
    if (session.user.organization == 0) {
      return session.user.type == 1 || session.user.login == objectOwner
    } else {
      return session.user.type == 9 || session.user.type == 1 || session.user.type == 0
    }
  },
  getUserType: function (name) {
    switch (name) {
      case 'user': // default type, standard user
        return 0
      case 'owner': // owner, service admin
        return 1
      case 'application':
        return 2
      case 'demo':
        return 3
      case 'free':  // free account
        return 4
      case 'primary': // primary account
        return 5
      case 'readonly':
        return 6
      case 'extended':
        return 7
      case 'superuser': // superuser
        return 8
      case 'admin': // organization admin
        return 9
      case 'anonymous':
        return 10
      case 'subscriber':
        return 100
      case 'any':
        return 1000
      default:
        return -1
    }
  },
  getUserTypeName: function (type) {
    switch (type) {
      case 0:
        return 'user'
      case 1:
        return 'owner'
      case 2:
        return 'application'
      case 3:
        return 'demo'
      case 4:
        return 'free'
      case 5:
        return 'primary'
      case 6:
        return 'readonly'
      case 7:
        return 'extended'
      case 8:
        return 'superuser'
      case 9:
        return 'admin'
      case 10:
        return 'anonymous'
      case 100:
        return 'subscriber'
      case 1000:
        return 'any'
      default:
        return 'unknown'
    }
  },
  AUTHORIZATION_FAILED: 0,
  AUTHENTICATION_FAILED: 1,
  FETCH: 3,
  FETCH_STATUS: 4

}

/*
public static final int USER = 0; // default type, standard user
    public static final int OWNER = 1; // owner, service admin
    public static final int APPLICATION = 2; // application
    public static final int DEMO = 3;
    public static final int FREE = 4; // registered, free account
    public static final int PRIMARY = 5; // primary account
    public static final int READONLY = 6;
    public static final int EXTENDED = 7; // students, scientists, nonprofits
    public static final int SUPERUSER = 8;
    public static final int ADMIN = 9; // organization admin
    public static final int ANONYMOUS = 10;
    public static final int SUBSCRIBER = 100;
    public static final int ANY = 1000;
    */