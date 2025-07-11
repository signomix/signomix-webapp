<div class="row">
    <div class="col text-center">
        {#if $language === 'pl'}
        <div hidden={$language !='pl' }>
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSf5jCNRidZhsk4kuW84HQa9SPy8ATG8Ue1vkjIPwGPm1S1RYg/viewform?embedded=true" width="640" height="2183" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        </div>
        {:else}
        <div hidden={$language !='en' }>
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc6j52KX25Suak-ZcJ4O17yE_qCuaPh83RfWmxp7wtHB7YqFQ/viewform?embedded=true" width="640" height="2139" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        </div>
        {/if}
    </div>
</div>
<script>
    import { language } from '$lib/usersession.js';
</script>