<script>
  import { sgxhelper } from "$lib/sgxhelper.js";
  import { sgxdata } from "$lib/sgxdata.js";
  import { utils } from "$lib/utils.js";
  import DeviceSelector from "./DeviceSelector.svelte";
  import GroupSelector from "./GroupSelector.svelte";
  import { token, profile, language, isAuthenticated, } from "$lib/usersession.js";
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import Dialog from "$lib/components/Dialog.svelte";

  export let config;
  export let callback;
  export let editable;

  let errorMessage = "";
  let conditionOk = config.conditionOk
  let everyTime = config.everyTime
  let timeShift = config.timeShift == undefined ? 1 : config.timeShift
  let hysteresis = config.hysteresis == undefined ? 0 : config.hysteresis

  console.log('conditionOk/everyTime: ' + conditionOk + '/' + everyTime)

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

  let booleanOperators = [{
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

  let logicalOperators = [{
    id: 1,
    name: "or"
  }, {
    id: 2,
    name: "and"
  }, {
    id: 0,
    name: "none"
  }
]

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

  let labels = {
        'none': {
            'pl': "bez dodatkowego warunku",
            'en': "without additional condition"
        },
        'or': {
            'pl': "LUB dodatkowo",
            'en': "OR additionally"
        },
        'and': {
            'pl': "ORAZ dodatkowo",
            'en': "AND additionally"
        },
      }

  let selectedOption = "1";
  let showEuiModal = false;
  let showGroupModal = false;

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

  let dialog

  function closeDialog(result) {
    console.log("closeDialog", result)
    try { dialog.close() } catch (e) { }
    if (result) {
      handleSave(true)
    }
  }

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

  /**
   * Passes config to collback function
   */
  function handleSave(force) {

    if(!conditionOk){
      config.conditionOkMessage = ''
    }
    if (!force) {
      if (selectedTarget != 1 && selectedTarget != 2 && selectedTarget != 3) {
        //TODO: condition doesn't work
        alert("Nie zdefiniowano targetu, którego ma dotyczyć alert!");
        return;
      }

      let errorMessage1 = validate2('Komunikat zawiera nieobsługiwane zmienne: ', config.alertMessage);
      let errorMessage2 = validate2('Komunikat2 zawiera nieobsługiwane zmienne: ', config.conditionOkMessage);
      errorMessage = errorMessage1
      if (errorMessage2 != '') {
        if (errorMessage1 != '') {
          errorMessage += '\n'
        }
        errorMessage += errorMessage2
      }
      if (errorMessage != "") {
        dialog.showModal()
        console.log("AFTER DIALOG");
        return;
      }
    }
    config.conditions[0].orOperator = orCondition1;
    if (config.conditions.length > 1) {
      config.conditions[1].orOperator = orCondition2;
    }
    config.conditionOk = conditionOk
    config.everyTime = everyTime
    config.timeShift = timeShift
    config.hysteresis = hysteresis
    callback(config);
  }
  function handleCancel(event) {
    callback(null);
  }

  /**
   * Validates if all variables in text are supported
   * @param {String} info
   * @param {String} text
   * @returns {String} empty string if all variables are supported, otherwise returns info + list of unsupported variables
   */
  function validate2(info, text) {
    if (text == null || text == '' || text == undefined) {
      return ''
    }
    let regex = /{[^}]*}/g;
    let keywords = ['{info}', '{tag.name}', '{tag.value}', '{target.eui}', '{target.name}', '{device.eui}', '{device.name}', '{var}', '{value}']
    let matches = text.match(regex);
    console.log('keywords', keywords)
    console.log('matches', matches)
    let result = ''
    let unknownVariables = []
    if (matches != null) {
      for (let i = 0; i < matches.length; i++) {
        let match = matches[i];
        if (!keywords.includes(match)) {
          unknownVariables.push(match)
        }
      }
    }
    if (unknownVariables.length > 0) {
      result = info
      for (let i = 0; i < unknownVariables.length; i++) {
        result += unknownVariables[i]
        if (i < unknownVariables.length - 1) {
          result += ' '
        }
      }
    }
    return result;
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
    if (config.team == null || config.team == '') {
      return 'Nie wybrano użytkowników do powiadomienia'
    }
    if (config.result.message == null || config.result.message == '') {
      return 'Nie wybrano treści komunikatu'
    }
    if (config.conditionOkMessage && (config.conditionOkMessageText == null || config.conditionOkMessageText == '')) {
      return 'Nie wybrano treści komunikatu o powrocie parametrów do normy'
    }
    return ''
  }

</script>
<Dialog title="Uwaga!" message={errorMessage} bind:dialog callback={closeDialog}>
</Dialog>
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
          <label for="timeshift" class="me-2" style="white-space: nowrap;">Uwzględniaj dane nie starsze niż
            (min.):</label>
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
        <div class="col-sm-3">

          <select class="form-select" style="width: 100%;" id="input2" bind:value={config.conditions[0].logic} >
            {#each logicalOperators as operator}
            <option value={operator.id}>{utils.getLabel(operator.name, labels, $language)}</option>
            {/each}
          </select>
        </div>

        {#if config.conditions[0].logic>0}
        <!--<p class="mt-3 mb-3 flex-grow-0 me-2">LUB</p>-->
        <p class="mt-2 mb-2 me-2 ms-2">{config.conditions[0].measurement}</p>
        <select class="form-select mb-2 mb-sm-0" style="width: 20%;" id="input5"
          bind:value={config.conditions[0].condition2}>
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
        <button class="btn btn-outline-primary me-1" on:click={addCondition}><i class="bi bi-plus-lg" /> dodaj drugi
          warunek</button>
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
              {#each booleanOperators as operator}
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
          <div class="form-check me-2">
            <select class="form-select" style="width: 100%;" id="input2a" bind:value={config.conditions[1].logic} >
              {#each logicalOperators as operator}
              <option value={operator.id}>{utils.getLabel(operator.name, labels, $language)}</option>
              {/each}
            </select>
<!--             <input bind:checked={orCondition2} on:change={(event)=> {
            addFilterWithIndex(event, i);
            }}
            type="checkbox"
            id="enableEdit{i}"
            class="form-check-input"
            />
            <label class="form-check-label" for="enableEdit{i}">LUB</label> -->
          </div>
          {#if config.conditions[1].logic>0}
          <!--<p class="mt-3 flex-grow-0 me-1">LUB</p>-->
          <p class="mt-3 me-2">{condition.measurement}</p>
          <select class="form-select me-1" style="max-width: 20%;" id="input5{i}" bind:value={condition.condition2}>
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
          <!--<input bind:value={config.alertMessage} type="text" class="form-control" placeholder="treść komunikatu" />-->
          <label class="form-check-label me-2" for="input-message">Treść komunikatu</label>
          <textarea class="form-control" id="input-message" rows="2" bind:value={config.alertMessage} />
        </div>
      </div>
      <div class="d-flex align-items-center mt-2">
        <!-- Input -->
        <label class="form-check-label me-2" for="team_input">Alarm wyślij do </label>
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
        <input bind:checked={everyTime} class="form-check-input" type="checkbox" id="checkEverytime" />
        <label class="form-check-label mb-2" for="checkEverytime">
          Wysyłaj informacje przy każdym wystąpieniu warunków
        </label>
      </div>

      <!-- Nowa linia z checkboxem "Wysyłaj informacje o powrocie parametrów do normy" -->
      <div class="row mt-2">
        <div class="col">
          <input bind:checked={conditionOk} class="form-check-input" type="checkbox" id="defaultCheck1" />
          <label class="form-check-label mb-2" for="defaultCheck1">
            Wysyłaj informacje o powrocie parametrów do normy
          </label>
        </div>
      </div>
      {#if conditionOk}
      <div class="row mt-2">
        <div class="col">
          <!--<input bind:value={config.conditionOkMessage} type="text" class="form-control"
            placeholder="treść komunikatu" />-->
          <label class="form-check-label mb-2" for="input-okmessage">Treść komunikatu o powrocie parametrów do
            normy</label>
          <textarea class="form-control" id="input-okmessage" rows="2" bind:value={config.conditionOkMessage} />
        </div>
      </div>
      {/if}

      <!-- Nowa linia z buttonami "Save" i "Cancel" -->
      <div class="row mt-2 justify-content-end">
        <div class="col-md-6 d-flex justify-content-end">
          {#if editable > 0}
          <button type="button" class="btn btn-primary me-2" on:click={(event)=> {
            handleSave(false);
            }}>Save</button>
          {/if}
          <button type="button" class="btn btn-secondary" on:click={()=> {
            goto('/sentinels')
            }}>Cancel</button>
        </div>
      </div>
    </div>


</form>