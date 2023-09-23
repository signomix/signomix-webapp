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
        try {
            return Number.parseFloat(value).toFixed(config.rounding);
        } catch (e) {
            return value;
        }
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
    function getIconName(data) {
        let level = sgxhelper.getAlertLevel(config.range, recalculate(data.value), data.timestamp);
        switch (level) {
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
            <div class="spinner-border spinner-border-sm" role="status"></div>
            {:then data}
            {#if front}
            <i class="bi {getIconName(data[0][0])} h3 {getColor(data[0][0])}"></i>
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