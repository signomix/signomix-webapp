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
	let ready = false;
	let selected = null;

	function getValueLabel() {
		if (configuration.label == undefined || configuration.label == null) {
			return utils.getLabel("value_label", texts, $language);
		}
		return configuration.label;
	}

	function isConfigured() {
		errorMessage = utils.getLabel("config_not_valid", texts, $language);
		let configured = true;
		if (configuration == undefined || configuration == null) {
			console.log("configuration is null");
			ready = false;
			return false;
		}
		if (configuration.type == "number") {
			if (
				configuration.number == undefined ||
				configuration.number == null
			) {
				configured = false && configured;
			}
			if (
				configuration.number.minimum == undefined ||
				configuration.number.minimum == null ||
				isNaN(configuration.number.minimum)
			) {
				configured = false && configured;
			}
			if (
				configuration.number.maximum == undefined ||
				configuration.number.maximum == null ||
				isNaN(configuration.number.maximum)
			) {
				configured = false && configured;
			}
			if (
				configuration.number.step == undefined ||
				configuration.number.step == null ||
				isNaN(configuration.number.step)
			) {
				configured = false && configured;
			}
			if (configured) {
				errorMessage = "";
				ready = true;
				return true;
			} else {
				ready = false;
				return false;
			}
		} else if (configuration.type == "option") {
			if (
				configuration.option == undefined ||
				configuration.option == null
			) {
				ready = false;
				return false;
			}
			if (
				!Array.isArray(configuration.option) ||
				configuration.option.length < 1
			) {
				configured = false && configured;
			}
			for (let i = 0; i < configuration.option.length; i++) {
				if (
					configuration.option[i].value == undefined ||
					configuration.option[i].value == null ||
					isNaN(configuration.option[i].value)
				) {
					configured = false && configured;
				}
				if (
					configuration.option[i].name == undefined ||
					configuration.option[i].name == null ||
					configuration.option[i].name.length < 1
				) {
					configured = false && configured;
				}
			}
			if (configured) {
				errorMessage = "";
				ready = true;
				return true;
			} else {
				ready = false;
				return false;
			}
		}else{
			errorMessage = utils.getLabel(
				"config_type_not_valid",
				texts,
				$language,
			);
			ready = false;
			return false;
		}
		return false;
	}

	function isValid() {
		if (configuration.type == "number") {
			if (
				selectedValue == undefined ||
				selectedValue == null ||
				isNaN(selectedValue)
			) {
				errorMessage = utils.getLabel(
					"value_not_set",
					texts,
					$language,
				);
				ready = false;
				return false;
			}
			if (
				selectedValue < configuration.number.minimum ||
				selectedValue > configuration.number.maximum
			) {
				errorMessage = utils.getLabel(
					"value_not_valid",
					texts,
					$language,
				);
				ready = false;
				return false;
			}
		}
		if (configuration.type == "option") {
			if (
				selectedValue == undefined ||
				selectedValue == null ||
				isNaN(selectedValue)
			) {
				errorMessage = utils.getLabel(
					"value_not_set",
					texts,
					$language,
				);
				ready = false;
				return false;
			}
			let found = false;
			for (let i = 0; i < configuration.option.length; i++) {
				if (configuration.option[i].value == selectedValue) {
					found = true;
					break;
				}
			}
			if (!found) {
				errorMessage = utils.getLabel(
					"value_not_valid",
					texts,
					$language,
				);
				ready = false;
				return false;
			}
		}
		ready = true;
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

	function sendValue(value) {
		if (!isValid()) {
			return;
		}
		callback(true, value);
	}

	function handleKeyDown(event) {
		errorMessage = "";
		ready = true;
	}

	function handleSelected(event) {
		errorMessage = "";
		ready = true;
	}

	function getButtonColor() {
		if (
			configuration.btncolor != undefined &&
			configuration.btncolor != null
		) {
			return configuration.btncolor;
		} else {
			return "primary";
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
		config_type_not_valid: {
			pl: "Nieporpoprawna konfiguracja (typ)",
			en: "Invalid configuration (type)"
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
		value_not_set: {
			pl: "Wartość nie została ustawiona",
			en: "Value is not set",
		},
		value_not_valid: {
			pl: "Wartość nie jest zgodna z konfiguracją",
			en: "Value is not valid according to configuration",
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
				<form>
					<div class="mb-3 w-100">
						<label for="valueInput" class="form-label"
							>{getValueLabel()}</label
						>
						{#if configuration.type == "number"}
							<input
								type="number"
								class="form-control"
								id="valueInput"
								aria-describedby="valueHelp"
								bind:value={selectedValue}
								min={configuration.number.minimum}
								max={configuration.number.maximum}
								step={configuration.number.step}
								on:keydown={handleKeyDown}
							/>
						{:else if configuration.type == "option"}
							<div class="form-check">
							{#each configuration.option as option}
								<label>
									<input
										class="form-check-input me-1 ms-1"
										bind:group={selectedValue}
										type="radio"
										name="amount"
										value={option.value}
										on:change={handleSelected}
									/>
									{option.name}
								</label>
							{/each}
							</div>
						{/if}
						<div id="valueHelp" class="form-text">
							{getValueHelp()}
						</div>
					</div>
				</form>
			{/if}
			{#if errorMessage != ""}
				<div class="alert alert-danger" role="alert">
					{errorMessage}
				</div>
			{/if}
		</div>

		<div class="mb-1">
			<p><em>{getHint()}</em></p>
			{#if labels != undefined && labels != null && labels.length > 1}
				<button
					class="btn btn-outline-{getButtonColor()}"
					on:click={callback(false)}>{cancelLabel}</button
				>
			{/if}
			{#if ready == true}
				<button
					class="btn btn-outline-{getButtonColor()}"
					on:click={sendValue(selectedValue)}>{okLabel}</button
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
