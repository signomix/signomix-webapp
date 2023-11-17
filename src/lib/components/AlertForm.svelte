<script>
  import { sgxhelper } from "$lib/sgxhelper.js";
  import { sgxdata } from "$lib/sgxdata.js";
  import { utils } from "$lib/utils.js";
  import DeviceSelector from "./DeviceSelector.svelte";
  import GroupSelector from "./GroupSelector.svelte";
  import {
    token,
    profile,
    language,
    isAuthenticated,
  } from "$lib/usersession.js";
  import { dev } from "$app/environment";

  export let config;
  export let callback;
  export let readonly;

  let selectedTarget;
  let selectedOption = "1";
  let showEuiModal = false;
  let showGroupModal = false;

  function targetChange(event) {
    console.log("Target change to", selectedTarget);

    if (selectedTarget === "1") {
      config.target.group = null;
      config.target.tag.name = null;
      config.target.tag.value = null;
    } else if (selectedTarget === "2") {
      config.target.eui = null;
      config.target.tag.name = null;
      config.target.tag.value = null;
    } else {
      config.target.eui = null;
      config.target.group = null;
      console.log("cleared eui group");
    }
  }

  function handleInputChange(event) {
    selectedOption = event.target.value;

    if (selectedOption === "1") {
      config.result.everytime = "true";
    } else {
      config.result.everytime = "false";
    }
  }

  function addFilter(event) {
    let isDisabled = !event.target.checked;

    document.querySelector("#input5").disabled = isDisabled;
    document.querySelector("#input6").disabled = isDisabled;

    if (isDisabled) {
      config.conditions[0].condition2 = null;
      config.conditions[0].value2 = null;
      console.log("optional conditions cleared!");
    }
  }

  function addFilterWithIndex(event, i) {
    let isDisabled = !event.target.checked;

    document.querySelector("#input5" + i).disabled = isDisabled;
    document.querySelector("#input6" + i).disabled = isDisabled;

    if (isDisabled) {
      config.conditions[i].condition2 = null;
      config.conditions[i].value2 = null;
      console.log("optional conditions cleared!");
    }
  }

  function addCondition() {
    if (config.conditions.length >= 3) {
      return;
    }

    config.conditions.push({
      measurement: "",
      condition1: ">",
      value1: "",
    });
    config.conditions = config.conditions;
  }

  function removeLastCondition() {
    config.conditions.pop();
    config.conditions = config.conditions;
  }

  console.log("config", config);

  function getChannelName(channel) {
    if (channel == "general") {
      return config.generalNotificationChannel.substring(
        0,
        config.generalNotificationChannel.indexOf(":")
      );
    } else if (channel == "info") {
      return config.infoNotificationChannel.substring(
        0,
        config.infoNotificationChannel.indexOf(":")
      );
    } else if (channel == "warning") {
      return config.warningNotificationChannel.substring(
        0,
        config.warningNotificationChannel.indexOf(":")
      );
    } else if (channel == "alert") {
      return config.alertNotificationChannel.substring(
        0,
        config.alertNotificationChannel.indexOf(":")
      );
    }
    return "";
  }
  function getChannelConfig(channel) {
    if (channel == "general") {
      return config.generalNotificationChannel.substring(
        config.generalNotificationChannel.indexOf(":") + 1
      );
    } else if (channel == "info") {
      return config.infoNotificationChannel.substring(
        config.infoNotificationChannel.indexOf(":") + 1
      );
    } else if (channel == "warning") {
      return config.warningNotificationChannel.substring(
        config.warningNotificationChannel.indexOf(":") + 1
      );
    } else if (channel == "alert") {
      return config.alertNotificationChannel.substring(
        config.alertNotificationChannel.indexOf(":") + 1
      );
    }
    return "";
  }

  function handleSave(event) {
    // config.generalNotificationChannel =
    //   document.getElementById("input-generalNotificationChannel").value +
    //   ":" +
    //   document.getElementById("input-generalNotificationChannelConfig").value;
    // config.infoNotificationChannel =
    //   document.getElementById("input-infoNotificationChannel").value +
    //   ":" +
    //   document.getElementById("input-infoNotificationChannelConfig").value;
    // config.warningNotificationChannel =
    //   document.getElementById("input-warningNotificationChannel").value +
    //   ":" +
    //   document.getElementById("input-warningNotificationChannelConfig").value;
    // config.alertNotificationChannel =
    //   document.getElementById("input-alertNotificationChannel").value +
    //   ":" +
    //   document.getElementById("input-alertNotificationChannelConfig").value;
    if (selectedTarget != 1 && selectedTarget != 2 && selectedTarget != 3) {
      alert("Nie zdefiniowano targetu, którego ma dotyczyć alert!");
      return;
    }

    callback(config);
  }
  function handleCancel(event) {
    callback(null);
  }
  function handlePassword(event) {
    alert("Not implemented yet");
  }
  function handleRemove(event) {
    alert("Not implemented yet");
  }

  const apiUrl =
    utils.getBackendUrl(location) +
    "/api/core/organization/" +
    config.organization;
  let promise = sgxdata.getOrganization(dev, apiUrl, $token);

  let labels = {
    login: {
      en: "Login",
      pl: "Login",
    },
    name: {
      en: "Name",
      pl: "Imię",
    },
    surname: {
      en: "Surname",
      pl: "Nazwisko",
    },
    account: {
      en: "Account type",
      pl: "Typ konta",
    },
    email: {
      en: "E-mail",
      pl: "E-mail",
    },
    phone_prefix: {
      en: "Phone prefix",
      pl: "Prefiks telefonu",
    },
    roles: {
      en: "Role",
      pl: "Rola",
    },
    language: {
      en: "Preffered language",
      pl: "Preferowany język",
    },
    registration: {
      en: "Registration date",
      pl: "Data rejestracji",
    },
    notyfication_methods: {
      en: "Configuration of notification types",
      pl: "Konfiguracja typów powiadomień",
    },
    general_notifications: {
      en: "General",
      pl: "Ogólne",
    },
    info_notifications: {
      en: "Info",
      pl: "Informacyjne",
    },
    warning_notifications: {
      en: "Warning",
      pl: "Ostrzegawcze",
    },
    alert_notifications: {
      en: "Alert",
      pl: "Alarmowe",
    },
    cancel: {
      en: "Cancel",
      pl: "Anuluj",
    },
    save: {
      en: "Save",
      pl: "Zapisz",
    },
    in_app: {
      en: "In application",
      pl: "W aplikacji",
    },
    webhook: {
      en: "Webhook",
      pl: "Webhook",
    },
    organization: {
      en: "Organization",
      pl: "Organizacja",
    },
    changePassword: {
      en: "Change password",
      pl: "Zmień hasło",
    },
    deleteAccount: {
      en: "Delete account",
      pl: "Usuń konto",
    },
    type: {
      en: "Type",
      pl: "Typ",
    },
    channel: {
      en: "Channel",
      pl: "Kanał",
    },
    config: {
      en: "Configuration",
      pl: "Konfiguracja",
    },
  };
</script>

<form>
  <div class="row form-group">
    <div class="col-sm-2 d-flex align-items-center">
      <p style="margin: 0;">ID: {config.id}</p>
    </div>
    <div class="col-sm-10">
      <div class="d-flex">
        <label
          for="rule_name"
          class="flex-shrink-0 text-center text-center"
          style="position: relative; top: 8px;">Nazwa reguły:</label
        >
        <input
          type="text"
          id="rule_name"
          class="form-control ms-2"
          bind:value={config.name}
        />
      </div>
    </div>
  </div>

  <div class="container mt-3">
    <div class="row">
      <div class="col-sm-8">
        <div class="form-group d-flex align-items-center">
          <label for="alert_def" class="me-2" style="white-space: nowrap;"
            >Alert definiowany dla:</label
          >
          <select
            class="form-select"
            id="alert_def"
            bind:value={selectedTarget}
            on:change={targetChange}
          >
            <option selected>wybierz: urządzenie/grupa/tag</option>
            <option value="1">urządzenie</option>
            <option value="2">grupa</option>
            <option value="3">tag</option>
          </select>
        </div>
      </div>

      <div class="col-sm-4 d-flex align-items-center">
        <div class="form-check">
          <label class="form-check-label" for="exampleCheckbox">Aktywny</label>
          <input
            type="checkbox"
            class="form-check-input"
            id="exampleCheckbox"
            bind:checked={config.active}
          />
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-3 mb-3">
    <div class="row">
      {#if selectedTarget == 1}
        <div class="col-sm-6 mt-3">
          <div class="form-group">
            <label for="euiSelector">EUI: </label>
            <DeviceSelector
              bind:showDeviceSelectorModal={showEuiModal}
              callback={(device) => {
                config.target.eui = device;
              }}
            />
            <input
              readonly
              id="euiSelector"
              bind:value={config.target.eui}
              on:click={() => {
                showEuiModal = true;
              }}
            />
          </div>
        </div>
      {:else if selectedTarget == 2}
        <div class="col-sm-6 mt-3">
          <div class="form-group">
            <label for="groupSelector">ID Grupy: </label>
            <GroupSelector
              bind:showGroupSelectorModal={showGroupModal}
              callback={(group) => {
                config.target.group = group;
              }}
            />
            <input
              readonly
              id="groupSelector"
              bind:value={config.target.group}
              on:click={() => {
                showGroupModal = true;
              }}
            />
          </div>
        </div>
      {:else if selectedTarget == 3}
        <div class="col-sm-6 mt-3">
          <div class="form-group d-flex align-items-center">
            <label for="tag" class="me-2">Tag:</label>
            <div class="d-flex">
              <input
                type="text"
                id="tag_name"
                class="form-control"
                placeholder="Nazwa tagu"
                bind:value={config.target.tag.name}
              />
              <input
                type="text"
                id="tag_value"
                class="form-control ms-2"
                placeholder="Wartość tagu"
                bind:value={config.target.tag.value}
              />
            </div>
          </div>
        </div>
      {:else}{/if}
    </div>
  </div>





  <div>
    <!-- Kontener z napisem "Jeżeli" i linią -->
    <div class="d-flex align-items-center mb-1">
      <p class="mb-0 display-7">Jeżeli</p>
      <hr class="flex-grow-1 ms-3" />
    </div>
  
    <div class="row mb-3">
      <!-- Pierwsze trzy inputy w jednej linii -->
      <div class="col-sm-6">
        <label for="input1"></label>
        <input
          bind:value={config.conditions[0].measurement}
          type="text"
          id="input1"
          class="form-control me-1"
          style="width: 100%;"
          placeholder="temperature"
        />
      </div>
  
      <div class="col-sm-3">
        <label for="input2"></label>
        <select
          class="form-select"
          style="width: 100%;"
          id="input2"
          bind:value={config.conditions[0].condition1}
        >
          <option selected value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
      </div>
  
      <div class="col-sm-3">
        <label for="input3"></label>
        <input
          bind:value={config.conditions[0].value1}
          type="text"
          id="input3"
          class="form-control ms-2"
          style="width: 100%;" 
          placeholder="-10.0"
        />
      </div>
    </div>
  
    <!-- Pozostałe elementy w nowej linii na małych ekranach -->
    <div class="form-group d-flex align-items-center flex-wrap  flex-sm-nowrap mb-3">
      <p class="mt-3 mb-3 flex-grow-0 me-2">LUB</p>
      <p class="mt-3 mb-3 me-3">{config.conditions[0].measurement}</p>
      <select
        class="form-select mb-2 mb-sm-0"
        style="width: 20%;" 
        id="input5"
        bind:value={config.conditions[0].condition2}
        disabled
      >
        <option selected value=">">&gt;</option>
        <option value="<">&lt;</option>
      </select>
      <input
        bind:value={config.conditions[0].value2}
        type="text"
        id="input6"
        class="form-control me-2 ms-2 mb-2 mb-sm-0"
        style="max-width: 30%;" 
        placeholder="35.0"
        disabled
      />
      <div class="form-check ms-2 mb-2 mb-sm-0">
        <input
          on:change={addFilter}
          type="checkbox"
          id="enableEdit"
          class="form-check-input"
        />
        <label class="form-check-label" for="enableEdit"
          >Dodaj warunek</label
        >
      </div>
    </div>
  </div>







      <div class="mt-3">
        <div class="form-group d-flex align-items-center mb-2">
          <!-- Napis "LUB" z poziomą linią na obu stronach -->
          <select
            class="form-select mb-0 display-7"
            style="max-width: 30%;"
            id="inputOrAnd"
            bind:value={config.conditions[0].operator}
          >
            <option selected value="or">LUB</option>
            <option value="and">ORAZ</option>
          </select>
          <div class="flex-grow-1">
            <hr class="flex-grow-1 ms-3 me-3" />
          </div>
          <!-- Przycisk "Dodaj pole" -->
          {#if config.conditions.length <= 2}
            <button class="btn btn-primary me-1" on:click={addCondition}
              ><i class="bi bi-plus-lg" /></button
            >
          {/if}
          {#if config.conditions.length > 1}
            <button
              class="btn btn-primary"
              on:click={() => {
                removeLastCondition();
              }}><i class="bi bi-dash" /></button
            >
          {/if}
        </div>








        <div id="additionalFields">
          {#each config.conditions as condition, i}
            {#if i > 0}
              <div class="form-group d-flex align-items-center flex-wrap mb-3">
                <!-- Pierwszy obowiązkowy input (zmniejszony o 25%) -->
                <label for="input1{i}" />
                <input
                  bind:value={condition.measurement}
                  type="text"
                  id="input1{i}"
                  class="form-control me-1"
                  style="max-width: 40%;"
                  placeholder="temperature"
                />
          
                <!-- Pozostałe 3 inputy -->
                <label for="input2{i}" />
                <select
                  class="form-select me-1"
                  style="max-width: 20%;"
                  id="input2{i}"
                  bind:value={condition.condition1}
                >
                  <option selected value=">">&gt;</option>
                  <option value="<">&lt;</option>
                </select>
          
                <label for="input3{i}" />
                <input
                  bind:value={condition.value1}
                  type="text"
                  id="input3{i}"
                  class="form-control ms-1"
                  style="max-width: 30%;"
                  placeholder="-10.0"
                />
              </div>
          
              <!-- Paragraf, przycisk "Edytuj", Inputy 5 i 6 w jednej linii dla sm i większej -->
              <div class="form-group d-flex align-items-center flex-wrap mb-3">
                <p class="mt-3 flex-grow-0 me-1">LUB</p>
                <p class="mt-3 me-2">{condition.measurement}</p>
                <select
                  class="form-select me-1"
                  style="max-width: 20%;"
                  id="input5{i}"
                  bind:value={condition.condition2}
                  disabled
                >
                  <option selected value=">">&gt;</option>
                  <option value="<">&lt;</option>
                </select>
                <input
                  bind:value={condition.value2}
                  type="text"
                  id="input6{i}"
                  class="form-control ms-1"
                  style="max-width: 20%;"
                  placeholder="35.0"
                  disabled
                />
                <div class="form-check ms-3">
                  <input
                    on:change={(event) => {
                      addFilterWithIndex(event, i);
                    }}
                    type="checkbox"
                    id="enableEdit{i}"
                    class="form-check-input"
                  />
                  <label class="form-check-label" for="enableEdit{i}"
                    >Dodaj warunek</label
                  >
                </div>
              </div>
          
              <div class="container mt-2 mb-2">
                <div class="form-group d-flex align-items-center">
                  {#if i < 2}
                  <select
                    class="form-select mb-0 display-7 me-2"
                    style="max-width: 30%;"
                    id="inputOrAnd{i}"
                    bind:value={condition.operator}
                  >
                    <option selected value="or">LUB</option>
                    <option value="and">ORAZ</option>
                  </select>
                  {/if}
                  <!-- Linia na całą szerokość strony -->
                  <hr class="flex-grow-1 mx-2" />
                </div>
              </div>
            {/if}
          {/each}
        </div>












        <div class="mt-3">
          <!-- Linia z tekstem "wtedy" -->
          <div class="d-flex align-items-center">
            <p class="m-0 me-2">WTEDY</p>
            <hr class="flex-grow-1" />
          </div>

          <!-- Nowa linia z paragrafem, dropdownem i inputem -->
          <div class="d-flex align-items-center mt-2">
            <!-- Paragraf z krótkim napisem -->
            <p class="m-0 me-2" style="white-space: nowrap;">Utwórz alert</p>
            <!-- Dropdown z 5 opcjami -->
            <select
              class="form-select me-2"
              bind:value={config.result.alertType}
            >
              <option selected value="warning">warning</option>
              <option value="warning 2">warning 2</option>
              <option value="warning 3">warning 3</option>
              <option value="warning 4">warning 4</option>
              <option value="warning 5">warning 5</option>
            </select>
            <!-- Input -->
            <input
              bind:value={config.result.message}
              type="text"
              class="form-control"
              placeholder="Przekroczone parametry środowiskowe"
            />
          </div>
        </div>

        <!-- Kolejna linia z dwoma radiobuttonami i napisem "cześć" -->
        <div class=" mt-4">
          <!-- Kontener dla dwóch radiobuttonów -->
          <div class="d-flex justify-content-evenly">
            <div class="form-check me-2">
              <input
                bind:group={selectedOption}
                on:change={handleInputChange}
                class="form-check-input"
                type="radio"
                name="radiogroup"
                id="radio1"
                value="1"
              />
              <label class="form-check-label" for="radio1"
                >Przy każdym wystąpieniu warunków</label
              >
            </div>
            <div class="form-check">
              <input
                bind:group={selectedOption}
                on:change={handleInputChange}
                class="form-check-input"
                type="radio"
                name="radiogroup"
                id="radio2"
                value="2"
              />
              <label class="form-check-label" for="radio2"
                >Przy pierwszym wystąpieniu warunków</label
              >
            </div>
          </div>
        </div>

        <!-- Nowa linia z checkboxem "Wysyłaj informacje o powrocie parametrów do normy" -->
        <div class="mt-4">
          <input
            bind:checked={config.result.conditionOKMessage}
            class="form-check-input"
            type="checkbox"
            value=""
            id="defaultCheck1"
          />
          <label class="form-check-label" for="defaultCheck1">
            Wysyłaj informacje o powrocie parametrów do normy
          </label>
          {#if config.result.conditionOKMessage}
            <input
              bind:value={config.result.conditionOKMessageText}
              type="text"
              class="form-control"
              placeholder="Parametry powróciły do normy"
            />
          {/if}
        </div>

        <!-- Nowa linia z buttonami "Save" i "Cancel" -->
        <div class="row mt-2 justify-content-end">
          <div class="col-md-6 d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary me-2"
              on:click={(event) => {
                handleSave(event);
              }}>Save</button
            >
            <button
              type="button"
              class="btn btn-secondary"
              on:click={() => {
                window.history.back();
              }}>Cancel</button
            >
          </div>
        </div>
      </div>
    
 
</form>
