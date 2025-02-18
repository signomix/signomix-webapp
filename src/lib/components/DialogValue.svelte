<script>
	import { utils } from "$lib/utils.js";

	import {
		token,
		profile,
		language,
		isAuthenticated,
	} from "$lib/usersession.js";
	export let dialog;
	export let title;
	export let message;
	export let labels;
	export let callback;
	export let color;
	export let configuration;

	let okLabel = "ok";
	let cancelLabel = "cancel";
	let selectedColor =
		color != undefined && color != null && color != "" ? color : "primary";
	let selectedValue;
	let errorMessage = "";

	function getValueLabel() {
		if (configuration.label == undefined || configuration.label == null) {
			return utils.getLabel("value_label", texts, $language);
		}
		return configuration.label;
	}

	function isConfigured() {
		errorMessage = utils.getLabel("config_not_valid", texts, $language);
		if (configuration == undefined || configuration == null) {
			console.log("configuration is null");
			return false;
		}
		if (configuration.type == "number") {
			if (
				configuration.number == undefined ||
				configuration.number == null
			) {
				return false;
			}
			if (
				configuration.number.minimum == undefined ||
				configuration.number.minimum == null ||
				isNaN(configuration.number.minimum)
			) {
				return false;
			}
			if (
				configuration.number.maximum == undefined ||
				configuration.number.maximum == null ||
				isNaN(configuration.number.maximum)
			) {
				return false;
			}
			if (
				configuration.number.step == undefined ||
				configuration.number.step == null ||
				isNaN(configuration.number.step)
			) {
				return false;
			}
			errorMessage = "";
			return true;
		} else if (configuration.type == "option") {
			if (
				configuration.option == undefined ||
				configuration.option == null
			) {
				return false;
			}
			if (
				!Array.isArray(configuration.option) ||
				configuration.option.length < 1
			) {
				return false;
			}
			for (let i = 0; i < configuration.option.length; i++) {
				if (
					configuration.option[i].value == undefined ||
					configuration.option[i].value == null ||
					isNaN(configuration.option[i].value)
				) {
					return false;
				}
				if (
					configuration.option[i].name == undefined ||
					configuration.option[i].name == null ||
					configuration.option[i].name.length < 1
				) {
					return false;
				}
			}
			errorMessage = "";
			return true;
		}
	}

	function isValid() {
		return true;
	}

	function getHint() {
		okLabel = utils.getLabel("ok", texts, $language);
		cancelLabel = utils.getLabel("cancel", texts, $language);
		let text;
		if (
			labels != undefined &&
			labels != null &&
			Array.isArray(labels) &&
			labels.length > 0
		) {
			okLabel = labels[0];
			if (labels.length > 1) {
				cancelLabel = labels[1];
			}
		}

		if (labels != undefined && labels != null && labels.length < 2) {
			return "";
		}
		text =
			utils.getLabel("hint1", texts, $language) +
			okLabel +
			utils.getLabel("hint2", texts, $language) +
			cancelLabel +
			utils.getLabel("hint3", texts, $language);
		return text;
	}

	function getValueHelp() {
		if (
			configuration.hint != undefined &&
			configuration.hint != null &&
			configuration.hint != ""
		) {
			return configuration.hint;
		} else {
			utils.getLabel("valueHelp", texts, $language);
		}
	}

	let texts = {
		hint1: {
			pl: "Naciśnij ",
			en: "Press ",
		},
		hint2: {
			pl: " aby zaakceptować. Naciśnij ESC lub kliknij ",
			en: " to accept. Press ESC or click ",
		},
		hint3: {
			pl: " aby anulować.",
			en: " to revoke.",
		},
		ok: {
			pl: "OK",
			en: "OK",
		},
		cancel: {
			pl: "Anuluj",
			en: "Cancel",
		},
		config_not_valid: {
			pl: "Konfiguracja przycisku nie jest poprawna",
			en: "Button configuration is not valid",
		},
		value_label: {
			pl: "Ustaw wartość",
			en: "Set value",
		},
		value_not_valid: {
			pl: "Wartość nie jest zgodna z konfiguracją",
			en: "Value is not valid according to configuration",
		},
		valueHelp: {
			pl: "Podaj nową wartość",
			en: "Provide new value",
		},
	};
</script>

<dialog bind:this={dialog}>
	<div
		class="text-center alert alert-{selectedColor} px-2 py-1 m-0"
		style="padding: 0px; margin: 0px;"
	>
		<h5 class="card-title mt-1 mb-2">{title}</h5>
		{#if message != undefined && message != null && message != ""}
			<p>{message}</p>
		{:else}
			<slot />
		{/if}
		<div class="mb-1">
			{#if isConfigured()}
				{#if configuration.type == "number"}
					<form>
						<div class="mb-3 w-100">
							<label for="valueInput" class="form-label"
								>{getValueLabel()}</label
							>
							<input
								type="number"
								class="form-control"
								id="valueInput"
								aria-describedby="valueHelp"
								bind:value={selectedValue}
								min={configuration.number.minimum}
								max={configuration.number.maximum}
								step={configuration.number.step}
							/>
							<div id="valueHelp" class="form-text">
								{getValueHelp()}
							</div>
						</div>
					</form>
				{/if}
			{:else}
				<p class="text-danger"><b>{errorMessage}</b></p>
			{/if}
		</div>

		<div class="mb-1">
			<p><em>{getHint()}</em></p>
			{#if labels != undefined && labels != null && labels.length > 1}
				<button
					class="btn btn-outline-primary"
					on:click={callback(false)}>{cancelLabel}</button
				>
			{/if}
			{#if isConfigured()}
				<button
					class="btn btn-outline-primary"
					on:click={callback(true, selectedValue)}>{okLabel}</button
				>
			{/if}
		</div>
	</div>
</dialog>

<style>
	dialog {
		border: none !important;
		border-radius: calc(5px * var(--ratio));
		box-shadow:
			0 0 #0000,
			0 0 #0000,
			0 25px 50px -12px rgba(0, 0, 0, 0.25);
		max-width: 400px;
		z-index: 1000;
		padding: 5px;
	}
</style>
