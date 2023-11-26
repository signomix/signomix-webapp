<script>
    import { onMount } from 'svelte';
    import { beforeUpdate } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';

    export let config
    export let filter

    $: dashboardID = config.dashboardID!=undefined?config.dashboardID:'';
    $: title = config.title!=undefined?config.title:'';

    function displayDashboard() {
        goto('/dashboards/'+dashboardID, { replaceState: true })
    }
</script>
<div class="container p-0">
    <a href="/dashboards/{dashboardID}" class="btn btn-primary w-100" role="button" aria-disabled="true">{title}</a>
</div>