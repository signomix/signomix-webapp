<script>
	export let showGroupSelectorModal; // boolean
	let dialog; // HTMLDialogElement
	$: if (dialog && showGroupSelectorModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={()=> (showGroupSelectorModal = false)}
	on:click|self={() => dialog.close()}
	>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<h3>Wybierz grupę</h3>
		<hr />
		<div class="row">
			<div class="col">
				Wyszukaj
			</div>
		</div>
		<div class="row">
			<div class="col">
				<input type="text" class="form-control" placeholder="Identyfikator" />
			</div>
			<div class="col">
				<input type="text" class="form-control" placeholder="Nazwa" />
			</div>
		</div>
		<div class="row">
			<div class="col">
		<table class="table table-sm table-responsive">
			<thead>
				<tr>
					<th scope="col">Identyfikator</th>
					<th scope="col">Nazwa</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1</td>
					<td>Grupa 1</td>
				</tr>
				<tr>
					<td>2</td>
					<td>Bardzo długa nazwa grupy 2</td>
				</tr>
				<tr>
					<td>3</td>
					<td>Grupa 3</td>
				</tr>
		</table>
		</div>
		</div>
		<hr />
		<button class="btn btn-primary" autofocus on:click={()=> dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog>div {
		padding: 1em;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}

		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	button {
		display: block;
	}
</style>