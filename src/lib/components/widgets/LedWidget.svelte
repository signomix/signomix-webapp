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
    let parentHeight = 0;
    let alertLevel = 3;

    /* async function getRequiredData() {
        if (dev) {
            return sgxdata.getOneChannelExample(config.dev_id, config.channel, 1)
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
    } */
    let promise = sgxdata.getData(dev,apiUrl,config,filter,session.token);
    let front = true;

    afterUpdate(() => {
        promise = sgxdata.getData(dev,apiUrl,config,filter,session.token);
    });

    function getLedImgUrl(measurement) {
        let level = sgxhelper.getAlertLevel(config.range, measurement.value, measurement.timestamp)
        switch (level) {
            case 0:
                return '/img/led/led-green.svg'
            case 1:
                return '/img/led/led-yellow.svg'
            case 2:
                return '/img/led/led-red.svg'
            case 3:
                return '/img/led/led-grey.svg'
            default:
                return '/img/led/KO.svg'
        }
    }
    function isCalculated(measurement) {
        alertLevel = sgxhelper.getAlertLevel(config.range, measurement.value, measurement.timestamp)
        return true
    }
</script>
<div class="p-1 w-100">
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
            {#if isCalculated(data[0][0])}
            {#if alertLevel==0}
            <i class="bi bi-emoji-smile-fill h3 text-success"></i>
            {:else if alertLevel==1}
            <i class="bi bi-emoji-neutral-fill h3 text-warning"></i>
            {:else if alertLevel==2}
            <i class="bi bi-emoji-frown-fill h3 text-danger"></i>
            {:else if alertLevel==3}
            <i class="bi bi-emoji-expressionless-fill h3 text-muted"></i>
            {:else}
            <i class="bi bi-emoji-expressionless h3 text-muted"></i>
            {/if}
            {/if}
            {:catch error}
            <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>