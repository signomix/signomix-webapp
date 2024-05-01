<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { afterUpdate } from 'svelte';

    export let index
    export let config
    export let filter

    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'

    let mapElement;
    let map;
    let zoom = 13
    let idxLatLon = { lat: 0, lon: 1 }
    const _latitude = 'latitude'
    const _longitude = 'longitude'

    var calcAlert = false
    let rangeName = ''

    //let first = false
    onMount(() => {
        show()
    });

    onDestroy(async () => {
        if (map != undefined && map != null) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });

    afterUpdate(() => {
        show()
    });


    function show() {
        try {
            let promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token, transform)
                .then(
                    (jsonData) => {
                        if (jsonData != null) {
                            console.log('groupmap jsonData', jsonData)
                            showMap(jsonData)
                        }
                    }
                )
        } catch (error) {
            errorMessage = error.message;
            console.log('error', errorMessage);
        }
        return null
    }

    async function transform(widgetConfig, rawData) {
        return rawData
    }

    function toLocaleTimeStringSupportsLocales() {
        try {
            new Date().toLocaleTimeString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }
        return false;
    }
    function getChannelNameTranslated(names, index, channelName) {
        if (names.length > index) {
            return names[index]
        } else {
            return channelName
        }
    }
    function getMapElementId() {
        return 'map' + index
    }
    function getSelectedLocale() {
        return $language + '-' + $language.toUpperCase()
    }

    /**
     * Get marker's popup content
     * @param dataElement
     */
    function getDataTable(dataElement, withHeader) {
        let table = '' // '<div style="width:200px;">'
        let valueName
        // device EUI
        table += '<div class="row g-0" style="width:200px;">'
        table += '<div class="border col-12 txt p-1"><b>' + dataElement[0]['deviceEUI'] + '</b></div>'
        table += '</div>'
        // header
        if (withHeader) {
            table += '<div class="row g-0" style="width:200px;">'
            table += '<div class="txt border col-6 p-1">'
                + utils.getLabel('measurement', labels, $language) + '</div><div class="txt border col-6 p-1">'
                + utils.getLabel('value', labels, $language) + '</div>'
            table += '</div>'
        }
        // measurements
        for (let j = 0; j < dataElement.length; j++) {
            //don't show lat and lon
            valueName = dataElement[j]['name'].toLowerCase()
            if (valueName == _latitude || valueName == _longitude) {
                continue
            }
            table += '<div class="row g-0" style="width:200px;">'
            table += '<div class="border col-6 txt p-1">' + dataElement[j]['name'] + '</div>'
            table += '<div class="border col-6 value p-1 text-start">' + sgxhelper.getRounded(dataElement[j]['value'],config.rounding) + '</div>'
            table += '</div>'
        }
        //
        return table
    }

    /**
     * Get the latitude and longitude indexes from the data
     * @param jsonData
     * @returns {lan, lon}
     */
    function getLatLon(dataElement) {
        let latitude = 0
        let longitude = 0
        console.log('getLatLon', dataElement)
        for (let i = 0; i < dataElement.length; i++) {
            console.log('element', i, dataElement[i])
            if (dataElement[i]['name'].toLowerCase() == _latitude) {
                latitude = parseFloat(dataElement[i]['value'])
            }
            if (dataElement[i]['name'].toLowerCase() == _longitude) {
                longitude = parseFloat(dataElement[i]['value'])
            }
        }
        return { lat: latitude, lon: longitude }
    }


    function showMap(jsonData) {
        console.log('showMap', jsonData)
        let lat = 0
        let lon = 0
        let zoom = 15

        if (jsonData.length == 0 || jsonData[0].length < 1) {
            return
        }

        //TODO getSelectedLocale()
        //self.measureDate = new Date(jsonData[jsonData.length - 1][0]['timestamp']).toLocaleString(getSelectedLocale())

        if (map != undefined && map != null) {
            map.remove()
        }
        map = L.map(getMapElementId())
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //let polyline = null
        let marker = null
        let popupOptions = {
            maxWidth: 200,
            maxHeight: 200,
        }
        let markerOptions = {

        }
        // marker colors
        let calcAlert = (config.range != '' && config.range.indexOf('@') > 0)
        let rangeName = ''
        if (calcAlert) {
            rangeName = config.range.substring(config.range.indexOf('@') + 1)
        }
        let location;
        let markerArray = []
        for (let i = 0; i < jsonData.length; i++) {
            try {
                location = getLatLon(jsonData[i][0])
                console.log('latlngs', location)
                //marker = L.marker(location)
                marker = new L.CircleMarker(L.latLng(location.lat, location.lon), {
                    radius: 10,
                    stroke: true,
                    color: 'black',
                    opacity: 1,
                    weight: 1,
                    fill: true,
                    fillColor: sgxhelper.getMarkerColor(jsonData[i][0], calcAlert, rangeName, config.range),
                    fillOpacity: 0.5
                })

                marker.bindPopup(getDataTable(jsonData[i][0], false), popupOptions).openPopup()
                markerArray.push(marker)
            } catch (err) {
                console.log(err)
            }
        }
        let group = L.featureGroup(markerArray).addTo(map);
        map.fitBounds(group.getBounds());
    }

/*     function getMarkerColor(point, calcAlert, rangeName, range) {
        let result = 'green'
        if (!calcAlert) {
            return result
        }
        for (var i = 0; i < point.length; i++) {
            if (point[i].name == rangeName) {
                switch (sgxhelper.getAlertLevel(range, point[i].value, point[i]['timestamp'])) {
                    case 1:
                        result = 'yellow'
                        break
                    case 2:
                        result = 'red'
                        break
                    case 3:
                        result = 'grey'
                        break
                }
            }
        }
        return result
    } */

    let labels = {
        'measurement': {
            'pl': "Pomiar",
            'en': "Measurement",
        },
        'value': {
            'pl': "Wartość",
            'en': "Value",
        }
    }
</script>
<style>
    .txt {
        font-size: 0.6rem;
    }

    .value {
        font-size: 0.6rem;
    }
</style>
<div class="p-1 pt-2 w-100" id={getMapElementId()}></div>