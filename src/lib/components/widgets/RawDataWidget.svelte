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
    let parentHeight = 0;

    async function getRequiredData() {
        if (dev) {
            return sgxdata.getOneChannelExample(config.dev_id, config.channel, 3)
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