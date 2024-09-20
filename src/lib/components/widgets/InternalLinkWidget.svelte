<script>
    import { onMount } from 'svelte';
    import { beforeUpdate } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { viewMode } from '$lib/usersession.js';

    export let config
    export let filter

    $: dashboardID = config.dashboardID!=undefined?config.dashboardID:'';
    $: title = config.title!=undefined?config.title:'';

    function displayDashboard() {
        goto('/dashboards/'+dashboardID, { replaceState: true })
    }
    function isViewMode(mode) {
        return mode == 'view'
    }
</script>
<div class="container p-0">
    {#if isViewMode($viewMode)}
    <span class="btn btn-secondary w-100">{title}</span>
    {:else}
    <a href="/dashboards/{dashboardID}" class="btn btn-primary w-100" role="button" aria-disabled="true">{title}</a>
    {/if}
</div>