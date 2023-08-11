<div class="p-1 w-100">
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-center">
        <div class="col-12 mt-1">
            {#await promise}
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            {:then data}
            {@html getPlan(data)}
            {:catch error}
            {#if !front}
            <p style="color: red">{error.message}</p>
            {/if}
            {/await}
        </div>
    </div>
</div>
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
    const apiUrl = utils.getBackendUrl(location) + '/api/provider/group/'

    let promise = sgxdata.getGroupData(dev, apiUrl, config, filter, session.token);
    let front = true;

    afterUpdate(() => {
        promise = sgxdata.getGroupData(dev, apiUrl, config, filter, session.token);
    });
    function recalculate(value) {
        return Number.parseFloat(value).toFixed(config.rounding);
    }
    function switchView() {
        front = !front;
    }

    function getPlan(data, description){
        console.log(data)
        let svgDef=config.description
        if(svgDef==undefined || svgDef==null || svgDef==''){
            return emptyPlan()
        }
        return svgDef
    }

    function emptyPlan(){
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">'
            +'<rect x="0" y="0" width="1000" height="300" fill="none" stroke="black" stroke-width="1" />'
            +'<text x="20" y="100" style="font:bold 24px sans-serif">definition not set</text>'
            +'</svg>'
    }

</script>