<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    export let config
    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/device/'

    async function getRequiredData() {
        if(dev){
            return sgxdata.getOneChannelExample(config.dev_id, config.channel)
        }
        const headers = new Headers()
        headers.set('Accept', 'application/json');
        const endpoint = apiUrl + config.dev_id + "/" + config.channel + "?query=" + config.query + "&tid=" + session.token;
        const res = await fetch(endpoint, { mode: 'cors', headers: headers });
        const data = await res.json();
        if (res.ok) {
            return data;
        } else {
            throw new Error(text);
        }
    }
    let promise = getRequiredData();
    let front = true;

    function recalculate(value){
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function switchView(){
        front = !front;
    }
    function getIconColor(data){
        let alertLevel = sgxhelper.getAlertLevel(config.rule, data.value, data.timestamp);
        if(alertLevel<0){ 
            return 'color:black;' // not defined
        }else if(alertLevel==0){
            return 'color:green;' // ok
        }else if(alertLevel==1){
            return 'color:orange;' // warning
        }else if(alertLevel==2){
            return 'color:red;' // alert
        }else if(alertLevel==3){
            return 'color:lightgray;' // inactive
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
        <div class="col-12">
            {#await promise}
            ...
            {:then data}
            {#if front}
            <span class="h4"><i class="bi {getIconName()} me-1" style={getIconColor(data[0][0])}></i>{recalculate(data[0][0].value)}{@html config.unitName}</span>
            {:else}
            {new Date(data[0][0].timestamp).toLocaleString()}
            {/if}
            {:catch error}
            <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>