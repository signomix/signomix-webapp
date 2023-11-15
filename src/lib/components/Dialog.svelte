<script>
	import { utils } from '$lib/utils.js';
	import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
	export let dialog
	export let title
	export let okLabel
	export let cancelLabel
	export let callback

	function getHint() {
		let text = utils.getLabel('hint1', labels, $language)
			+ (okLabel || utils.getLabel('ok', labels, $language))
			+ utils.getLabel('hint2', labels, $language)
			+ (cancelLabel || utils.getLabel('cancel', labels, $language))
			+ utils.getLabel('hint3', labels, $language)
		return text
	}
	let labels = {
		'hint1': {
			'pl': "Naciśnij ",
			'en': "Press "
		},
		'hint2': {
			'pl': " aby zaakceptować. Naciśnij ESC lub kliknij ",
			'en': " to accept. Press ESC or click "
		},
		'hint3': {
			'pl': " aby anulować.",
			'en': " to revoke."
		},
		'ok': {
			'pl': "OK",
			'en': "OK"
		},
		'cancel': {
			'pl': "Anuluj",
			'en': "Cancel"
		}
	}	
</script>
<style>
	dialog {
		border: none !important;
		border-radius: calc(5px * var(--ratio));
		box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		padding: 1rem;
		max-width: 400px;
	}
</style>
<dialog bind:this={dialog}>
	<div class="text-center">
		<h5 class="card-title mb-2">{title}</h5>
		<p>
			<slot />
		</p>
		<p><em>{getHint()}</em></p>
		<div>
			<button class="btn btn-outline-secondary" on:click={callback(false)}>{cancelLabel||utils.getLabel('cancel',
				labels, $language)}</button>
			<button class="btn btn-outline-primary" on:click={callback(true)}>{okLabel||utils.getLabel('ok', labels,
				$language)}</button>
		</div>
	</div>
</dialog>