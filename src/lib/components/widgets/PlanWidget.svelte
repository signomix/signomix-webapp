<div class="p-1 w-100 overflow-auto">
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-center">
        <div class="col-12 mt-1" id={parentId}>
            {#await promise}
            <div class="spinner-border spinner-border-sm" role="status"></div>
            {:then data}
            {@html getPlan(data)}
            {:catch error}
            {#if !front}
            <p style="color: red">{error.message}</p>
            {/if}
            {/await}
        </div>
    </div>
</div>
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { widgets, transformData } from '$lib/widgets.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';

    export let index
    export let config
    export let filter
    let parentId = 'widget' + index

    let errorMessage = '';
    let apiUrl = utils.getBackendUrl(location) + '/api/reports/single/'
    let promise = sgxdata.getReportData(dev, apiUrl, config, filter, $token, transformData)
    let front = true;
    let scalling = 1
    let measureNames = []
    let measureNamesTranslated = []
    let first = false

    /*     onMount((async) => {
            scalling = getScalling()
            show()
            first = true
        }); */
    afterUpdate(() => {
        promise = sgxdata.getReportData(dev, apiUrl, config, filter, $token, transformData)
        /* if(!first){
            scalling = getScalling()
            show()
        }
        first = false */
    });
    function getMeasureNames(data) {
        measureNames = data.headers[0].columns
        if (config.channel_translated != undefined && config.channel_translated != null && config.channel_translated != '') {
            measureNamesTranslated = config.channel_translated.split(',')
        } else {
            measureNamesTranslated = measureNames
        }
    }
    function getScalling() {
        let w = document.getElementById(parentId).clientWidth
        let h = document.getElementById(parentId).clientHeight
        let sw = 1000
        let sh = 1000
        let ws = w / sw
        let hs = h / sh
        //console.log('getScalling()', w, h, sw, sh, ws, hs)
        //return ws < hs ? ws : hs
        return ws
    }
    async function show() {
        /* try {
            console.log('show()')
            apiUrl = utils.getBackendUrl(location) + '/api/reports/single/'
            promise = await sgxdata.getReportData(dev, apiUrl, config, filter, $token, transformData)
                .then(
                    (jsonData) => {
                        return jsonData
                    }
                )
        } catch (error) {
            console.log('show() error', error)
            errorMessage = error.message;
        } */
    }

    function recalculate(value) {
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function switchView() {
        front = !front;
    }

    function getPlan(data, description) {
        //console.log('getPlan()', data)
        scalling = getScalling()
        getMeasureNames(data)
        let svgDef = config.description
        if (svgDef == undefined || svgDef == null || svgDef == '') {
            svgDef = getEmptyPlan(0, 0, scalling, '', '')
        }
        let devs = '';
        if (data == undefined || data.datasets.length == 0) {
            svgDef = getEmptyPlan(0, 0, scalling, '', 'no data found')
            return svgDef + '</svg>'
        }
        //svg will be scaled and moved properly only if starting svg width equals 1000
        let pd = svgDef
        //let radius = 5 / scalling
        //var radius=self.getRemValue()/2;
        let radius = 5
        pd = pd.substring(0, pd.length - 6);

        let cTemplate = '<circle cx="_x" cy="_y" r="' + radius + '" stroke="black" stroke-width="1" fill="_c"/>'
        let oneDev
        let location
        for (let i = 0; i < data.datasets.length; i++) {
            console.log('data.datasets[i]', data.datasets[i])
            oneDev = cTemplate
            location = getLatLon(data.datasets[i].data[0].values, data.headers[i].columns)
            if (location.lat == null || location.lon == null) {
                continue
            }
            oneDev = oneDev.replace('_x', location.lat) // x coordinate
            oneDev = oneDev.replace('_y', location.lon) // y coordinate
            oneDev = oneDev.replace('_c', getMarkerColor(data.datasets[i].data[0].values, data.headers[i].columns))
            devs = devs + oneDev + getNameplate(location.lat + radius + 1, location.lon + radius / 2 + 1, scalling, data.datasets[i].eui, data.datasets[i].data[0].values, data.headers[i].columns)
        }

        pd = pd + devs + '</svg>'

        return pd
    }

    let getRemValue = function (scalling) {
        //console.log('getRemValue() scalling', scalling)
        let fontSize = getFontSize(scalling);
        let result = fontSize * scalling; // / scalling;
        //console.log('getRemValue()', result)
        return result;
    }
    let getFontSize = function (scalling) {
        let fontSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));
        let result = Math.ceil(fontSize * scalling * 1.0); // / scalling;
        if(result<11){
            result = 11
        }
        if(result>12){
            result = 12
        }
        //console.log('getFontSize()', result)
        return result;
    }

    /**
     * Get the latitude and longitude indexes from the data
     * @param values
     * @param columns
     * @returns {lan, lon}
     */
    function getLatLon(values, columns) {
        let latitude = 0
        let longitude = 0
        //console.log('getLatLon() columns', columns)
        try {
            let latIdx = columns.indexOf('latitude')
            let lonIdx = columns.indexOf('longitude')
            /*             console.log('latIdx', latIdx)
                        console.log('lonIdx', lonIdx)
                        console.log('latValue', values[latIdx])
                        console.log('lonValue', values[lonIdx]) */
            latitude = parseFloat(values[latIdx])
            longitude = parseFloat(values[lonIdx])
        } catch (e) {
            console.log('getLatLon() error', e)
        }
        return { lat: latitude, lon: longitude }
    }

    let getDeviceLocation = function (data) {
        let location = { x: null, y: null }
        for (let i = 0; i < data[0].length; i++) {
            if (data[0][i] == null || data[0][i] == undefined) {
                continue
            }
            if (data[0][i].name == 'latitude') {
                location.x = data[0][i].value
            } else if (data[0][i].name == 'longitude') {
                location.y = data[0][i].value
            }
        }
        return location
    }

    let getEmptyMessage = function (x, y, scaling, name, message) {
        let fontSize = getFontSize(scaling)
        let remValue = getRemValue();
        let lineHeigth = remValue * 1.0 // * fontSize
        let fontWidth = 0.6 * remValue
        let padding = 0.5 * fontWidth
        //let height = lineHeigth * (1 + measureNamesTranslated.length) + lineHeigth / 2
        //let width = 10 * fontWidth
        let text = '<text x="' + (x + padding) + '" y="' + (y + lineHeigth) + '" style="fill:darkblue;font-family:monospace;font-size:' + fontSize + 'px;">' + message + ' ' + name
        return text + '</text>'
    }

    /**
     * Get the nameplate for the device
     * Display the name and the measure values. The measure names translations are used if available.
     * The latitude and longitude are not displayed.
     * @param x
     * @param y
     * @param scaling
     * @param name
     * @param values
     * @param headers
     * @returns {string}
     */
    let getNameplate = function (x, y, scaling, name, values, headers) {
        //console.log('getNameplate()')
        let fontSize = getFontSize(scaling)
        let remValue = getRemValue(scalling);
        //let lineHeigth = remValue * 1.2 // * fontSize
        let lineHeigth = fontSize * 1.5
        //let fontWidth = 0.6 * remValue
        let fontWidth = fontSize * 0.6
        let padding = 1.0 * fontSize
        
        let width = 0; //20 * fontWidth
        let measureName

        let numberOfRows = headers.length + 1 // name + measures
        if(headers.indexOf('latitude'<-1)){
            numberOfRows = numberOfRows - 1
        }
        if(headers.indexOf('longitude'<-1)){
            numberOfRows = numberOfRows - 1
        }
        // calculate height
        let height = lineHeigth * (numberOfRows) + padding
        // calculate width
        for (let i = 0; i < headers.length; i++) {
            //console.log('measureNamesTranslated', measureNamesTranslated)
            if (i < measureNamesTranslated.length) {
                measureName = measureNamesTranslated[i]
            } else {
                measureName = headers[i]
            }
            if(measureName == 'latitude' || measureName == 'longitude' || values[i] == null){
                continue
            }
            let tmpWidth=(measureName+': '+values[i]).length * fontWidth+2*padding
            if(tmpWidth>width){
                width=tmpWidth
            }
        }
        let text = '<rect width="' + width + '" height="' + height + '" x="' + x + '" y="' + y + '" style="fill:rgb(250,250,250);stroke-width:1;stroke:#909090" />'
        text = text + '<text x="' + (x + padding) + '" y="' + (y + padding/4 + lineHeigth) + '" style="fill:darkblue;font-family:monospace;font-size: '+fontSize+'px;">[ ' + name + ' ]'
        let rowNumber = 0
        for (let i = 0; i < headers.length; i++) {
            if (i < measureNamesTranslated.length) {
                measureName = measureNamesTranslated[i]
            } else {
                measureName = headers[i]
            }
            if(measureName == 'latitude' || measureName == 'longitude' || values[i] == null){
                continue
            }
            let l = '<tspan x="_x" y="_y">_label: _v</tspan>'
            l = l.replace('_x', (x + padding))
            l = l.replace('_y', y + padding/4 + lineHeigth * (rowNumber + 2))
            l = l.replace('_label', measureName)
            l = l.replace('_v', values[i])
            text = text + l
            rowNumber++
        }
        return text + '</text>'
    }

    let getMarkerColor = function (values, headers) {
        let result = 'lightblue'
        if (!self.calcAlert) {
            return result
        }
        //get value index from rangeName
        let columnName = config.rangeName || ''
        let valueIndex = headers.indexOf(columnName)

        if (valueIndex == -1) {
            return result
        }
        // get color for alert level
        let value = values[valueIndex]
        var lv = getAlertLevel(self.range, value)
        switch (lv) {
            case 0:
                result = 'green'
                break
            case 1:
                result = 'yellow'
                break
            case 2:
                result = 'red'
                break
        }
        return result;
    }

    function getEmptyPlan() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">'
            + '<rect x="0" y="0" width="1000" height="500" fill="none" stroke="black" stroke-width="1" />'
            + '<text x="20" y="100" style="font: 24px sans-serif">definition not set</text>'
        //+ '</svg>'
    }


</script>