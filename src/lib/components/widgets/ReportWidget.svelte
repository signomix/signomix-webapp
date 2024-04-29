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
    let apiUrl
    let parentHeight = 0;

    console.log('ReportWidget config', config)
    let promise
    if (isGroup()) {
        apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'
        promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token);
    } else {
        apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
        promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
    }

    afterUpdate(() => {
        if (isGroup()) {
            apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'
            promise = sgxdata.getGroupData(dev, apiUrl, config, filter, $token);
        } else {
            apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
            promise = sgxdata.getData(dev, apiUrl, config, filter, $token);
        }
    });

    let front = true;

    function switchView() {
        front = !front;
    }

    function isGroup() {
        if (config.group != undefined && config.group != null && config.group != '') {
            return true
        } else {
            return false
        }
    }

    function getDate(data) {
        let date = '';
        try {
            if (config.group != undefined && config.group != null && config.group != '') {
                date = new Date(data[0][0][0].timestamp).toLocaleString()
            } else {
                date = new Date(data[0][0].timestamp).toLocaleString()
            }
        } catch (e) {
            //console.log('error', e)
        }
        return date
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
            <div class="spinner-border spinner-border-sm" role="status"></div>
            {:then data}
            {#if !front}
            {#if isGroup()}
            {getDate(data)} {config.group}
            {:else}
            {getDate(data)} {config.dev_id}
            {/if}
            {:else}
            <div style="height: {parentHeight-32}px; overflow-y: scroll;">
                {#if data!=undefined && data.length!=undefined && data.length >0 && data[0][0] != undefined}
                {#if isGroup()}
                <table class="table table-sm table-responsive-sm">
                    <thead class="text-bg-primary">
                        <th scope="col">EUI</th>
                        <th scope="col">data</th>
                        {#each data[0][0] as item}
                        <th scope="col">{item.name}</th>
                        {/each}
                    </thead>
                    <tbody>
                        {#each data as row}
                        <tr>
                            <td>{row[0][0].deviceEUI}</td>
                            <td>{new Date(row[0][0].timestamp).toLocaleString()}</td>
                            {#each row[0] as item}
                            <td>{utils.recalculate(item.value,config.rounding)}</td>
                            {/each}
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {:else}
                <table class="table table-sm table-responsive-sm">
                    <thead class="text-bg-primary">
                        <th scope="col">data</th>
                        {#each data[0] as item}
                        <th scope="col">{item.name}</th>
                        {/each}
                    </thead>
                    <tbody>
                        {#each data as row}
                        <tr>
                            <td>{new Date(row[0].timestamp).toLocaleString()}</td>
                            {#each row as item}
                            <td>{utils.recalculate(item.value, config.rounding)}</td>
                            {/each}
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {/if}
                {/if}
            </div>
            {/if}
            {:catch error}
            {#if !front}
            <p style="color: red">{error.message}</p>
            {/if}
            {/await}
        </div>
    </div>
</div>