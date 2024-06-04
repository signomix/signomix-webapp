	<script>
	import { utils } from '$lib/utils.js';
	import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
	export let dialog2
	export let title
	export let message
	export let labels
	export let callback
	export let color

	let okLabel='ok'
	let cancelLabel='cancel'
	let selectedColor = color!=undefined && color!=null && color!='' ? color : 'primary'
	//let labelsArray=[]

	function getHint() {
		okLabel = utils.getLabel('ok', texts, $language)
		cancelLabel = utils.getLabel('cancel', texts, $language)
		let text
		if(labels!=undefined && labels!=null && Array.isArray(labels) && labels.length>0){
			//console.log('labels:',labels)
			//labelsArray=labels.split(';')
			okLabel=labels[0]
			if(labels.length>1){
				cancelLabel=labels[1]
			}
		}
		if(labels!=undefined && labels!=null && labels.length<2){
			return ''
		}
		text = utils.getLabel('hint1', texts, $language)
			+ (okLabel)
			+ utils.getLabel('hint2', texts, $language)
			+ (cancelLabel)
			+ utils.getLabel('hint3', texts, $language)
		return text
	}
	let texts = {
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
	dialog2 {
		border: none !important;
		border-radius: calc(5px * var(--ratio));
		box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		max-width: 400px;
		z-index: 1000;
		padding: 5px;
	}
</style>
<dialog2 bind:this={dialog2}>
	<div class="text-center alert alert-{selectedColor} px-2 py-1 m-0" style="padding: 0px; margin: 0px;">
		<h5 class="card-title mt-1 mb-2">{title}</h5>
		{#if message!=undefined && message!=null && message!=''}
		<p>{message}</p>
		{:else}
	    <slot />
		{/if}
		<p><em>{getHint()}</em></p>
		<div class="mb-1">
			{#if labels!=undefined && labels!=null && labels.length>1}
			<button class="btn btn-outline-{selectedColor}" on:click={callback(false)}>{cancelLabel}</button>
			{/if}
			<button class="btn btn-outline-{selectedColor}" on:click={callback(true)}>{okLabel}</button>
		</div>
	</div>
</dialog2>