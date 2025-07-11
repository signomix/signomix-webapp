{#if !$isAuthenticated}
<div class="alert alert-danger w-100 mt-2 text-center" role="alert">
    {utils.getLabel('denied',labels,$language)}
</div>
{:else}
<div
    class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('pagetitle',labels,$language)}</h5>
</div>
<div class="row">
        <div class="col text-center">
            {#if $language === 'pl'}
            <div hidden={$language != 'pl'}>
                <script id="9ce78bed-d8fb-42d9-a389-2ffcc049294e" data-yt-url="https://experiot.youtrack.cloud" src="https://experiot.youtrack.cloud/static/simplified/form/form-entry.js" data-theme="light" data-lang="pl"></script>
            </div>
            {:else}
            <div hidden={$language != 'en'}>
                <script id="49167680-b431-4b4e-8a44-9ed02b36b08a" data-yt-url="https://experiot.youtrack.cloud" src="https://experiot.youtrack.cloud/static/simplified/form/form-entry.js" data-theme="light" data-lang="en"></script>
            </div>
            {/if}
            
        </div>
    </div>
{/if}
<script>
    import { utils } from '$lib/utils.js';
    import { language, isAuthenticated } from '$lib/usersession.js';
    let labels = {
        'pagetitle': {
            'pl': "Wsparcie",
            'en': "Support"
        },
        'denied': {
            'pl': "Brak dostępu",
            'en': "Access denied"
        }
    }
</script>