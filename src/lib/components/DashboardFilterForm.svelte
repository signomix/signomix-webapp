<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="text-right p-1">
    <div class="container">
        <form>
            <div class="form-group">
                Parametry zmieniające zakres danych pobieranych przez kontrolki tym pulpicie:
            </div>
            <div class="form-group">
                Od daty
                <input type="datetime-local" id="from_date" class="form-control" bind:value={config.from}/>
            </div>
            <div class="form-group">
                Do daty
                <input type="datetime-local" id="to_date" class="form-control" bind:value={config.to}/>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-link" on:click|preventDefault={clearForm}>Wyczyść</button>
            </div>
            <div class="mt-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" on:click|preventDefault={handleCancel}>Anuluj</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" on:click|preventDefault={handleSave}>Zapisz</button>
            </div>
        </form>
    </div>

</div>
<script>
    export let config
    export let callbackSave
    export let callbackCancel

    function handleSave(event) {
        callbackSave(config)
    }
    function handleCancel(event) {
        callbackCancel()
    }
    function clearForm(event) {
        config.from = ""
        config.to = ""  
    }
</script>