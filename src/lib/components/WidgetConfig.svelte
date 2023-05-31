<!--
    bindings: https://learn.svelte.dev/tutorial/text-inputs
-->
<div class="text-right p-1">
    {#if alertVisible}
    <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Uwaga</h4>
        <p>Czy na pewno chcesz usunąć?</p>
        <button class="btn btn-outline-primary mt-2" on:click={()=> {removeCallback(index)}}>Tak</button>
        <button class="btn btn-outline-primary mt-2" on:click={()=> {showAlert(false)}}>Nie</button>
    </div>
    {:else}
    <button class="btn btn-outline-primary btn-sm p-1" data-bs-toggle="modal" data-bs-target="#configModal"
        on:click={setCurrentIndex(index)}><i class="bi bi-gear"></i>
    </button>
    <button class="btn btn-outline-primary btn-sm p-1" on:pointerdown={e=> e.stopPropagation()}
        on:click={() => showAlert(true)} >
        <i class="bi bi-trash3"></i>
    </button>
    {/if}
</div>
<script>
    export let index
    export let config
    export let removeCallback = () => { }
    export let setCurrentIndex = () => { }

    let alertVisible = false;

    function showAlert(show) {
        //alertVisible = show;
        if(confirm("Usunąć wybraną kontrolkę?")){
            removeCallback(index)
        }
    }
</script>