{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    Brak dostępu
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('news',labels,$language)}</h5>
    <a href="#" on:click|preventDefault={goToList} title="{utils.getLabel('goback',labels,$language)}"><i class="bi bi-arrow-left h5 link-dark"></i></a>
</div>
{#await data}
{:then data}
<div class="row">
    <div class="col-12">
        <PostPreview config={data} callback={goToList}/>
    </div>
</div>
<div class="row border-top mt-2">
    <div class="col-12 text-start">
        <a href="#" on:click|preventDefault={goToList} title="{utils.getLabel('goback',labels,$language)}"><i class="btn btn-outline-secondary bi bi-arrow-left h5 link-dark mt-2" role="button"></i></a>
    </div>
</div>
{/await}
{/if}
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';
    import { dev } from '$app/environment';
    import { invalidateAll } from '$app/navigation';
    import  PostPreview  from '$lib/components/PostPreview.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';


    export let data
    onMount(async () => {
        if(!$isAuthenticated){  
            console.log('redirect to login');
            goto('/login');
        }
        console.log('DATA',data);
    });

    function goToList(){
        goto('/news');
    }

    let labels = {
        'news': {
            'pl': "Wiadomości",
            'en': "News"
        },
        'goback': {
            'pl': "Powrót do listy",
            'en': "Go back to list"
        }
    }


</script>