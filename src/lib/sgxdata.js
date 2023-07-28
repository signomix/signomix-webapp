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
    let cdata = [];
    let measurement = {}
    let measurements = []
    let tmpD
    for (let i = 0; i < count; i++) {
      tmpD = new Date() - 60000 * i
      measurement = {
        deviceEUI: eui,
        name: channelName,
        value: Math.random() * 100,
        timestamp: tmpD,
        stringValue: null
      }
      measurements.push(measurement)
    }
    cdata.push(measurements)
    return cdata
  },
  getMultiChannelExample: function (eui, channelNames, count) {
    let cdata = [];
    let channels = channelNames.split(",");
    let measurement = {}
    let measurements = []
    let tmpD
    for (let i = 0; i < count; i++) {
      measurements = []
      tmpD = new Date() - 60000 * i
      for (let j = 0; j < channels.length; j++) {
        measurement = {
          deviceEUI: eui,
          name: channels[j],
          value: Math.random() * 100,
          timestamp: tmpD,
          stringValue: null
        }
        measurements.push(measurement)
      }
      cdata.push(measurements)
    }
    return cdata
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
    }catch(e){
      console.log('getNotifications', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
  },
  getUserSettings: function (devMode, apiUrl, token) {
    try {
      return Promise.resolve(getSgxUserSettings(devMode, apiUrl, token)).then((result) => result);
    }catch(e){
      console.log('getUserSettings', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxUserSettings(devMode, apiUrl, token)).then((result) => result);
  }
}

const getSgxData2 = async function (devMode, apiUrl, config, filter, token, transformFunction) {
  if (devMode) {
    if (transformFunction == null || transformFunction == undefined) {
      return sgxdata.getDataExample(config.dev_id, config.channel, 7)
    } else {
      return await transformFunction(config, sgxdata.getDataExample(config.dev_id, config.channel, 7))
    }
  }
  const headers = new Headers()
  headers.set('Accept', 'application/json');
  const endpoint = apiUrl + config.dev_id + "/" + config.channel + "?tid=" + token + "&query=" + config.query;
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
    const endpoint = apiUrl + "?limit=" + limit + "&offset=" + offset;
    const res = await fetch(endpoint, { mode: 'cors', headers: headers });
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

const getSgxUserSettings = async function (devMode, apiUrl, limit, offset, token) {
  if (devMode) {
    return {
      settings: {
        uid: 'tester',
        email: 'test@localhost',
        name: 'Test name',
        surname: 'Test surname',
        role: '',
        confirmed: true,
        preferredLanguage: 'pl'
      }
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
    throw new Error(text);
  }


}


const groupDataExample=[
  [
    [
      {
        deviceEUI:"0003230F013A2EDE",
        name:"temperature",
        value:16.9,
        timestamp:1690440834455,
        stringValue:null
      },
      {
        deviceEUI:"0003230F013A2EDE",
        name:"humidity",
        value:99.0,
        timestamp:1690440834455,
        stringValue:null
      },
      {
        deviceEUI:"0003230F013A2EDE",
        name:"latitude",
        value:100,
        timestamp:1690440834455,
        stringValue:null
      },
      {
        deviceEUI:"0003230F013A2EDE",
        name:"longitude",
        value:100,
        timestamp:1690440834455,
        stringValue:null
      }
    ]
  ],
  [
    [
      {
        deviceEUI:"00033728193A26DB",
        name:"temperature",
        value:16.6,
        timestamp:1690440654408,
        stringValue:null
      },
      {
        deviceEUI:"00033728193A26DB",
        name:"humidity",
        value:60.0,
        timestamp:1690440654408,
        stringValue:null
      },
      {
        deviceEUI:"00033728193A26DB",
        name:"latitude",
        value:200,
        timestamp:1690440654408,
        stringValue:null
      },
      {
        deviceEUI:"00033728193A26DB",
        name:"longitude",
        value:200,
        timestamp:1690440654408,
        stringValue:null
      }
    ]
  ]
]