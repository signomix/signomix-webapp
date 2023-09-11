<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { afterUpdate } from 'svelte';

    export let config
    export let filter

    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'

    let promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
    let front = true;

    afterUpdate(() => {
        promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
    });
    function recalculate(value) {
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function switchView() {
        front = !front;
    }
    function getColor(data) {
        let level = sgxhelper.getAlertLevel(config.range, recalculate(data.value), data.timestamp);
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
    }
    function getIconName() {
        if (config.icon == null || config.icon == "" || config.icon == undefined) {
            let cname = config.channel.toLowerCase();
            switch (cname) {
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
        } else {
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
            <div class="spinner-border spinner-border-sm" role="status">
            </div>
            {:then data}
            {#if front}
            <span class="h4"><i
                    class="bi {getIconName()} me-2 {getColor(data[0][0])}"></i>{recalculate(data[0][0].value)}{@html
                config.unitName}</span>
            {:else}
            {new Date(data[0][0].timestamp).toLocaleString()}<br />
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