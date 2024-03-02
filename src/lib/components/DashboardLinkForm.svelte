<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="text-right p-1">
    <div class="container">
        <form>
            <div class="form-group">
                Link
                <input type="text" class="form-control" bind:value={config.link}/>
            </div>
            <div class="form-group">
                Code
                <textarea class="form-control" rows="5" bind:value={config.code}></textarea>
            </div>
            <div class="mt-2">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" on:click|preventDefault={handleClose}>Close</button>
            </div>
        </form>
    </div>

</div>
<script>
    export let config
    export let callbackClose

    function handleClose(event) {
        callbackClose()
    }
</script>