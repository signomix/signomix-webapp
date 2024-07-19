<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { dev } from '$app/environment';
    import { afterUpdate } from 'svelte';

    export let config
    export let filter

    let promise
    let apiUrl
    let front = true
    let parentHeight = 0;
    let myConfig = config
    myConfig.query = "eui "+config.dev_id+" class com.signomix.reports.pre.DeviceInfo"

    apiUrl = utils.getBackendUrl(location) + '/api/reports/single'
    promise = sgxdata.getReportData(dev, apiUrl, myConfig, filter, $token);

    afterUpdate(() => {
        apiUrl = utils.getBackendUrl(location) + '/api/reports/single'
        promise = sgxdata.getReportData(dev, apiUrl, myConfig, filter, $token);
    });

    function switchView() {
        front = !front;
    }
</script>

<div class="p-1 w-100" on:click={switchView} bind:clientHeight={parentHeight}>
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-left">
        <div class="col-12 mt-1">
            {#await promise}
            <div class="spinner-border spinner-border-sm" role="status">
            </div>
            {:then reportresult}
            {#if reportresult.status==200 && reportresult.contentType.toLowerCase() == "text/html"}
            {@html reportresult.content}
            {:else}
            <p>Something went wrong ({reportresult.status}): {reportresult.errorMessage}</p>
            {/if}
            {:catch error}
            <p>Something went wrong ({reportresult.status}): {reportresult.errorMessage}</p>
            {/await}
        </div>
    </div>
</div>