<script>
    import { userSession } from '$lib/stores.js';
    import { utils } from '$lib/utils.js';
    import { sgxdata } from '$lib/sgxdata.js';
    import { sgxhelper } from '$lib/sgxhelper.js';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    export let config
    export let filter
    let session;
    userSession.subscribe(value => {
        session = value;
    });
    let errorMessage = '';
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/v2/device/'
    let parentHeight = 0;

    console.log('RawDataWidget config', config)
    let promise = sgxdata.getData(dev,apiUrl,config,filter,session.token);
    let front = true;

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
        <div class="col-12" >
            {#await promise}
            ...
            {:then data}
            {#if front}
            <pre style="height: auto; max-height: {parentHeight-32}px; overflow: auto;">{JSON.stringify(data, null, 2)}</pre>
            {:else}
            {new Date(data[0][0].timestamp).toLocaleString()}
            {/if}
            {:catch error}
            <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>