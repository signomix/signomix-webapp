<script>
  import { sgxhelper } from "$lib/sgxhelper.js";
  import { sgxdata } from "$lib/sgxdata.js";
  import { utils } from "$lib/utils.js";
  import DeviceSelector from "./DeviceSelector.svelte";
  import GroupSelector from "./GroupSelector.svelte";
  import { token, profile, language, isAuthenticated, } from "$lib/usersession.js";
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";

  export let config;
  export let callback;
  export let editable;

  let conditionOk=config.conditionOk
  let everyTime=config.everyTime
  let timeShift=config.timeShift==undefined?1:config.timeShift
  let hysteresis=config.hysteresis==undefined?0:config.hysteresis

  console.log('conditionOk/everyTime: '+conditionOk+'/'+everyTime)

  let selectedTarget = 1;
  let targets = [{
    id: 1,
    name: "Urządzenie"
  }, {
    id: 2,
    name: "Grupa"
  }, {
    id: 3,
    name: "Tag"
  }]

  let booleabOperators = [{
    id: 3,
    name: "AND"
  }, {
    id: 4,
    name: "OR"
  }]

  let conditionOperators = [{
    id: 1,
    name: "większe niż"
  }, {
    id: -1,
    name: "mniejsze niż"
  }]

  let alarmLevels = [{
    id: 1,
    name: "Info"
  }, {
    id: 2,
    name: "Warning"
  }, {
    id: 3,
    name: "Alert"
  }, {
    id: 4,
    name: "Critical"
  }, {
    id: 5,
    name: "Emergency"
  }
  ]

  let selectedOption = "1";
  let showEuiModal = false;
  let showGroupModal = false;


  console.log("config", config);
  let orCondition1 = config.conditions[0].orOperator
  let orCondition2 = false
  if (config.conditions.length > 1) {
    orCondition2 = config.conditions[1].orOperator
  }

  config.result = {}
  config.result.alertType = config.alertLevel;
  if (config.result.alertType == null || config.result.alertType == undefined) {
    config.result.alertType = 1;
  }
  //config.result.message = config.alertMessage;
  //config.result.everytime = config.everyTime
  //config.result.conditionOkMessage = config.conditionOk
  //config.result.conditionOkMessageText = config.conditionOkMessage
  config.target = {}
  config.target.eui = config.deviceEui
  config.target.group = config.groupEui
  config.target.tag = {}
  config.target.tag.name = config.tagName
  config.target.tag.value = config.tagValue
  if (config.target.tag.name != null && config.target.tag.name != "" && config.target.tag.value != null && config.target.tag.value) {
    selectedTarget = 3;
  } else if (config.target.group != null && config.target.group != "") {
    selectedTarget = 2;
  } else {
    selectedTarget = 1;
  }

  console.log('selectedTarget', selectedTarget)

/*   if (config.result.conditionOkMessage == null || config.result.conditionOkMessage == undefined) {
    config.result.conditionOkMessage = false;
  }
  if (config.result.conditionOkMessageText == null || config.result.conditionOkMessageText == undefined) {
    config.result.conditionOkMessageText = "";
  } */

  function targetChange(event) {
    console.log("Target change to", selectedTarget);

    if (selectedTarget === 1) {
      config.target.group = null;
      config.target.tag.name = null;
      config.target.tag.value = null;
    } else if (selectedTarget === 2) {
      config.target.eui = null;
      config.target.tag.name = null;
      config.target.tag.value = null;
    } else {
      config.target.eui = null;
      config.target.group = null;
      console.log("cleared eui group");
    }
  }

/*   function handleInputChange(event) {
    selectedOption = event.target.value;

    if (selectedOption === "1") {
      config.result.everytime = "true";
    } else {
      config.result.everytime = "false";
    }
  } */

  function addFilter(event) {
    let isDisabled = !event.target.checked;
    orCondition1 = event.target.checked;

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
    orCondition2 = !isDisabled;

    //document.querySelector("#input5" + i).disabled = isDisabled;
    //document.querySelector("#input6" + i).disabled = isDisabled;

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
      condition1: 1,
      value1: "",
    });
    config.conditions = config.conditions;
  }

  function removeLastCondition() {
    config.conditions.pop();
    config.conditions = config.conditions;
  }

  console.log("config", config);

  function handleSave(event) {
    console.log('save conditionOk/everyTime: '+conditionOk+'/'+everyTime)
    if (selectedTarget != 1 && selectedTarget != 2 && selectedTarget != 3) {
      alert("Nie zdefiniowano targetu, którego ma dotyczyć alert!");
      return;
    }
    // validate
    let errorMessage = '' //validate();
    if (errorMessage != "") {
      alert(errorMessage);
      return;
    }
    config.conditions[0].orOperator = orCondition1;
    if (config.conditions.length > 1) {
      config.conditions[1].orOperator = orCondition2;
    }
    config.conditionOk=conditionOk
    config.everyTime=everyTime
    config.timeShift=timeShift
    config.hysteresis=hysteresis
    callback(config);
  }
  function handleCancel(event) {
    callback(null);
  }

  function validate() {
    if (!config.active) {
      return ''
    }
    if (config.name == null || config.name == '') {
      return 'Nazwa nie może być pusta'
    }
    // target
    if (selectedTarget == 1) {
      if (config.target.eui == null || config.target.eui == '') {
        return 'Nie wybrano urządzenia'
      }
    } else if (selectedTarget == 2) {
      if (config.target.group == null || config.target.group == '') {
        return 'Nie wybrano grupy'
      }
    } else if (selectedTarget == 3) {
      if (config.target.tag.name == null || config.target.tag.name == '') {
        return 'Nie wybrano tagu'
      }
      if (config.target.tag.value == null || config.target.tag.value == '') {
        return 'Nie wybrano wartości tagu'
      }
    }
    // condition 1
    if (config.conditions[0].measurement == null || config.conditions[0].measurement == '') {
      return 'Nie wybrano nazwy pomiaru'
    }
    if (config.conditions[0].value1 == null || config.conditions[0].value1 == '') {
      return 'Nie wybrano wartości'
    }
    if (config.conditions[0].orOperator) {
      if (config.conditions[0].value2 == null || config.conditions[0].value2 == '') {
        return 'Nie wybrano wartości'
      }
    }
    // condition 2
    if (config.conditions.length > 1) {
      if (config.conditions[1].measurement == null || config.conditions[1].measurement == '') {
        return 'Nie wybrano nazwy pomiaru'
      }
      if (config.conditions[1].value1 == null || config.conditions[1].value1 == '') {
        return 'Nie wybrano wartości'
      }
      if (config.conditions[1].orOperator) {
        if (config.conditions[1].value2 == null || config.conditions[1].value2 == '') {
          return 'Nie wybrano wartości'
        }
      }
    }
    //
    if(config.team == null || config.team == ''){
      return 'Nie wybrano użytkowników do powiadomienia'
    }
    if(config.result.message == null || config.result.message == ''){
      return 'Nie wybrano treści komunikatu'
    }
    if(config.conditionOkMessage && (config.conditionOkMessageText == null || config.conditionOkMessageText == '')){
      return 'Nie wybrano treści komunikatu o powrocie parametrów do normy'
    }
    return ''
  }

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
        <label for="rule_name" class="flex-shrink-0 text-center text-center" style="position: relative; top: 8px;">Nazwa
          reguły:</label>
        <input type="text" required id="rule_name" class="form-control ms-2" bind:value={config.name} />
      </div>
    </div>
  </div>

  <div class="container mt-3">
    <div class="row">
      <div class="col-sm-8">
        <div class="form-group d-flex align-items-center">
          <label for="alert_def" class="me-2" style="white-space: nowrap;">Alert definiowany dla:</label>
          <select class="form-select" id="alert_def" bind:value={selectedTarget} on:change={targetChange}>
            <option disabled value=0 selected={selectedTarget===0}>wybierz target</option>
            {#each targets as target}
            <option value={target.id}>{target.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="col-sm-4 d-flex align-items-center">
        <div class="form-check">
          <label class="form-check-label" for="exampleCheckbox">Aktywny</label>
          <input type="checkbox" class="form-check-input" id="exampleCheckbox" bind:checked={config.active} />
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-3">
    <div class="row">
      {#if selectedTarget == 1}
      <div class="col-sm-6">
        <div class="form-group">
          <label for="euiSelector">EUI: </label>
          <DeviceSelector bind:showDeviceSelectorModal={showEuiModal} callback={(device)=> {
            config.target.eui = device;
            }}
            />
            <input readonly id="euiSelector" bind:value={config.target.eui} on:click={()=> {
            showEuiModal = true;
            }}
            />
        </div>
      </div>
      {:else if selectedTarget == 2}
      <div class="col-sm-6">
        <div class="form-group">
          <label for="groupSelector">ID Grupy: </label>
          <GroupSelector bind:showGroupSelectorModal={showGroupModal} callback={(group)=> {
            config.target.group = group;
            }}
            />
            <input readonly id="groupSelector" bind:value={config.target.group} on:click={()=> {
            showGroupModal = true;
            }}
            />
        </div>
      </div>
      {:else if selectedTarget == 3}
      <div class="col-sm-6">
        <div class="form-group d-flex align-items-center">
          <label for="tag" class="me-2">Tag:</label>
          <div class="d-flex">
            <input type="text" id="tag_name" class="form-control" placeholder="" bind:value={config.target.tag.name} />
            <input type="text" id="tag_value" class="form-control ms-2" placeholder=""
              bind:value={config.target.tag.value} />
          </div>
        </div>
      </div>
      {:else}{/if}
    </div>
  </div>
  <div class="container mt-3">
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group d-flex align-items-center">
          <label for="timeshift" class="me-2" style="white-space: nowrap;">Uwzględniaj dane nie starsze niż (min.):</label>
            <input type="number" min="1" id="timeshift" class="form-control ms-2" bind:value={timeShift} />
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group d-flex align-items-center">
          <label for="hysteresis" class="me-2" style="white-space: nowrap;">Histereza:</label>
            <input type="number" min="0" id="hysteresis" class="form-control ms-2" bind:value={hysteresis} />
        </div>
      </div>
  </div>

  <div>
    <!-- Kontener z napisem "Jeżeli" i linią -->
    <div class="d-flex align-items-center mb-1">
      <p class="mb-0 display-7">JEŚLI</p>
      <hr class="flex-grow-1 ms-3" />
    </div>

    <div class="row mb-3">
      <!-- Pierwsze trzy inputy w jednej linii -->
      <div class="col-sm-6">
        <label for="input1"></label>
        <input bind:value={config.conditions[0].measurement} type="text" id="input1" class="form-control me-1"
          style="width: 100%;" placeholder="podaj nazwę wartości" />
      </div>

      <div class="col-sm-3">
        <label for="input2"></label>
        <select class="form-select" style="width: 100%;" id="input2" bind:value={config.conditions[0].condition1}>
          <option disabled selected value=null>-- wybierz --</option>
          {#each conditionOperators as operator}
          <option value={operator.id}>{operator.name}</option>
          {/each}
        </select>
      </div>

      <div class="col-sm-3">
        <label for="input3"></label>
        <input bind:value={config.conditions[0].value1} type="text" id="input3" class="form-control ms-2"
          style="width: 100%;" placeholder="podaj wartość" />
      </div>
    </div>

    <!-- Pozostałe elementy w nowej linii na małych ekranach -->
    <div class="form-group d-flex align-items-center flex-wrap  flex-sm-nowrap mb-3">
      <div class="form-check ms-2 mb-2 mb-sm-0 me-2">
        <input bind:checked={orCondition1} on:change={addFilter} type="checkbox" id="enableEdit"
          class="form-check-input" />
        <label class="form-check-label" for="enableEdit">LUB</label>
      </div>
      {#if orCondition1}
      <!--<p class="mt-3 mb-3 flex-grow-0 me-2">LUB</p>-->
      <p class="mt-3 mb-3 me-3">{config.conditions[0].measurement}</p>
      <select class="form-select mb-2 mb-sm-0" style="width: 20%;" id="input5"
        bind:value={config.conditions[0].condition2}>
        <option disabled selected value=null>-- wybierz --</option>
        {#each conditionOperators as operator}
        <option value={operator.id}>{operator.name}</option>
        {/each}
      </select>
      <input bind:value={config.conditions[0].value2} type="text" id="input6"
        class="form-control me-2 ms-2 mb-2 mb-sm-0" style="max-width: 30%;" placeholder="podaj wartość" />
      {/if}
    </div>
  </div>

  <div class="mt-3">
    <div class="form-group d-flex align-items-center mb-2">
      <!-- Napis "LUB" z poziomą linią na obu stronach -->
      <!-- <select class="form-select mb-0 display-7" style="max-width: 30%;" id="inputOrAnd"
        bind:value={config.conditions[0].operator}>
        <option selected value="or">LUB</option>
        <option value="and">ORAZ</option>
      </select>
      <div class="flex-grow-1">
        <hr class="flex-grow-1 ms-3 me-3" />
      </div>
       -->
      <!-- Przycisk "Dodaj pole" -->
      {#if config.conditions.length == 2}
      <button class="btn btn-outline-primary" on:click={()=> {removeLastCondition();}}><i class="bi bi-dash" /> usuń
        drugi warunek</button>
      {/if}
      {#if config.conditions.length == 1}
      <button class="btn btn-outline-primary me-1" on:click={addCondition}><i class="bi bi-plus-lg" /> dodaj drugi warunek</button>
      {/if}
    </div>

    <div id="additionalFields">
      {#each config.conditions as condition, i}
      {#if i > 0}

      <div class="container mt-2 mb-2">
        <div class="form-group d-flex align-items-center">
          {#if i ==1 }
          <select class="form-select mb-0 display-7 me-2" style="max-width: 30%;" id="inputOrAnd{i}"
            bind:value={condition.conditionOperator}>
            <option disabled selected value=null>-- wybierz --</option>
            {#each booleabOperators as operator}
            <option value={operator.id}>{operator.name}</option>
            {/each}
          </select>
          {/if}
          <hr class="flex-grow-1 mx-2" />
        </div>
      </div>

      <div class="form-group d-flex align-items-center flex-wrap mb-3">
        <!-- Pierwszy obowiązkowy input (zmniejszony o 25%) -->
        <label for="input1{i}" />
        <input bind:value={condition.measurement} type="text" id="input1{i}" class="form-control me-1"
          style="max-width: 40%;" placeholder="podaj nazwę wartości" />

        <!-- Pozostałe 3 inputy -->
        <label for="input2{i}" />
        <select class="form-select me-1" style="max-width: 20%;" id="input2{i}" bind:value={condition.condition1}>
          <option disabled selected value=null>-- wybierz --</option>
          {#each conditionOperators as operator}
          <option value={operator.id}>{operator.name}</option>
          {/each}
        </select>

        <label for="input3{i}" />
        <input bind:value={condition.value1} type="text" id="input3{i}" class="form-control ms-1"
          style="max-width: 30%;" placeholder="podaj wartość" />
      </div>

      <!-- Paragraf, przycisk "Edytuj", Inputy 5 i 6 w jednej linii dla sm i większej -->
      <div class="form-group d-flex align-items-center flex-wrap mb-3">
        <div class="form-check ms-3 me-2">
          <input bind:checked={orCondition2} on:change={(event)=> {
          addFilterWithIndex(event, i);
          }}
          type="checkbox"
          id="enableEdit{i}"
          class="form-check-input"
          />
          <label class="form-check-label" for="enableEdit{i}">LUB</label>
        </div>
        {#if orCondition2}
        <!--<p class="mt-3 flex-grow-0 me-1">LUB</p>-->
        <p class="mt-3 me-2">{condition.measurement}</p>
        <select class="form-select me-1" style="max-width: 20%;" id="input5{i}" bind:value={condition.condition2}>
          <option disabled selected value=null>-- wybierz --</option>
          {#each conditionOperators as operator}
          <option value={operator.id}>{operator.name}</option>
          {/each}
        </select>
        <input bind:value={condition.value2} type="text" id="input6{i}" class="form-control ms-1"
          style="max-width: 20%;" placeholder="podaj wartość" />
        {/if}
      </div>
      <!--
      <div class="container mt-2 mb-2">
        <div class="form-group d-flex align-items-center">
          {#if i ==1 }
          <select class="form-select mb-0 display-7 me-2" style="max-width: 30%;" id="inputOrAnd{i}"
            bind:value={condition.operator}>
            <option selected value="or">LUB</option>
            <option value="and">ORAZ</option>
          </select>
          {/if}
          <hr class="flex-grow-1 mx-2" />
        </div>
      </div>
    -->
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
        <p class="m-0 me-2" style="white-space: nowrap;">Wywołaj alarm</p>
        <!-- Dropdown z 5 opcjami -->
        <select class="form-select me-2" bind:value={config.result.alertType}>
          {#each alarmLevels as alarmLevel}
          <option selected value={alarmLevel.id}>{alarmLevel.name}</option>
          {/each}
        </select>
        <!-- Input -->
        <input bind:value={config.alertMessage} type="text" class="form-control" placeholder="treść komunikatu" />
      </div>
    </div>
    <div class="d-flex align-items-center mt-2">
      <!-- Input -->
      <label class="form-check-label me-2" for="team_input">Powiadom</label>
      <input id="team_input" required bind:value={config.team} type="text" class="form-control"
        placeholder="loginy oddzielone przecinkami" />
    </div>


    <!-- Kolejna linia z dwoma radiobuttonami i napisem "cześć" -->
    <!--
    <div class=" mt-4">
      <div class="d-flex justify-content-evenly">
        <div class="form-check me-2">
          <input bind:group={selectedOption} on:change={handleInputChange} class="form-check-input" type="radio"
            name="radiogroup" id="radio1" value="1" />
          <label class="form-check-label" for="radio1">Przy każdym wystąpieniu warunków</label>
        </div>
        <div class="form-check">
          <input bind:group={selectedOption} on:change={handleInputChange} class="form-check-input" type="radio"
            name="radiogroup" id="radio2" value="2" />
          <label class="form-check-label" for="radio2">Przy pierwszym wystąpieniu warunków</label>
        </div>
      </div>
    </div>
  -->
  <div class="mt-2">
    <input bind:checked={everyTime} class="form-check-input" type="checkbox"
      id="checkEverytime" />
    <label class="form-check-label mb-2" for="checkEverytime">
      Wysyłaj informacje przy każdym wystąpieniu warunków
    </label>
  </div>

    <!-- Nowa linia z checkboxem "Wysyłaj informacje o powrocie parametrów do normy" -->
    <div class="mt-2">
      <input bind:checked={conditionOk} class="form-check-input" type="checkbox"
        id="defaultCheck1" />
      <label class="form-check-label mb-2" for="defaultCheck1">
        Wysyłaj informacje o powrocie parametrów do normy
      </label>
      {#if conditionOk}
      <input bind:value={config.conditionOkMessage} type="text" class="form-control"
        placeholder="treść komunikatu" />
      {/if}
    </div>

    <!-- Nowa linia z buttonami "Save" i "Cancel" -->
    <div class="row mt-2 justify-content-end">
      <div class="col-md-6 d-flex justify-content-end">
        {#if editable > 0}
        <button type="button" class="btn btn-primary me-2" on:click={(event)=> {
          handleSave(event);
          }}>Save</button>
        {/if}
        <button type="button" class="btn btn-secondary" on:click={()=> {
          goto('/sentinels')
          }}>Cancel</button>
      </div>
    </div>
  </div>


</form>