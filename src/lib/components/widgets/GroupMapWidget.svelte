<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { afterUpdate } from 'svelte';
    import { tileLayerGrayscale } from "$lib/leaflet/TileLayerGrayscale.js";
    import { controlSelect } from "$lib/leaflet/ControlSelect.js";

    export let index
    export let config
    export let filter

    let errorMessage = '';
    let apiUrl //= utils.getBackendUrl(location) + '/api/provider/group/'

    let mapElement;
    let map;
    let zoom = 13
    let idxLatLon = { lat: 0, lon: 1 }
    const _latitude = 'latitude'
    const _longitude = 'longitude'

    var calcAlert = false
    let rangeName = ''

    let colorMode = 0; // 1: grayscale, 0: color, 0: default (color)
    let jsonDataLoaded = null

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
                                jsonDataLoaded = jsonData
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
                                jsonDataLoaded = jsonData
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

    async function transformData(config, rawData) {
        let isGroup = (config.group != undefined && config.group != null && config.group != '')
        let jsonData = await rawData;
        //console.log('RAW DATA', jsonData)
        //let isGroupQuery = isGroupQuery(jsonData)

        // data from report server is already in the correct format
        if (jsonData.datasets !== undefined && jsonData.datasets !== null) {
            //console.log('DATA FROM REPORT SERVER')
            //console.log('GROUP REPORT', isGroupQuery)
            return jsonData
        } else {
            //console.log('DATA FROM SIGNOMIX-TA-PROVIDER')
        }

        // data from signomix-ta-provider must be transformed
/*         console.log('STANDARD DATA')
        console.log('GROUP REPORT', isGroup) */
        let reportResult = {
            'status': 200,
            'title': '',
            'description': '',
            'content': '',
            'contentType': 'application/json',
            'id': -1,
            'created': '',
            'datasets': [],
            'headers': [],
            'queries': {
                'default': {
                    'group': '',
                    'className': ''
                }
            }
        }
        if (jsonData.length == 0) {
            reportResult.errorMessage = 'No data available'
            return reportResult
        }
        if (!isGroup) {
            reportResult.datasets.push({
                'size': jsonData[0].length,
                'name': 'dataset0',
                'eui': jsonData[0][0].deviceEUI,
                'data': []
            })
            reportResult.headers.push({
                'columns': [],
                'name': 'dataset0'
            })
            try {
                for (let i = 0; i < jsonData[0].length; i++) {
                    reportResult.headers[0].columns.push(jsonData[0][i].name)
                }
            } catch (e) {
                console.log('error', e)
            }
            for (let i = 0; i < jsonData.length; i++) {
                reportResult.datasets[0].data.push({
                    'timestamp': jsonData[i][0].timestamp,
                    'values': []
                })
                for (let j = 0; j < jsonData[i].length; j++) {
                    reportResult.datasets[0].data[i].values.push(jsonData[i][j].value)
                }
            }
        } else {
            for (let i = 0; i < jsonData.length; i++) {
                reportResult.datasets.push({
                    'size': jsonData[i][0].length,
                    'name': 'dataset' + i,
                    'eui': jsonData[i][0][0].deviceEUI,
                    'data': []
                })
                reportResult.headers.push({
                    'columns': [],
                    'name': 'dataset' + i
                })
                for (let j = 0; j < jsonData[i][0].length; j++) {
                    reportResult.headers[i].columns.push(jsonData[i][0][j].name)
                }
                for (let j = 0; j < jsonData[i].length; j++) {
                    reportResult.datasets[i].data.push({
                        'timestamp': jsonData[i][j][0].timestamp,
                        'values': []
                    })
                    for (let k = 0; k < jsonData[i][j].length; k++) {
                        reportResult.datasets[i].data[j].values.push(jsonData[i][j][k].value)
                    }
                }
            }
        }
        //console.log('REPORT RESULT', reportResult)
        return reportResult
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
    function getDataTable(eui, values, columns, withHeader) {
        let table = '' // '<div style="width:200px;">'
        let valueName
        // device EUI
        table += '<div class="row g-0" style="width:200px;">'
        table += '<div class="border col-12 txt p-1"><b>' + eui + '</b></div>'
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
        for (let j = 0; j < columns.length; j++) {
            if (values[j] == undefined || values[j] == null) {
                continue
            }
            //don't show lat and lon
            if (columns[j] == _latitude || columns[j] == _longitude) {
                continue
            }
            table += '<div class="row g-0" style="width:200px;">'
            table += '<div class="border col-6 txt p-1">' + columns[j] + '</div>'
            table += '<div class="border col-6 value p-1 text-start">' + sgxhelper.getRounded(values[j], config.rounding) + '</div>'
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
    function getLatLon(values, columns) {
        let latitude = 0
        let longitude = 0
        try {
            let latIdx = columns.indexOf(_latitude)
            let lonIdx = columns.indexOf(_longitude)
/*             console.log('latIdx', latIdx)
            console.log('lonIdx', lonIdx)
            console.log('latValue', values[latIdx])
            console.log('lonValue', values[lonIdx]) */
            latitude = parseFloat(values[latIdx])
            longitude = parseFloat(values[lonIdx])
        } catch (e) {
            //console.log('getLatLon() error', e)
        }
        return { lat: latitude, lon: longitude }
    }


    function showMap(jsonData) {
        //console.log('showMap', jsonData)
        let lat = 0
        let lon = 0
        let zoom = 15

        if (jsonData.datasets.length == 0) {
            return
        }

        //TODO getSelectedLocale()
        //self.measureDate = new Date(jsonData[jsonData.length - 1][0]['timestamp']).toLocaleString(getSelectedLocale())

        if (map != undefined && map != null) {
            map.remove()
        }
        map = L.map(getMapElementId())

        if(colorMode == 1) {
            tileLayerGrayscale(L, "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            })
            .addTo(map);
        } else {
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            })
            .addTo(map); 
        }

        //let polyline = null
        let marker = null
        let popupOptions = {
            maxWidth: 200,
            maxHeight: 200,
        }
        let markerOptions = {

        }
        // marker colors
        let calcAlert = (config.range != undefined && config.range != null && config.range != '' && config.range.indexOf('@') > 0)
        let rangeName = ''
        if (calcAlert && config.range.indexOf('@') > 0) {
            rangeName = config.range.substring(config.range.indexOf('@') + 1)
        }
        let location;
        let markerArray = []
        for (let i = 0; i < jsonData.datasets.length; i++) {
            if (jsonData.datasets[i] == undefined || jsonData.datasets[i] == null || jsonData.datasets[i].data == undefined || jsonData.datasets[i].size < 1) {
                continue
            }
            try {
                location = getLatLon(jsonData.datasets[i].data[0].values, jsonData.headers[i].columns)
                //console.log('latlngs', location)
                //marker = L.marker(location)
                marker = new L.CircleMarker(L.latLng(location.lat, location.lon), {
                    radius: 10,
                    stroke: true,
                    color: 'black',
                    opacity: 1,
                    weight: 1,
                    fill: true,
                    fillColor: getMarkerColor(jsonData.datasets[i].data[0].timestamp, jsonData.datasets[i].data[0].values, jsonData.headers[i].columns, calcAlert, rangeName, config.range), //sgxhelper.getMarkerColor(jsonData.datasets[i].data.values, calcAlert, rangeName, config.range),
                    fillOpacity: 0.5
                })

                marker.bindPopup(getDataTable(jsonData.datasets[i].eui, jsonData.datasets[i].data[0].values, jsonData.headers[i].columns, false), popupOptions).openPopup()
                markerArray.push(marker)
            } catch (err) {
                console.log(err)
            }
        }

        // add control to switch between color and grayscale map
        var items = [
            { label: utils.getLabel("standardMap", labels, $language), value: "color" },
            { label: utils.getLabel("grayscaleMap", labels, $language), value: "grayscale" },
        ];
        controlSelect(L, {
            position: "topleft",
            selectedDefault: items[colorMode].value,
            items: items,
            onSelect: function (newItemValue) {
              controlCallback(newItemValue);
            },
          })
          .addTo(map);

        let group = L.featureGroup(markerArray).addTo(map);
        map.fitBounds(group.getBounds());
    }

    function controlCallback(valueSelected) {
        console.log("control selected", valueSelected);
        switch (valueSelected) {
          case "grayscale":
            colorMode = 1;
            break;
          case "color":
            colorMode = 0;
            break;
          default:
            colorMode = 0;
        }
        showMap(jsonDataLoaded);
    }

    function getMarkerColor(timestamp, values, headers, calcAlert, rangeName, range) {
        let result = 'green'
        if (!calcAlert) {
            return result
        }
        let valueIndex = headers.indexOf(rangeName)
        if (valueIndex < 0) {
            return result
        }
        switch (sgxhelper.getAlertLevel(range, values[valueIndex], timestamp)) {
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
        return result
    }

    let labels = {
        'measurement': {
            'pl': "Pomiar",
            'en': "Measurement",
        },
        'value': {
            'pl': "Wartość",
            'en': "Value",
        },
        grayscaleMap: {
            pl: "Mapa monochromatyczna",
            en: "Grayscale map",
        },
        standardMap: {
            pl: "Mapa standardowa",
            en: "Standard map",
        }
    }
</script>
<style>
    @import "../../leaflet/ControlSelect.css";
    .txt {
        font-size: 0.6rem;
    }

    .value {
        font-size: 0.6rem;
    } 

</style>
<div class="p-1 pt-2 w-100" id={getMapElementId()}></div>