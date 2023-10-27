<script>
	import sgxdata from '$lib/sgxdata.js';
	import { token } from '$lib/usersession.js';
	import { dev } from '$app/environment';
	import { utils } from '$lib/utils.js';

	export let showGroupSelectorModal; // boolean
	export let callback //function

	let promise = null
	let dialog; // HTMLDialogElement

	let offset = 0
	let limit = 20
	let euiToSearch=''
	let nameToSearch=''

	$: if (dialog && showGroupSelectorModal) {
		dialog.showModal();
		let url = utils.getBackendUrl(location) + "/api/core/group"
		url = url + '?offset=' + offset + '&limit=' + limit + '&shared=true'
		promise = sgxdata.getGroups(dev, url, '', $token, limit, offset)
	}

	function searchEui(event) {
		if (event.target.value.length >= 0) {
			nameToSearch=''
			let url = utils.getBackendUrl(location) + "/api/core/group"
			url = url + '?offset=' + offset + '&limit=' + limit + '&shared=true'
			promise = sgxdata.getGroups(dev, url, 'search=eui:' + euiToSearch, $token, limit, offset)
		}
	}

	function searchName(event) {
		if (event.target.value.length >= 0) {
			euiToSearch=''
			let url = utils.getBackendUrl(location) + "/api/core/group"
			url = url + '?offset=' + offset + '&limit=' + limit + '&shared=true'
			promise = sgxdata.getGroups(dev, url, 'search=name:' + nameToSearch, $token, limit, offset)
		}
	}

	function handleSelected(eui) {
		callback(eui)
		dialog.close()
	}

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
				<input type="text" id="eui" class="form-control" placeholder="Identyfikator" bind:value={euiToSearch} on:input={searchEui} />
			</div>
			<div class="col">
				<input type="text" id="name" class="form-control" placeholder="Nazwa" bind:value={nameToSearch} on:input={searchName} />
			</div>
		</div>
		<div class="row">
			<div class="col">
				{#if promise!=null}
				{#await promise}
				<p>Ładowanie...</p>
				{:then devices}
				<table class="table table-sm table-responsive">
					<thead>
						<tr>
							<th scope="col">Identyfikator</th>
							<th scope="col">Nazwa</th>
						</tr>
					</thead>
					<tbody>
						{#each devices as device}
						<tr>
							<td on:click={handleSelected(device.eui)}>{device.eui}</td>
							<td on:click={handleSelected(device.eui)}>{device.name}</td>
						</tr>
						{/each}
				</table>
				{:catch error}
				<p>{error.message}</p>
				{/await}
				{/if}
			</div>
		</div>
		<hr />
		<button class="btn btn-primary" autofocus on:click={()=> dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.5em;
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