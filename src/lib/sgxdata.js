export const sgxdata = {
  getDataExample: function (eui, channelNames, count) {
    let channels = channelNames.split(",");
    if (channels.length === 1) {
      return this.getOneChannelExample(eui, channelNames, count)
    } else {
      return this.getMultiChannelExample(eui, channelNames, count)
    }
  },
  getOneChannelExample: function (eui, channelName, count) {
    let timestamps = [];
    let measurement = {}
    let channels = []
    let tmpD
    for (let i = count - 1; i >= 0; i--) {
      tmpD = new Date() - 60000 * i
      channels = []
      measurement = {
        deviceEUI: eui,
        name: channelName,
        value: i != 3 ? Math.random() * 100 : null,
        timestamp: tmpD,
        stringValue: null
      }
      channels.push(measurement)
      timestamps.push(channels)
    }
    let result = { timestamps: timestamps }
    console.log('timestamps', JSON.stringify(result))
    return timestamps
  },
  getMultiChannelExample: function (eui, channelNamesString, count) {
    let timestamps = [];
    let channels = []
    let channelNames = channelNamesString.split(",");
    let measurement = {}
    let tmpD
    for (let i = count - 1; i >= 0; i--) {
      tmpD = new Date() - 60000 * i
      channels = []
      for (let j = 0; j < channelNames.length; j++) {
        measurement = {
          deviceEUI: eui,
          name: channelNames[j],
          value: (i == 3 && j == 1) ? null : Math.random() * 100,
          timestamp: tmpD,
          stringValue: null
        }
        channels.push(measurement)
      }
      timestamps.push(channels)
    }
    console.log('timestamps', timestamps)
    return timestamps
  },
  getData: function (devMode, apiUrl, config, filter, token, transformFunction) {
    return Promise.resolve(getSgxData2(devMode, apiUrl, config, filter, token, transformFunction)).then((result) => result);
  },
  getGroupData: function (devMode, apiUrl, config, filter, token, transformFunction) {
    return Promise.resolve(getSgxGroupData(devMode, apiUrl, config, filter, token, transformFunction)).then((result) => result);
  },
  getNotifications: function (devMode, apiUrl, limit, offset, token) {
    try {
      return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
    } catch (e) {
      console.log('getNotifications', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
  },
  getUserSettings: function (devMode, apiUrl, userData, token) {
    try {
      return Promise.resolve(getSgxUserSettings(devMode, apiUrl, userData, token)).then((result) => result);
    } catch (e) {
      console.log('getUserSettings', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxUserSettings(devMode, apiUrl, token)).then((result) => result);
  },
  getOrganization: function (devMode, apiUrl, token) {
    try {
      return Promise.resolve(getSgxOrganizationData(devMode, apiUrl, token)).then((result) => result);
    } catch (e) {
      console.log('getNotifications', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
  },
  getDevices: function (devMode, apiUrl, searchString, token) {
    try {
      return Promise.resolve(getSgxDevices(devMode, apiUrl, searchString, token)).then((result) => result);
    } catch (e) {
      console.log('getDevices', e)
      throw new Error(e);
    }
  },
  getGroups: function (devMode, apiUrl, token, limit, offset) {
    try {
      return Promise.resolve(getSgxGroups(devMode, apiUrl, token, limit, offset)).then((result) => result);
    } catch (e) {
      console.log('getGroups', e)
      throw new Error(e);
    }
  },
  getGroup: function (devMode, apiUrl, token) {
    try {
      return Promise.resolve(getSgxGroups(devMode, apiUrl, token)).then((result) => result[0]);
    } catch (e) {
      console.log('getGroup', e)
      throw new Error(e);
    }
  }
}

const getSgxData2 = async function (devMode, apiUrl, config, filter, token, transformFunction) {
  if (devMode) {
    if (transformFunction == null || transformFunction == undefined) {
      return sgxdata.getDataExample(config.dev_id, config.channel, 10)
    } else {
      return await transformFunction(config, sgxdata.getDataExample(config.dev_id, config.channel, 10))
    }
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  headers.set('Authentication', token);
  var query = config.query;
  if (query == null || query == undefined || query == "undefined") {
    query = "";
  }
  const endpoint = apiUrl + config.dev_id + "/" + config.channel + "?query=" + query;
  const res = await fetch(endpoint, { mode: 'cors', headers: headers });
  let data;
  if (transformFunction == null || transformFunction == undefined) {
    data = await res.json();
  } else {
    data = await transformFunction(config, res.json());
  }
  if (res.ok) {
    return data;
  } else {
    throw new Error(text);
  }
}

const getSgxGroupData = async function (devMode, apiUrl, config, filter, token, transformFunction) {
  //console.log('getSgxGroupData', devMode, apiUrl, config, filter, token, transformFunction)
  if (devMode) {
    if (transformFunction == null || transformFunction == undefined) {
      return groupDataExample
    } else {
      return await transformFunction(config, groupDataExample)
    }
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  const endpoint = apiUrl + config.group + "/" + config.channel + "?tid=" + token + "&query=" + config.query;
  const res = await fetch(endpoint, { mode: 'cors', headers: headers });
  let data;
  if (transformFunction == null || transformFunction == undefined) {
    data = await res.json();
  } else {
    data = await transformFunction(config, res.json());
  }
  if (res.ok) {
    return data;
  } else {
    throw new Error(text);
  }

}

const getSgxNotifications = async function (devMode, apiUrl, limit, offset, token) {
  if (devMode) {
    return {}
  }
  try {
    const headers = new Headers()
    headers.set('Accept', 'application/json');
    headers.set('Authentication', token);
    let endpoint = apiUrl;
    if (limit != null && limit != undefined && limit != "undefined"
      && offset != null && offset != undefined && offset != "undefined") {
      endpoint = endpoint + "?limit=" + limit + "&offset=" + offset;
    }
    const res = await fetch(endpoint, {
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin',
      headers: headers
    });
    let data;
    data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw new Error(text);
    }
  } catch (e) {
    console.log('getSgxNotifications', e)
    throw new Error(e);
  }
}

const getSgxUserSettings = async function (devMode, apiUrl, userData, token) {
  if (devMode) {
    return {
      uid: userData.uid,
      email: 'test@localhost',
      name: 'name',
      surname: 'surname',
      type: 4,
      role: '',
      confirmed: true,
      preferredLanguage: 'pl',
      organization: userData.organization,
      createdAt: Date.now(),
      generalNotificationChannel: '',
      infoNotificationChannel: '',
      warningNotificationChannel: '',
      alertNotificationChannel: ''
    }
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  headers.set('Authentication', token);
  const res = await fetch(apiUrl, { mode: 'cors', headers: headers });
  let data;
  data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(res.statusText);
  }


}

const getSgxOrganizationData = async function (devMode, apiUrl, token) {
  if (devMode) {
    return {
      id: 0,
      name: 'Default organization',
      code: '',
      description: ''
    }
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  headers.set('Authentication', token);
  const res = await fetch(apiUrl, { mode: 'cors', headers: headers });
  let data;
  data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(res.statusText);
  }
}

const getSgxDevices = async function (devMode, apiUrl, searchString, token) {
  if (devMode) {
    // when running in dev mode, return devicesExample
    if (searchString == null || searchString == undefined || searchString == "") {
      return devicesExample
    } else {
      let s = searchString.split("=");
      if(s[1]=='*'){
        return devicesExample
      } else if(s[0] == 'eui') {
        return devicesExample.filter((device) => device.eui.includes(s[1].toUpperCase()))
      } else {
        return devicesExample.filter((device) => device.name.toLowerCase().includes(s[1].toLowerCase()))
      }
    }
  }
  let endpoint = apiUrl;
  if (searchString != null && searchString != undefined && searchString != "") {
    endpoint = endpoint + "&" + searchString;
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  headers.set('Authentication', token);
  const res = await fetch(apiUrl, { mode: 'cors', headers: headers });
  let data;
  data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(res.statusText);
  }
}
const getSgxGroups = async function (devMode, apiUrl, token, limit, offset) {
  if (devMode) {
    return groupsExample
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  headers.set('Authentication', token);
  const res = await fetch(apiUrl + '?limit=' + limit + '&offset=' + offset, { mode: 'cors', headers: headers });
  let data;
  data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(res.statusText);
  }
}
const getSgxGroup = async function (devMode, apiUrl, token) {
  if (devMode) {
    return groupsExample[0]
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  headers.set('Authentication', token);
  const res = await fetch(apiUrl, { mode: 'cors', headers: headers });
  let data;
  data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(res.statusText);
  }
}


const groupDataExample = [
  [
    [
      {
        deviceEUI: "0003230F013A2EDE",
        name: "temperature",
        value: 16.9,
        timestamp: 1690440834455,
        stringValue: null
      },
      {
        deviceEUI: "0003230F013A2EDE",
        name: "humidity",
        value: 99.0,
        timestamp: 1690440834455,
        stringValue: null
      },
      {
        deviceEUI: "0003230F013A2EDE",
        name: "latitude",
        value: 100,
        timestamp: 1690440834455,
        stringValue: null
      },
      {
        deviceEUI: "0003230F013A2EDE",
        name: "longitude",
        value: 100,
        timestamp: 1690440834455,
        stringValue: null
      }
    ]
  ],
  [
    [
      {
        deviceEUI: "00033728193A26DB",
        name: "temperature",
        value: 16.6,
        timestamp: 1690440654408,
        stringValue: null
      },
      {
        deviceEUI: "00033728193A26DB",
        name: "humidity",
        value: 60.0,
        timestamp: 1690440654408,
        stringValue: null
      },
      {
        deviceEUI: "00033728193A26DB",
        name: "latitude",
        value: 200,
        timestamp: 1690440654408,
        stringValue: null
      },
      {
        deviceEUI: "00033728193A26DB",
        name: "longitude",
        value: 200,
        timestamp: 1690440654408,
        stringValue: null
      }
    ]
  ]
]

const groupsExample = [
  {
    "name": "Test group 1",
    "userID": "user",
    "team": ",tester1,public,",
    "administrators": ",",
    "channels": {
      "latitude": {
        "name": "latitude",
        "type": null
      },
      "longitude": {
        "name": "longitude",
        "type": null
      }
    },
    "description": "",
    "open": true,
    "organization": 1,
    "eui": "TEST",
    "channelsAsString": "latitude,longitude"
  }
]

const devicesExample = [
  {
    "eui": "010203040506",
    "name": "device 1",
    "type": "TTN",
    "channelsAsString": "satelites,hdop,altitude,longitude,latitude"
  },
  {
    "eui": "012345678",
    "name": "device 2",
    "type": "GENERIC",
    "channelsAsString": "temperature,humidity"
  },
  {
    "eui": "ABC123456",
    "name": "mydevice 1",
    "type": "GENERIC",
    "channelsAsString": "satelites"
  },
  {
    "eui": "ABC12345678",
    "name": "mydevice 2",
    "type": "TTN",
    "channelsAsString": "satelites,hdop,altitude,longitude,latitude"
  },
  {
    "eui": "01020304050607",
    "name": "mydevice 3",
    "type": "GENERIC",
    "channelsAsString": "temperature"
  },
  {
    "eui": "EF020304050607",
    "name": "mydevice 4",
    "type": "GENERIC",
    "channelsAsString": "temperature"
  }
]

export default sgxdata;