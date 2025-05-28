<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    //import { sgxhelper } from '$lib/sgxhelper.js';
    import { widgets } from '$lib/widgets.js';
    import { dql } from '$lib/dql.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';

    export let config
    export let filter

    let errorMessage = '';
    //const apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
    let apiUrl = utils.getBackendUrl(location) + '/api/reports/single'
    let q={}
    try{
        q=dql.parse(config.query)
    }catch(e){
        console.log("error parsing query: ", e)
    }
    let config2 = config
    config2.query ='report DqlReport eui '+config2.dev_id+' channel '+config2.channel+' last 1'
    if(q!=undefined && q!=null && q.project!=undefined && q.project!=null && q.project!=''){
        config2.query = config2.query + ' project '+q.project
    }
    if(!widgets.getConfiguration(config2).nulls){
        config2.query = config2.query + ' notnull'
    }

    //let promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
    let promise = sgxdata.getReportData(dev, apiUrl, config2, filter, $token, transformData);
    let front = true;

    afterUpdate(() => {
        //promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
        promise = sgxdata.getReportData(dev, apiUrl, config2, filter, $token, transformData);
    });

    async function transformData(config, rawData) {
        let jsonData = await rawData;
        return jsonData
    }

    function switchView() {
        front = !front;
    }

/*     function getColor(value, timestamp) {
        let level = widgets.getAlertLevel(config.range, utils.recalculate(value, config.rounding), timestamp);
        if (config.config != undefined && config.config != null && config.config != '') {
            try {
                let cfg = JSON.parse(config.config)
                if (cfg.colors != undefined && cfg.colors != null && cfg.colors.length == 5) {
                    return cfg.colors[level]
                }
            } catch (e) {
                console.log("error parsing config: ", e);
                return 'text-muted'
            }
        }
        switch (level) {
            case 0:
                return 'text-success'
            case 1:
                return 'text-warning'
            case 2:
                return 'text-danger'
            case 3:
                return 'text-muted'
            default:
                return 'text-muted'
        }
    } */
    function getIconName(data) {
        let rounding = config.rounding != undefined && config.rounding != null ? config.rounding : 2;
        if (dataNotAvailable(data,"getIconName")) {
            return "bi-emoji-expressionless";
        }
        let level = widgets.getAlertLevel(
            config.range, 
            utils.recalculate(data.datasets[0].data[0].values[0], rounding), 
            data.datasets[0].data[0].timestamp
        );
        let icons = ['bi-emoji-smile-fill', 'bi-emoji-neutral-fill', 'bi-emoji-frown-fill', 'bi-emoji-expressionless-fill']
        if(config.icon!=undefined && config.icon!=null && config.icon!=''){
            let optIcons = config.icon.split(':')
            for(let i=0;i<optIcons.length;i++){
                icons[i] = optIcons[i]
            }
        }
        if(level>=0 && level<icons.length){
            return icons[level]
        }else{
            return 'bi-emoji-expressionless'
        }
        /* switch (level) {
            case 0:
                return 'bi-emoji-smile-fill'
            case 1:
                return 'bi-emoji-neutral-fill'
            case 2:
                return 'bi-emoji-frown-fill'
            case 3:
                return 'bi-emoji-expressionless-fill'
            default:
                return 'bi-emoji-expressionless'
        } */
    }

    function dataNotAvailable(data, name) {
        if (data == undefined || data == null) {
            console.log("not available 1")
            return true;
        }
        if (data.datasets == undefined || data.datasets == null) {
            console.log("not available 2 in "+name)
            return true;
        }
        if (data.datasets[0] == undefined || data.datasets[0] == null) {
            console.log("not available 3")
            return true;
        }
        if (data.datasets[0].data == undefined || data.datasets[0].data == null) {
            console.log("not available 4")
            return true;
        }
        if (data.datasets[0].data[0] == undefined || data.datasets[0].data[0] == null) {
            console.log("not available 5")
            return true;
        }
        if (data.datasets[0].data[0].values == undefined || data.datasets[0].data[0].values == null) {
            console.log("not available 6")
            return true;
        }
        if (data.datasets[0].data[0].values[0] == undefined || data.datasets[0].data[0].values[0] == null) {
            console.log("not available 7")
            return true;
        }
        return false;
    }
    // function recalculate(data) {
    //     if (dataNotAvailable(data,"recalculate")) {
    //         return "N/A";
    //     }
    //     let value = data.datasets[0].data[0].values[0]
    //     try {
    //         return Number.parseFloat(value).toFixed(config.rounding);
    //     } catch (e) {
    //         return value;
    //     }
    // }
    function getColor(data) {
        if(dataNotAvailable(data,"getColor")) {
            return "text-muted";
        }
        let timestamp=data.datasets[0].data[0].timestamp
        let rounding = config.rounding != undefined && config.rounding != null ? config.rounding : 2;

        let level = widgets.getAlertLevel(
            config.range,
            utils.recalculate(data.datasets[0].data[0].values[0], rounding),
            timestamp,
        );
        if (
            config.config != undefined &&
            config.config != null &&
            config.config != ""
        ) {
            try {
                let cfg = JSON.parse(config.config);
                if (
                    cfg.colors != undefined &&
                    cfg.colors != null &&
                    cfg.colors.length == 5
                ) {
                    return cfg.colors[level];
                }
            } catch (e) {
                console.log("error parsing config: ", e);
                return "text-success";
            }
        }
        switch (level) {
            case 0:
                return "text-success";
            case 1:
                return "text-warning";
            case 2:
                return "text-danger";
            case 3:
                return "text-muted";
            default:
                return "text-body";
        }
    }
    function getDate(data) {
        if (dataNotAvailable(data,"getDate")) {
            return "N/A";
        }
        let date = new Date(
                        data.datasets[0].data[0].timestamp,
                    ).toLocaleString()
        return date;
    }
</script>
<div class="p-1 w-100" on:click={switchView}>
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-center">
        <div class="col-12 mt-1">
            {#await promise}
            <div class="spinner-border spinner-border-sm" role="status"></div>
            {:then data}
            {#if front}
            <i class="bi {getIconName(data)} h3 {getColor(data)}"></i>
            {:else}
            {getDate(data)}<br />
            {config.dev_id}
            {/if}
            {:catch error}
            {#if !front}
            <p style="color: red">{error.message}</p>
            {/if}
            {/await}
        </div>
    </div>
</div>