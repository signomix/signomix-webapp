<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{data.name}</h5><a href="/devices/{data.eui}/edit">Configure</a>
</div>
<script>
    import { onMount } from 'svelte';
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';

    export let data
    let errorMessage = ''
    let session;
    userSession.subscribe(value => {
        session = value;
    });


</script>