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
  getData: function (devMode, apiUrl,config, filter, token, transformFunction) {
    return Promise.resolve(getSgxData2(devMode,apiUrl,config,filter,token, transformFunction)).then((result) => result);
  }
}

const getSgxData2 = async function (devMode,apiUrl, config, filter, token, transformFunction) {
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
