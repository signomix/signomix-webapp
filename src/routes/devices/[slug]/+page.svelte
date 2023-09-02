<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>{data.name}</h5>
    {#if (utils.isObjectAdmin(session, data.userID))}
    <a href="/devices/{data.eui}/edit">Configure</a>
    {/if}
</div>
{#await data}
{:then data}
{#if data!==undefined}
<DeviceForm config={data} callback={saveSettings} readonly={true} />
{/if}
{/await}
<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { userSession } from '$lib/stores.js';
    import DeviceForm from '$lib/components/DeviceForm.svelte';

    export let data
    let errorMessage = ''
    let session;
    userSession.subscribe(value => {
        session = value;
    })

    onMount(async () => {
        if(!session.user.logged || !session.user.authorized || session.user.login==''){
            console.log('redirect to login');
            goto('/login');
        }else{
            console.log('settings',data);
            console.log('session',session);
        }
    });

    function saveSettings(config){

    }


</script>