<script>
    import {
        token,
        profile,
        language,
        isAuthenticated,
    } from "$lib/usersession.js";
    import { utils } from "$lib/utils.js";
    import { sgxdata } from "$lib/sgxdata.js";
    import { sgxhelper } from "$lib/sgxhelper.js";
    import { dev } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { afterUpdate } from "svelte";

    export let index;
    export let config;
    export let filter;

    let errorMessage = "";
    let apiUrl; //= utils.getBackendUrl(location) + '/api/provider/v2/device/'

    let mapElement;
    let map;
    let zoom = 13;
    let idxLatLon = { lat: 0, lon: 1 };
    const _latitude = "latitude";
    const _longitude = "longitude";

    var calcAlert = false;
    let rangeName = "";

    onMount(() => {
        show();
    });

    onDestroy(async () => {
        if (map != undefined && map != null) {
            //console.log('Unloading Leaflet map.');
            map.remove();
        }
    });

    afterUpdate(() => {
        show();
    });

    function show() {
        try {
            let promise;
            if (
                config.query != undefined &&
                config.query != null &&
                (config.query.toLowerCase().includes("class") ||
                    config.query.toLowerCase().includes("report"))
            ) {
                //console.log('GROUP MAP 1')
                apiUrl = utils.getBackendUrl(location) + "/api/reports/single/";
                promise = sgxdata
                    .getReportData(
                        dev,
                        apiUrl,
                        config,
                        filter,
                        $token,
                        transformData,
                    )
                    .then((jsonData) => {
                        if (jsonData != null) {
                            //console.log('groupmap jsonData', jsonData)
                            showMap(jsonData);
                        }
                    });
            } else {
                //console.log('GROUP MAP 2')
                apiUrl = utils.getBackendUrl(location) + "/api/provider/group/";
                promise = sgxdata
                    .getGroupData(
                        dev,
                        apiUrl,
                        config,
                        filter,
                        $token,
                        transformData,
                    )
                    .then((jsonData) => {
                        if (jsonData != null) {
                            //console.log('groupmap jsonData', jsonData)
                            showMap(jsonData);
                        }
                    });
            }
        } catch (error) {
            errorMessage = error.message;
            console.log("GROUP MAP error", errorMessage);
        }

        return null;
    }

    async function transformData(config, rawData) {
        let isGroup =
            config.group != undefined &&
            config.group != null &&
            config.group != "";
        let jsonData = await rawData;
        //console.log('RAW DATA', jsonData)
        //let isGroupQuery = isGroupQuery(jsonData)

        // data from report server is already in the correct format
        if (jsonData.datasets !== undefined && jsonData.datasets !== null) {
            //console.log('DATA FROM REPORT SERVER')
            //console.log('GROUP REPORT', isGroupQuery)
            return jsonData;
        } else {
            //console.log('DATA FROM SIGNOMIX-TA-PROVIDER')
        }

        // data from signomix-ta-provider must be transformed
        /*         console.log('STANDARD DATA')
        console.log('GROUP REPORT', isGroup) */
        let reportResult = {
            status: 200,
            title: "",
            description: "",
            content: "",
            contentType: "application/json",
            id: -1,
            created: "",
            datasets: [],
            headers: [],
            queries: {
                default: {
                    group: "",
                    className: "",
                },
            },
        };
        if (jsonData.length == 0) {
            reportResult.errorMessage = "No data available";
            return reportResult;
        }
        if (!isGroup) {
            reportResult.datasets.push({
                size: jsonData[0].length,
                name: "dataset0",
                eui: jsonData[0][0].deviceEUI,
                data: [],
            });
            reportResult.headers.push({
                columns: [],
                name: "dataset0",
            });
            try {
                for (let i = 0; i < jsonData[0].length; i++) {
                    reportResult.headers[0].columns.push(jsonData[0][i].name);
                }
            } catch (e) {
                console.log("error", e);
            }
            for (let i = 0; i < jsonData.length; i++) {
                reportResult.datasets[0].data.push({
                    timestamp: jsonData[i][0].timestamp,
                    values: [],
                });
                for (let j = 0; j < jsonData[i].length; j++) {
                    reportResult.datasets[0].data[i].values.push(
                        jsonData[i][j].value,
                    );
                }
            }
        } else {
            for (let i = 0; i < jsonData.length; i++) {
                reportResult.datasets.push({
                    size: jsonData[i][0].length,
                    name: "dataset" + i,
                    eui: jsonData[i][0][0].deviceEUI,
                    data: [],
                });
                reportResult.headers.push({
                    columns: [],
                    name: "dataset" + i,
                });
                for (let j = 0; j < jsonData[i][0].length; j++) {
                    reportResult.headers[i].columns.push(
                        jsonData[i][0][j].name,
                    );
                }
                for (let j = 0; j < jsonData[i].length; j++) {
                    reportResult.datasets[i].data.push({
                        timestamp: jsonData[i][j][0].timestamp,
                        values: [],
                    });
                    for (let k = 0; k < jsonData[i][j].length; k++) {
                        reportResult.datasets[i].data[j].values.push(
                            jsonData[i][j][k].value,
                        );
                    }
                }
            }
        }
        //console.log('REPORT RESULT', reportResult)
        return reportResult;
    }

    function toLocaleTimeStringSupportsLocales() {
        try {
            new Date().toLocaleTimeString("i");
        } catch (e) {
            return e.name === "RangeError";
        }
        return false;
    }
    function getChannelNameTranslated(names, index, channelName) {
        if (names.length > index) {
            return names[index];
        } else {
            return channelName;
        }
    }
    function getMapElementId() {
        return "map" + index;
    }
    function getSelectedLocale() {
        return $language + "-" + $language.toUpperCase();
    }

    /**
     * Get marker's popup content
     * @param dataElement
     */
    function getDataTable(eui, values, columns, withHeader) {
        let table = ""; // '<div style="width:200px;">'
        let valueName;
        // device EUI
        table += '<div class="row g-0" style="width:200px;">';
        table += '<div class="border col-12 txt p-1"><b>' + eui + "</b></div>";
        table += "</div>";
        // header
        if (withHeader) {
            table += '<div class="row g-0" style="width:200px;">';
            table +=
                '<div class="txt border col-6 p-1">' +
                utils.getLabel("measurement", labels, $language) +
                '</div><div class="txt border col-6 p-1">' +
                utils.getLabel("value", labels, $language) +
                "</div>";
            table += "</div>";
        }
        // measurements
        for (let j = 0; j < columns.length; j++) {
            if (values[j] == undefined || values[j] == null) {
                continue;
            }
            //don't show lat and lon
            if (columns[j] == _latitude || columns[j] == _longitude) {
                continue;
            }
            table += '<div class="row g-0" style="width:200px;">';
            table +=
                '<div class="border col-6 txt p-1">' + columns[j] + "</div>";
            table +=
                '<div class="border col-6 value p-1 text-start">' +
                sgxhelper.getRounded(values[j], config.rounding) +
                "</div>";
            table += "</div>";
        }
        //
        return table;
    }

    /**
     * Get the latitude and longitude indexes from the data
     */
    function getLatLonIdx(columns) {
        //let latitude = 0
        //let longitude = 0
        let latIdx = 0;
        let lonIdx = 1;
        try {
            latIdx = columns.indexOf(_latitude);
            lonIdx = columns.indexOf(_longitude);
            //latitude = parseFloat(values[latIdx])
            //longitude = parseFloat(values[lonIdx])
        } catch (e) {
            console.log("getLatLonIdx() error", e);
        }
        return { lat: latIdx, lon: lonIdx };
    }

    function showMap(jsonData) {
        let lat = 0;
        let lon = 0;
        let zoom = 15;

        if (
            jsonData.datasets.length == 0 ||
            jsonData.datasets[0].data == undefined ||
            jsonData.datasets[0].data == null ||
            jsonData.datasets[0].data.length < 1
        ) {
            return;
        }

        let borderColors = [
            'rgb(54, 162, 235)', //blue
            'rgb(255, 99, 132)', //red
            'rgb(75, 192, 192)', //green
            'rgb(255, 159, 64)', //orange
            'rgb(153, 102, 255)', //purple
            'rgb(255, 205, 86)', //yellow
            'rgb(201, 203, 207)'//grey
        ]
        let customConfig = null;
        if (config.config !== null && config.config !== undefined) {
            try {
                customConfig = JSON.parse(config.config)
                if (customConfig.colors !== null && customConfig.colors !== undefined) {
                    borderColors = customConfig.colors
                }
            } catch (err) {
                console.log('TracksWidget - error parsing customConfig', err)
            }
        }
        //let lastDataPosition = jsonData.datasets[0].data.length - 1
        idxLatLon = getLatLonIdx(jsonData.headers[0].columns);
        /* for (let i = jsonData.datasets[0].data.length - 1; i >= 0; i--) {
            if (jsonData.datasets[0].data[i].values[idxLatLon.lat] != null && jsonData.datasets[0].data[i].values[idxLatLon.lon] != null) {
                lat = parseFloat(jsonData.datasets[0].data[i].values[idxLatLon.lat])
                lon = parseFloat(jsonData.datasets[0].data[i].values[idxLatLon.lon])
                lastDataPosition = i
                break
            }
        } */

        if (map != undefined && map != null) {
            map.remove();
        }
        map = L.map(getMapElementId());
        //map.setView([lat, lon], zoom)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        let polyline = null;
        let marker = null;
        let popupOptions = {
            maxWidth: 200,
            maxHeight: 200,
        };
        let markerOptions = {};
        let markerArray = []

        let tmpLat, tmpLon;
        for (let t = 0; t < jsonData.datasets.length; t++) {
            let latlngs = [];
            for (let i = 0; i < jsonData.datasets[t].data.length; i++) {
                tmpLat = parseFloat(
                    jsonData.datasets[t].data[i].values[idxLatLon.lat],
                );
                tmpLon = parseFloat(
                    jsonData.datasets[t].data[i].values[idxLatLon.lon],
                );
                if (!(isNaN(tmpLat) || isNaN(tmpLon))) {
                    latlngs.push([tmpLat, tmpLon]);
                } else {
                    //skip if lat or lon is not a number
                    continue;
                }
                if (i > 0) {
                    try {
                        marker = new L.CircleMarker(L.latLng(tmpLat, tmpLon), {
                            radius: 5,
                            stroke: true,
                            color: "black",
                            opacity: 1,
                            weight: 1,
                            fill: true,
                            fillColor: "gray",
                            fillOpacity: 0.5,
                        });
                        markerArray.push(marker)
                        marker
                            .bindPopup(
                                getDataTable(
                                    jsonData.datasets[t].eui,
                                    jsonData.datasets[t].data[i].values,
                                    jsonData.headers[t].columns,
                                    false,
                                ),
                                popupOptions,
                            )
                            .openPopup();
                        marker.addTo(map);
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    try {
                        marker = L.marker([tmpLat, tmpLon]);
                        markerArray.push(marker)
                        marker
                            .bindPopup(
                                getDataTable(
                                    jsonData.datasets[t].eui,
                                    jsonData.datasets[t].data[i].values,
                                    jsonData.headers[t].columns,
                                    false,
                                ),
                                popupOptions,
                            )
                            .openPopup();
                        marker.addTo(map);
                    } catch (err) {
                        console.log(err);
                    }
                }
                console.log("marker" + i);
            }
            polyline = L.polyline(latlngs, {
                color: borderColors[(t % 7)],
            }).addTo(map);
            // zoom the map to the polyline
        }
        //map.fitBounds(allPolylines.getBounds());
        let group = L.featureGroup(markerArray).addTo(map);
        map.fitBounds(group.getBounds());
    }

    function getMarkerColor(
        timestamp,
        values,
        headers,
        calcAlert,
        rangeName,
        range,
    ) {
        let result = "green";
        if (!calcAlert) {
            return result;
        }
        let valueIndex = headers.indexOf(rangeName);
        if (valueIndex < 0) {
            return result;
        }
        switch (sgxhelper.getAlertLevel(range, values[valueIndex], timestamp)) {
            case 1:
                result = "yellow";
                break;
            case 2:
                result = "red";
                break;
            case 3:
                result = "grey";
                break;
        }
        return result;
    }

    let labels = {
        measurement: {
            pl: "Pomiar",
            en: "Measurement",
        },
        value: {
            pl: "Wartość",
            en: "Value",
        },
    };
</script>

<div class="p-1 pt-2 w-100" id={getMapElementId()}></div>

<style>
    .txt {
        font-size: 0.6rem;
    }

    .value {
        font-size: 0.6rem;
    }
</style>
