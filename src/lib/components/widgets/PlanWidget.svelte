<div class="p-1 w-100">
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
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';

    export let index
    export let config
    export let filter
    let parentId = 'widget' + index

    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'
    const apiGroupUrl = utils.getBackendUrl(location) + '/api/core/group/'+config.group
    let promise
    let front = true;
    let scalling = 1
    let measureNames = []
    let measureNamesTranslated = []

    onMount(() => {
        getMeasureNames()
        scalling = getScalling()
        show()
    });
    afterUpdate(() => {
        getMeasureNames()
        scalling = getScalling()
        show()
    });
    function getMeasureNames() {
        measureNames = config.channel.split(',')
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
        let sh = 300
        let ws = w / sw
        let hs = h / sh
        return ws < hs ? ws : hs
    }
    function show() {
        try {
            promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token, transform)
                .then(
                    (jsonData) => {
                        sgxdata.getDevices(dev, apiGroupUrl, 'group='+config.group, $token)
                            .then(
                                (groupData) => {
                                    console.log('groupData', groupData)

                                }
                            )
                        return jsonData
                    }
                )
        } catch (error) {
            errorMessage = error.message;
        }
    }
    async function transform(widgetConfig, rawData) {
        return rawData
    }
    function recalculate(value) {
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function switchView() {
        front = !front;
    }

    function getPlan(data, description) {
        console.log('getPlan()', data)
        let svgDef = config.description
        if (svgDef == undefined || svgDef == null || svgDef == '') {
            return emptyPlan()
        }
        if (data == undefined || data == null || data == '') {
            return svgDef
        }
        //svg will be scaled and moved properly only if starting svg width equals 1000
        let pd = svgDef
        let radius = 5 / scalling
        //var radius=self.getRemValue()/2;
        pd = pd.substring(0, pd.length - 6);
        let devs = '';
        let cTemplate = '<circle cx="_x" cy="_y" r="' + radius + '" stroke="black" stroke-width="1" fill="_c"/>'
        let oneDev
        let deviceLocation
        for (let i = 0; i < data.length; i++) {
            console.log('data[i]', data[i])
            oneDev = cTemplate
            deviceLocation = getDeviceLocation(data[i])
            oneDev = oneDev.replace('_x', deviceLocation.x)
            oneDev = oneDev.replace('_y', deviceLocation.y)
            oneDev = oneDev.replace('_c', getMarkerColor(data[i]))
            //devs = devs + oneDev + getNameplate(deviceLocation.x + radius + 10, deviceLocation.y, self.scaling, groups[i].name, data[i])
            devs = devs + oneDev + getNameplate(deviceLocation.x + radius+1, deviceLocation.y+radius/2+1, scalling, data[0][0][0].deviceEUI, data[i])
        }

        pd = pd + devs + '</svg>'

        return pd
    }

    let getRemValue = function () {
        let fontSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));
        let result = fontSize / scalling;
        console.log('getRemValue()', result)
        return result;
    }

    let getDeviceLocation = function (data) {
        let location = { x: 0, y: 0 }
        for(let i=0;i<data[0].length;i++){
            if(data[0][i].name=='latitude'){
                location.x=data[0][i].value
            }else if(data[0][i].name=='longitude'){
                location.y=data[0][i].value
            }
        }
        return location
    }

    let getNameplate = function (x, y, scaling, name, data) {
        console.log('getNameplate()', data)
        let fontSize = 0.5 / scaling
        let remValue = getRemValue();
        let lineHeigth = remValue *0.8 // * fontSize
        let fontWidth = 0.6 * remValue
        let padding = 0.5 * fontWidth
        let height = lineHeigth * (1 + measureNamesTranslated.length)+lineHeigth/2
        let width = 10 * fontWidth
        let text = '<rect width="' + width + '" height="' + height + '" x="' + x + '" y="' + y + '" style="fill:rgb(230,230,230);stroke-width:1;stroke:#909090" />'
        text = text + '<text x="' + (x+padding) + '" y="' + (y + lineHeigth) + '" style="fill:darkblue;font-family:monospace;font-size:' + fontSize + 'rem;">[ ' + name + ' ]'
        for (let i = 0; i < data[0].length; i++) {
            if (measureNames.includes(data[0][i].name) && i < measureNamesTranslated.length) {
                let l = '<tspan x="_x" y="_y">_label: _v</tspan>'
                l = l.replace('_x', (x+padding))
                l = l.replace('_y', y + lineHeigth * (i + 2))
                l = l.replace('_label', measureNamesTranslated[i])
                l = l.replace('_v', data[0][i].value)
                text = text + l
            }
        }
        return text + '</text>'
    }

    let getMarkerColor = function (point) {
        let result = 'lightblue'
        /* if(!self.calcAlert){
            return result
        }
        for(var i=0;i<point.length;i++){
            if(point[i]){
                if(point[i].name==self.rangeName){
                    var lv=getAlertLevel(self.range, point[i].value)
                    switch(lv){
                        case 0:
                            result='green'
                            break
                        case 1:
                            result='yellow'
                            break
                        case 2:
                            result='red'
                            break
                    }
                    return result;
                }
            }
        } */
        return result
    }

    function emptyPlan() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">'
            + '<rect x="0" y="0" width="1000" height="300" fill="none" stroke="black" stroke-width="1" />'
            + '<text x="20" y="100" style="font:bold 24px sans-serif">definition not set</text>'
            + '</svg>'
    }


</script>