import { defaultOrganizationId } from '$lib/stores.js';

let defaultOrganizationIdValue = 1
defaultOrganizationId.subscribe((value) => defaultOrganizationIdValue = value)

export const utils = {
  /**
   * Returns the URL of the backend service based on the URL of subdomain
   * @param {string} url - URL of the frontend service
   * @returns {string} URL of the backend service
   */
  getBackendUrl: function (url) {
    let x = url.host
    if (!x.endsWith('localhost')) {
      if (x.startsWith('app.')) {
        x = x.substring(4)
      } else if (x.startsWith('cloud.')) {
        x = x.substring(6)
      }
    }
    return url.protocol + '//' + x
  },
  /**
   * Returns information if the URL is a subdomain of the cloud service
   * @param {string} url - URL of subdomain
   * @returns {boolean} true if the URL is a subdomain of the cloud service
   */
  isCloudSubdomain: function (url) {
    //return url.host.startsWith('cloud.') || url.host.endsWith(this.STANDARD_DOMAIN)
    return !url.host.startsWith('app.')
  },
  getSubdomain: function (url) {
    let idx = url.host.indexOf('.')
    if (idx < 1) {
      return ''
    }
    let subdomain = url.host.substring(0, idx)
    return subdomain
  },
  isB2bService: function (url) {
    return url.host.endsWith(this.B2B_DOMAIN)
  },
  getTenantName: function (url) {
    if (url.host.endsWith(this.B2B_DOMAIN)) {
      return url.host.substring(0, url.host.indexOf('.' + this.B2B_DOMAIN))
    } else {
      return ''
    }
  },
  /**
   * Return ID of the default organization
   * @returns {number} default organization id
   */
  getDefaultOrganizationId: function () {
    return defaultOrganizationIdValue
  },
  /**
   * Transforms the date string from the REST API format to the format required by the HTML datetime-local input
   * @param {string} dateString - date string in the REST API format
   * @returns {string} date string in the HTML datetime-local format or empty string if the input is null, undefined or empty
   * @example
   * // returns '2023-03-02T12:10'
   * getLocalDateFormat('2023-03-02T12:10:27')
   * @example
   */
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
    //REST API zamieni znak '~' w definicji offsetu czasu na '+'
    if (dateString === null || dateString === undefined || dateString.trim().length === 0) {
      return ''
    }
    //
    let offset = -1 * (new Date(dateString).getTimezoneOffset()) / 60;
    let plusOffset = offset > 0;
    offset = Math.abs(offset)
    let timeOffsetStr
    if (offset < 10) {
      timeOffsetStr = "_" + (plusOffset ? "~0" : "-0") + offset + "00" // '~' is used instead of '+' because '+' is not allowed in URL
    } else {
      timeOffsetStr = "_" + (plusOffset ? "~" : "-") + offset + "00"  // '~' is used instead of '+' because '+' is not allowed in URL
    }
    timeOffsetStr = timeOffsetStr.substring(1)
    //
    return dateString + ':00' + timeOffsetStr
  },
  getDateApiISOFormat: function (dateString) {
    //zamienia ciąg znaków reprezentujący datę
    //z formatu wymaganego przez pole typu datetime-local formularza HTML
    //na format stosowany przez REST API
    //REST API zamieni znak '~' w definicji offsetu czasu na '+'
    if (dateString === null || dateString === undefined || dateString.trim().length === 0) {
      //console.log('getDateApiISOFormat: null dateString')
      return ''
    }
    //
    let offset = -1 * (new Date(dateString).getTimezoneOffset()) / 60;
    let plusOffset = offset > 0;
    offset = Math.abs(offset)
    let timeOffsetStr
    if (offset < 10) {
      timeOffsetStr = "_" + (plusOffset ? "~0" : "-0") + offset + ":00" // '~' is used instead of '+' because '+' is not allowed in URL
    } else {
      timeOffsetStr = "_" + (plusOffset ? "~" : "-") + offset + ":00"  // '~' is used instead of '+' because '+' is not allowed in URL
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
   * @param {*} language - selected language
   * @returns text of label name for given language
   */
  getLabel: function (name, labels, language) {
    try {
      return labels[name][language]
    } catch (err) {
      //console.log('getLabel error: ' + err)
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
  isServiceAvailable: function (userProfile, serviceName) {
    let SMS = 1 // 0b00000001 
    let SUPPORT = 2 // 0b00000010
    switch (serviceName.toUpperCase()) {
      case 'SMS':
        return SMS & userProfile.services == SMS
      case 'SUPPORT':
        return SUPPORT & userProfile.services == SUPPORT
    }
    return false
  },
  isHigherAccountType: function (actualUserProfile, managedUserConfig) {
    if (actualUserProfile == null || actualUserProfile == undefined) return false
    if (managedUserConfig == null || managedUserConfig == undefined) return false
    if (actualUserProfile.uid == managedUserConfig.uid) return true
    switch (actualUserProfile.type) {
      case 9: // admin
        return managedUserConfig.type == 0 || managedUserConfig.type == 4
      case 8: // managing admin
        return managedUserConfig.type == 0 || managedUserConfig.type == 4 || managedUserConfig.type == 9
      case 1: // system admin (owner)
        return true;
      default:
        return false
    }
  },
  isObjectAdmin: function (userProfile, objectOwner, defaultOrganizationId, objectAdmins, objectTeam) {
    //user types
    //1 - service admin
    //9 - organization admin
    let result = false
    let data = {}
    data.isDefault = userProfile.organization == defaultOrganizationId
    data.isOwner = userProfile.uid == objectOwner
    data.isServiceAdmin = userProfile.type == 1
    data.isOrganizationAdmin = userProfile.type == 9
    data.isObjectAdmin = objectAdmins!=undefined && objectAdmins!=null && objectAdmins.includes(','+userProfile.uid+',')
    data.isObjectTeamMember = objectTeam!=undefined && objectTeam!=null && objectTeam.includes(','+userProfile.uid+',')

    if (data.isDefault) {
      result = userProfile.type == 1 || userProfile.uid == objectOwner || data.isObjectAdmin
    } else {
      // Service admin or organization admin can manage objects of his organization
      // Object owners which are not service admin or organization admin 
      // are not allowed to manage objects of his organization
      result = userProfile.type == 9 || userProfile.type == 1
    }
    data.hasAdminRights = result
    //console.log('isObjectAdmin', data)
    return result
  },
  /**
   * Returns the user type based on the name
   * @param {string} name 
   * @returns {number} user type
   */
  getUserType: function (name) {
    switch (name) {
      case 'user':
        return 0  // default type, standard user
      case 'owner':
        return 1  // owner, service admin
      case 'application':
        return 2
      case 'demo':
        return 3  // demo account
      case 'free':
        return 4  // free account
      case 'primary':
        return 5  // primary account
      case 'readonly':
        return 6
      case 'extended':
        return 7
      case 'manag. admin':
        return 8  // can manage all organization tenants
      case 'admin':
        return 9  // tenant admin
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
  /**
   * Returns the user type name based on the type
   * @param {number} type
   * @returns {string} user type name
   */
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
        return 'manag. admin'
      case 9:
        return 'admin' // tenant admin
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
  isPayingUser: function (type) {
    return (type == 0 || type == 1 || type == 5 || type == 7 || type == 8 || type == 9)
  },
  /**
   * Returns account types allowed to be changed for the user of the given profile
   * @param {object} userProfile - user profile
   * @returns {Array} list of account types allowed to be changed
   * @example
   * // returns [0, 5]
   * getAccountChangeTypesAllowed({type: 4})
   */
  getAccountChangeTypesAllowed: function (userProfile) {
    let result = []
    if(!this.isDefaultOrganizationUser(userProfile)){
      return result
    }
    if (userProfile.type == 4) {
      result.push(0) // free -> user
      result.push(5) // free -> primary
    } else if (userProfile.type == 5) {
      result.push(0) // primary -> user
      result.push(4) // primary -> free
    } else if (userProfile.type == 0) {
      result.push(5) // user -> primary
      result.push(4) // user -> free

    }
    return result
  },
  /**
   * Returns information if the account type change is allowed for the user of the given profile
   * @param {object} userProfile - user profile
   * @param {number} newType - new account type
   * @returns {boolean} true if the account type change is allowed
   * @example
   * // returns true
   * isAccountTypeChangeAllowed({type: 4}, 0)
   */
  isAccountTypeChangeAllowed: function (userProfile, newType) {
    if(!this.isDefaultOrganizationUser(userProfile)){
      return false
    }
    let allowedTypes = this.getAccountChangeTypesAllowed(userProfile)
    return allowedTypes.includes(newType)
  },
  isUserRole: function (userProfile, roleName, defaultResult) {
    let roles
    try {
      roles = userProfile.role.toLowerCase().split(',')
      return roles.includes(roleName.toLowerCase())
    } catch (err) {
      //console.log("error getting user's role. Returning " + defaultResult)
      return defaultResult
    }
  },
  //// algorithm changed until work on organizations is completed
  /*isDefaultOrganizationUser: function (userProfile) {
    //console.log('isDefaultOrganizationUser', userProfile, defaultOrganizationIdValue)
    let result = userProfile.organization == defaultOrganizationIdValue
      || defaultOrganizationIdValue == null
    return result
  },*/
  isDefaultOrganizationUser: function (userProfile) {
    //return userProfile.type !=8
    let result = userProfile.organization == defaultOrganizationIdValue
      || defaultOrganizationIdValue == null
    return result
  },
  recalculate: function (value, rounding) {
    if(isNaN(value)){
      return value
    }
    try {
      return Number.parseFloat(value).toFixed(rounding);
    } catch (e) {
      return value;
    }
  },
  AUTHORIZATION_FAILED: 0,
  AUTHENTICATION_FAILED: 1,
  FETCH: 3,
  FETCH_STATUS: 4,
  STANDARD_DOMAIN: 'signomix.com',
  B2B_DOMAIN: 'iot360.cloud'
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