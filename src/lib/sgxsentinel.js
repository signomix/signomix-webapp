export const sgxsentinel = {
  getSignals: function (devMode, apiUrl, limit, offset, token) {
    try {
      return Promise.resolve(getSgxSignals(devMode, apiUrl, limit, offset, token)).then((result) => result);
    } catch (e) {
      console.log('getSignals', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
  },
  getSentinels: function (devMode, apiUrl, limit, offset, token) {
    try {
      return Promise.resolve(getSgxSentinels(devMode, apiUrl, limit, offset, token)).then((result) => result);
    } catch (e) {
      console.log('getSentinels', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
  },
  getSentinel: function (devMode, apiUrl, token) {
    try {
      return Promise.resolve(getSgxSentinel(devMode, apiUrl, token)).then((result) => result);
    } catch (e) {
      console.log('getSentinels', e)
      throw new Error(e);
    }
    //return Promise.resolve(getSgxNotifications(devMode, apiUrl, limit, offset, token)).then((result) => result);
  }
}

const getSgxSignals = async function (devMode, apiUrl, limit, offset, token) {
  if (devMode) {
    return {
      list: [
        {
          id: 1,
          createdAt: "2021-01-01T00:00:00.000Z",
          deliveredAt: "2021-01-01T00:00:00.000Z",
          sentAt: "2021-01-01T00:00:00.000Z",
          readAt: "2021-01-01T00:00:00.000Z",
          userId: "tester1",
          organizationId: 1,
          sentinelConfigId: 1,
          deviceEui: "0000000000000001",
          level: 1,
          messageEn: "Test message",
          messagePl: "Testowa wiadomość"
        },
        {
          id: 2,
          createdAt: "2021-01-01T00:00:00.000Z",
          deliveredAt: "2021-01-01T00:00:00.000Z",
          sentAt: "2021-01-01T00:00:00.000Z",
          readAt: "2021-01-01T00:00:00.000Z",
          userId: "tester1",
          organizationId: 1,
          sentinelConfigId: 1,
          deviceEui: "0000000000000001",
          level: 2,
          messageEn: "Test message",
          messagePl: "Testowa wiadomość"
        }
      ]
    }
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
      headers: headers
    });
    let data;
    data = await res.json();
    if (res.ok) {
      return { list: data }
    } else {
      throw new Error('error1');
    }
  } catch (e) {
    console.log('getSgxSignals', e)
    throw new Error(e);
  }
}

const getSgxSentinels = async function (devMode, apiUrl, limit, offset, token) {
  if (devMode) {
    return {
      list: [
        {
          id: 1,
          name: "Test sentinel",
          userId: "tester1",
          type: 1,
          organizationId: 1,
          deviceEui: "0000000000000001",
          groupEui: "0000000000000001",
          tagName: "Test tag",
          tagValue: "Test value",
          alertLevel: 1,
          alertMessage: "Test message",
          okMessage: "Testowa wiadomość",
          active: true,
          conditionOkMessage: true,
          everyTime: true,
          team: "",
          administrators: "",
          conditions: []
        },
        {
          id: 2,
          name: "Test sentinel2",
          userId: "tester1",
          type: 1,
          organizationId: 1,
          sentinelConfigId: 1,
          deviceEui: "0000000000000001",
          groupEui: "0000000000000001",
          tagName: "Test tag",
          tagValue: "Test value",
          alertLevel: 1,
          alertMessage: "Test message",
          okMessage: "Testowa wiadomość",
          active: true,
          conditionOkMessage: true,
          everyTime: true,
          team: "",
          administrators: "",
          conditions: []
        }
      ]
    }
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
      headers: headers
    });
    let data;
    data = await res.json();
    if (res.ok) {
      return { list: data }
    } else {
      throw new Error('error1');
    }
  } catch (e) {
    console.log('getSgxSentinels', e)
    throw new Error(e);
  }
}

const getSgxSentinel = async function (devMode, apiUrl, token, transform) {
  if (devMode) {
    return {
      sentinel:
      {
        id: 1,
        name: "Test sentinel",
        userId: "tester1",
        type: 1,
        organizationId: 1,
        deviceEui: "0000000000000001",
        groupEui: "0000000000000001",
        tagName: "Test tag",
        tagValue: "Test value",
        alertLevel: 1,
        alertMessage: "Test message",
        okMessage: "Testowa wiadomość",
        active: true,
        conditionOkMessage: true,
        everyTime: true,
        team: "",
        administrators: "",
        conditions: []
      }
    }
  }
  try {
    const headers = new Headers()
    headers.set('Accept', 'application/json');
    headers.set('Authentication', token);
    let endpoint = apiUrl;
    const res = await fetch(endpoint, {
      headers: headers
    });
    let data;
    data = await res.json();
    if (res.ok) {
      return { sentinel: data }
    } else {
      throw new Error('error1');
    }
  } catch (e) {
    console.log('getSgxSentinels', e)
    throw new Error(e);
  }
}

export default sgxsentinel;