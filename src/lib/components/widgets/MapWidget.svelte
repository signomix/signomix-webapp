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

    //let first = false
    onMount(() => {
        console.log('index', index)
        showMyMap()
    });

    onDestroy(async () => {
        if (map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });


    function showMyMap(){
        map = L.map(getMapElementId()).setView([51.73724466828256, 19.44138748417409], zoom);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
    }

    async function show() {
        try {
            let promise = await sgxdata.getData(dev, apiUrl, config, filter, $token, transform)
                .then(
                    (jsonData) => {
                        if (jsonData != null) {
                            console.log('jsonData', jsonData)
                            //showMap(jsonData)
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

    function showMap(jsonData) {
        console.log('showMap', jsonData)
        let lat = 0
        let lon = 0
        let zoom = 15

        if (jsonData.length == 0 || jsonData[0].length < 1) {
            return
        }
        let p1 = self.jsonData[0][0]['name'].toLowerCase()
        let p2 = self.jsonData[0][1]['name'].toLowerCase()
        let lonFirst = false
        if ((p2 == 'latitude' && p1 == 'longitude') || (p2 == 'lat' && p1 == 'lon')) {
            lonFirst = true
        }
        if (lonFirst) {
            lat = parseFloat(jsonData[jsonData.length - 1][1]['value'])
            lon = parseFloat(jsonData[jsonData.length - 1][0]['value'])
        } else {
            lat = parseFloat(jsonData[jsonData.length - 1][0]['value'])
            lon = parseFloat(jsonData[jsonData.length - 1][1]['value'])
        }
        //TODO getSelectedLocale()
        self.measureDate = new Date(jsonData[jsonData.length - 1][0]['timestamp']).toLocaleString(getSelectedLocale())


        map = L.map(getMapElementId())
        map.setView([lat, lon], zoom)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        let polyline = null
        let marker = null
        try {
            marker = L.marker([lat, lon])
            marker.setPopupContent(lat + ',' + lon)
            marker.addTo(map);
        } catch (err) {
            console.log(err)
        }
        if (jsonData.length > 0) {
            let tmpLat, tmpLon
            let latlngs = []
            for (i = 0; i < jsonData.length; i++) {
                if (lonFirst) {
                    tmpLat = parseFloat(jsonData[i][1]['value'])
                    tmpLon = parseFloat(jsonData[i][0]['value'])
                } else {
                    tmpLat = parseFloat(jsonData[i][0]['value'])
                    tmpLon = parseFloat(jsonData[i][1]['value'])
                }
                if (!(isNaN(tmpLat) || isNaN(tmpLon))) {
                    latlngs.push([tmpLat, tmpLon])
                }
            }
            polyline = L.polyline(latlngs, {
                color: '#0095FF'
            }).addTo(map);
            // zoom the map to the polyline
            map.fitBounds(polyline.getBounds());
        }
    }
</script>
<div class="p-1 pt-2 w-100" id={getMapElementId()}>
    
</div>