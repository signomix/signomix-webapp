<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';

    export let config
    export let filter

    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/device/'

    let promise = sgxdata.getData(dev,apiUrl,config,filter,session.token);
    let front = true;

    afterUpdate(() => {
        promise = sgxdata.getData(dev,apiUrl,config,filter,session.token);
    });
    function recalculate(value){
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function switchView(){
        front = !front;
    }
    function getColor(data){
        let level = sgxhelper.getAlertLevel(config.range, recalculate(data.value), data.timestamp);
        if(config.config!=undefined && config.config!=null){
            let cfg = JSON.parse(config.config)
            if(cfg.colors!=undefined && cfg.colors!=null&&cfg.colors.length==5){
                return cfg.colors[level]
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
    }
    function getIconName(){
        if(config.icon==null || config.icon=="" || config.icon==undefined){
            let cname = config.channel.toLowerCase();
            switch(cname){
                case 'temperature':
                    return 'bi-thermometer-half'
                case 'humidity':
                case 'moisture':
                    return 'bi-droplet-half'
                case 'pressure':
                    return 'bi-speedometer'
                case 'wind':
                    return 'bi-wind'
                case 'rain':
                    return 'bi-cloud-hail'
                case 'pollution':
                case 'pm10':
                case 'pm25':
                    return 'bi-cloud-haze2'
                case 'luminance':
                case 'light':
                case 'lux':
                case 'brightness':
                    return 'bi-sun'
                default:
                    return 'bi-question-circle'
            }
        }else{
            return config.icon;
        }
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
            ...
            {:then data}
            {#if front}
            <span class="h4"><i class="bi {getIconName()} me-2 {getColor(data[0][0])}"></i>{recalculate(data[0][0].value)}{@html config.unitName}</span>
            {:else}
            {new Date(data[0][0].timestamp).toLocaleString()}<br/>
            {config.dev_id}
            {/if}
            {:catch error}
            <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div> 