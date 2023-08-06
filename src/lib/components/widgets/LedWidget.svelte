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
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
    let parentHeight = 0;
    let alertLevel = 3;

    let promise = sgxdata.getData(dev, apiUrl, config, filter, session.token);
    let front = true;

    afterUpdate(() => {
        promise = sgxdata.getData(dev, apiUrl, config, filter, session.token);
    });
    function recalculate(value) {
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function isCalculated(measurement) {
        alertLevel = sgxhelper.getAlertLevel(config.range, recalculate(measurement.value), measurement.timestamp)
        return true
    }
    function getColor() {
        if (config.config != undefined && config.config != null && config.config != '') {
            try {
                let cfg = JSON.parse(config.config)
                if (cfg.colors != undefined && cfg.colors != null && cfg.colors.length == 5) {
                    return cfg.colors[alertLevel]
                }
            } catch (e) {
                console.log("error parsing config: ", e);
                return 'text-muted'
            }
        }
        switch (alertLevel) {
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
            <i class="bi bi-emoji-smile-fill h3 {getColor()}"></i>
            {:else if alertLevel==1}
            <i class="bi bi-emoji-neutral-fill h3 {getColor()}"></i>
            {:else if alertLevel==2}
            <i class="bi bi-emoji-frown-fill h3 {getColor()}"></i>
            {:else if alertLevel==3}
            <i class="bi bi-emoji-expressionless-fill h3 {getColor()}"></i>
            {:else}
            <i class="bi bi-emoji-expressionless h3 {getColor()}"></i>
            {/if}
            {/if}
            {:catch error}
            <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>