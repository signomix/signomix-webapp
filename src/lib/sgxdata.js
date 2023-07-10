export const sgxdata = {
  getDataExample: function (eui, channelNames, count) {
    let channels=channelNames.split(",");
    if (channels.length === 1) {
      return this.getOneChannelExample(eui, channelNames, count)
    }else{
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
        value: Math.random()*100,
        timestamp: tmpD,
        stringValue:null
      }
      measurements.push(measurement)
    }
    cdata.push(measurements)
    return cdata
  },
  getMultiChannelExample: function (eui, channelNames, count) {
    let cdata = [];
    let channels=channelNames.split(",");
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
          value: Math.random()*100,
          timestamp: tmpD,
          stringValue:null
        }
        measurements.push(measurement)
      }
      cdata.push(measurements)
    }
    return cdata
  }
}