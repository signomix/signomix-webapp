<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { page } from '$app/stores';

    export let config
    export let filter

    let errorMessage = '';
    let parentHeight = 0;

    // get list of selected dev EUIs from actual page parameter 'euis'
    $: euisString = $page.url.searchParams.get('euis');
    $: euisArray = euisString ? euisString.split(',') : [];

</script>

<div class="p-1 w-100" bind:clientHeight={parentHeight}>
    {#if config.title!=""}
    <div class="row text-center">
        <div class="col-12"><span>{config.title}</span></div>
    </div>
    {/if}
    <div class="row text-left">
        <div class="col-12">
            {#if euisArray.length==0}
                <div>No devices selected.</div>
            {:else}
                <ul>
                {#each euisArray as eui}
                    <li>{eui}</li>
                {/each}
                </ul>
            {/if}
        </div>
    </div>
</div>