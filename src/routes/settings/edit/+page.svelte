<form>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-id" class="form-label">ID</label>
        </div>
        <div class="col-md-3">
            <input disabled type="text" class="form-control" id="input-id" bind:value={data.id}>
        </div> 
        <div class="col-md-1 col-form-label">
            <label for="input-userid" class="form-label">Owner</label>
        </div>
        <div class="col-md-3">
            <input disabled type="text" class="form-control" id="input-userid" bind:value={data.userID}>
        </div>
        <div class="col-md-4">

            <input type="checkbox" class="form-check-input me-2" id="input-shared" bind:value={data.shared}>
            <label class="form-check-label" for="input-shared">Shared</label>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-title" class="form-label">Title</label>
        </div>
        <div class="col-md-11">
            <input type="text" class="form-control" id="input-name" bind:value={data.title}>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1 col-form-label">
            <label for="input-team" class="form-label">Team</label>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" id="input-team" bind:value={data.team}>
        </div>
        <div class="col-md-2 col-form-label">
            <label for="input-admins" class="form-label">Administrators</label>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" id="input-admins" bind:value={data.administrators}>
        </div>
    </div>
    <div class="row">
        <div class="col-form-label">
            <button class="btn btn-outline-secondary mt-1" on:click={goBack}>Cancel</button>
            <button class="btn btn-outline-primary me-4 mt-1" on:click={saveDashboard} disabled={modified==false}><i
                    class="bi bi-save me-2"></i> Zapisz konfigurację
            </button>
            <button class="btn btn-outline-primary me-4 mt-1" on:click|preventDefault={removeDashboard}>
                <i class="bi bi-trash me-2"></i> Usuń pulpit
            </button>
            <button class="btn btn-outline-primary mt-1 me-4" on:click={addWidget}><i
                    class="bi bi-plus-lg"></i></button>
        </div>
    </div>
</form>
<script>
    export let data;
</script>
