<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="text-right p-1">
    <p>index {index}<br>
        {config[index].title}<br>
        {config[index].type}<br>
        <button type="button" class="btn btn-outline-primary" on:click={handleClick}>
            Konfiguracja
        </button>
    </p>
</div>
<script>
    export let index
    export let config

    function handleClick(event) {
        console.log('clicked widget index', index, 'config', config[index])
    }
</script>