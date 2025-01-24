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
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'

    let mapElement;
    let map;
    let zoom = 13
    let idxLatLon = { lat: 0, lon: 1 }
    const _latitude = 'latitude'
    const _longitude = 'longitude'


    //let first = false
    onMount(() => {
        show()
    });

    onDestroy(async () => {
        if (map != undefined && map != null) {
            //console.log('Unloading Leaflet map.');
            map.remove();
        }
    });

    afterUpdate(() => {
        show()
    });


    function show() {
        try {
            let promise
            if (config.query != undefined && config.query != null && (config.query.toLowerCase().includes('class') || config.query.toLowerCase().includes('report'))) {
                //console.log('GROUP MAP 1')
                apiUrl = utils.getBackendUrl(location) + '/api/reports/single/'
                promise = sgxdata.getReportData(dev, apiUrl, config, filter, $token, transformData)
                    .then(
                        (jsonData) => {
                            if (jsonData != null) {
                                //console.log('groupmap jsonData', jsonData)
                                showMap(jsonData)
                            }
                        }
                    )
            } else {
                //console.log('GROUP MAP 2')
                apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'
                promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token, transformData)
                    .then(
                        (jsonData) => {
                            if (jsonData != null) {
                                //console.log('groupmap jsonData', jsonData)
                                showMap(jsonData)
                            }
                        }
                    )
            }
        } catch (error) {
            errorMessage = error.message;
            console.log('GROUP MAP error', errorMessage);
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
     * @param jsonData
     */
    function getDataTable(jsonData, dataPosition, withHeader) {
        let table = '' // '<div style="width:200px;">'
        // device EUI
        table += '<div class="row g-0" style="width:200px;">'
        table += '<div class="border col-12 txt p-1"><b>' + jsonData[0][0]['deviceEUI'] + '</b></div>'
        table += '</div>'
        if (withHeader) {
            table += '<div class="row g-0" style="width:200px;">'
            table += '<div class="txt border col-6 p-1">'
                + utils.getLabel('measurement', labels, $language) + '</div><div class="txt border col-6 p-1">'
                + utils.getLabel('value', labels, $language) + '</div>'
            table += '</div>'
        }
        for (let j = 0; j < jsonData[dataPosition].length; j++) {
            //don't show lat and lon
            if (j == idxLatLon.lat || j == idxLatLon.lon) {
                continue
            }
            table += '<div class="row g-0" style="width:200px;">'
            table += '<div class="border col-6 txt p-1">' + jsonData[dataPosition][j]['name'] + '</div>'
            table += '<div class="border col-6 value p-1 text-start">' + jsonData[dataPosition][j]['value'] + '</div>'
            table += '</div>'
        }
        return table
    }

    /**
     * Get the latitude and longitude indexes from the data
     * @param jsonData
     * @returns {lan, lon}
     */
    function getLatLonIndexes(jsonData) {
        let latIndex = 0
        let lonIndex = 1
        for (let i = 0; i < jsonData[0].length; i++) {
            if (jsonData[0][i]['name'].toLowerCase() == _latitude) {
                latIndex = i
            }
            if (jsonData[0][i]['name'].toLowerCase() == _longitude) {
                lonIndex = i
            }
        }
        return { lat: latIndex, lon: lonIndex }
    }


    function showMap(jsonData) {
        //TODO: handle case when there is no data (all values in jsonData are null)
        //console.log('showMap', jsonData)
        let lat = 0
        let lon = 0
        let zoom = 15
        let lastDataPosition = jsonData.length - 1

        if (jsonData.length == 0 || jsonData[0].length < 1) {
            return
        }
        for(let i=jsonData.length - 1; i>=0; i--){
            if(jsonData[i][idxLatLon.lat]['value'] != null && jsonData[i][idxLatLon.lon]['value'] != null){
                lat = parseFloat(jsonData[i][idxLatLon.lat]['value'])
                lon = parseFloat(jsonData[i][idxLatLon.lon]['value'])
                lastDataPosition = i
                break
            }
        }
/*         lat = parseFloat(jsonData[jsonData.length - 1][idxLatLon.lat]['value'])
        lon = parseFloat(jsonData[jsonData.length - 1][idxLatLon.lon]['value']) */

        //TODO getSelectedLocale()
        //self.measureDate = new Date(jsonData[jsonData.length - 1][0]['timestamp']).toLocaleString(getSelectedLocale())


        if (map != undefined && map != null) {
            map.remove()
        }
        map = L.map(getMapElementId())
        map.setView([lat, lon], zoom)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        let polyline = null
        let marker = null
        let popupOptions = {
            maxWidth: 200,
            maxHeight: 200,
        }
        let markerOptions = {

        }
        try {
            marker = L.marker([lat, lon])
            marker.bindPopup(getDataTable(jsonData, lastDataPosition, false), popupOptions).openPopup()
            marker.addTo(map);
        } catch (err) {
            console.log(err)
        }
        let first = true;
        if (jsonData.length > 0) {
            let tmpLat, tmpLon
            let latlngs = []
            for (let i = 0; i < jsonData.length; i++) {
                tmpLat = parseFloat(jsonData[i][idxLatLon.lat]['value'])
                tmpLon = parseFloat(jsonData[i][idxLatLon.lon]['value'])
                if (!(isNaN(tmpLat) || isNaN(tmpLon))) {
                    latlngs.push([tmpLat, tmpLon])
                }else{
                    //skip if lat or lon is not a number
                    continue
                }
                if (first) {
                    first = false
                    marker = new L.CircleMarker(L.latLng(tmpLat, tmpLon), {
                        radius: 4,
                        stroke: true,
                        color: 'black',
                        opacity: 1,
                        weight: 1,
                        fill: true,
                        fillColor: 'gray',
                        fillOpacity: 0.5
                    })
                    marker.addTo(map);
                }
            }
            polyline = L.polyline(latlngs, {
                color: '#0095FF'
            }).addTo(map);
            // zoom the map to the polyline
            map.fitBounds(polyline.getBounds());
        }
    }

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