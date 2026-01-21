<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { transformData } from '$lib/widgets.js';

    export let config
    export let filter

    let errorMessage = '';
    let apiUrl;
    let parentHeight = 0;
    let resolvedData = null;
    let randomValue = null;

    //console.log('RawDataWidget config', config)
    let promise

    $: {
        // This block will re-run whenever config or filter change
        if (config || filter) {
            getData();
        }
    }

    async function getData() {
        if (config.query != undefined && config.query != null && (config.query.toLowerCase().includes('class') || config.query.toLowerCase().includes('report'))) {
            apiUrl = utils.getBackendUrl(location) + '/api/reports/single/'
            promise = sgxdata.getReportData(dev, apiUrl, config, filter, $token, null)
            resolvedData = await promise;
            if (resolvedData && randomValue) {
                resolvedData.randomValue = randomValue;
                resolvedData = resolvedData; // Trigger reactivity
            }
        } else {
            /* apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
            if (config.group != undefined && config.group != null && config.group != '') {
                promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token);
            } else {
                promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
            } */
        }
    }

    function f1() {
        if (resolvedData) {
            randomValue = Math.random().toString(36).substring(2, 15);
            resolvedData.randomValue = randomValue;
            resolvedData = resolvedData; // Trigger reactivity
        }
    }


    /* function getDate(data) {
        let date;
        if(config.group != undefined && config.group != null && config.group != '') {
            date= new Date(data[0][0][0].timestamp).toLocaleString()
        } else {
            date= new Date(data[0][0].timestamp).toLocaleString()
        }
        return date
    } */

</script>

<div class="p-1 w-100" bind:clientHeight={parentHeight}>
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-left">
        <div class="col-12">
            <button on:click={f1} class="btn btn-primary btn-sm mb-2">Add random value</button>
            {#await promise}
            <div class="spinner-border spinner-border-sm" role="status"></div>
            {:then data}
            <pre
                style="height: auto; max-height: {parentHeight-32}px; overflow: auto;">{JSON.stringify(resolvedData || data, null, 2)}</pre>
            {:catch error}
            <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>