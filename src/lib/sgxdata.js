export const sgxdata = {
  getOneChannelExample: function (eui, channelName) {
    let cdata = [
      [
        {
          deviceEUI: eui,
          name: channelName,
          value: Math.random()*100,
          stringValue: null,
          timestamp: new Date().getTime()
        }
      ]
    ]
    return cdata
  },
  getMultiChannelExample: function (channelNames) {
    let cdata = null;
    return cdata
  }
}