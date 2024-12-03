<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
{#await data}
{:then data}
<div class="container">
    {#if formSent}
    {#await orderId then orderId}
    <div class="alert alert-success" role="alert">
        <p><b>Zarejestrowane zostało zamówienie nr {orderId}.</b></p>
        <p>Wkrótce, na podany w zamówieniu adres e-mail {order.email} otrzymasz potwierdzenie wraz informacją na temat płatności.</p>
        <p><b>Jeżeli potwierdzenie nie dotrze w ciągu 24 godzin</b>, prosimy o kontakt poprzez wysłanie
            wiadomości na adres contact@experiot.pl
        </p>
    </div>
    {/await}
    {:else if errorMessage}
    <div class="alert alert-danger" role="alert">
        <p><b>Wystąpił błąd podczas przetwarzania zamówienia.</b></p>
        <p>Prosimy o kontakt poprzez wysłanie wiadomości na adres contact@experiot.pl</p>
        <p>Komunikat błędu: {errorMessage}</p>
    </div>
    {:else}
    {#if (data.targetAccountType == "100")}
    <div class="alert alert-warning" role="alert">
        <p><b>{utils.getLabel('attention',labels, $language)}</b></p>
        <p>{utils.getLabel('message',labels, $language)}
        </p>
    </div>
    {:else}
    <form id="registrationForm">
        <div class="row mb-3">
            <div class="col-md-6">
                <label for="userLogin" class="form-label">User</label>
                <input type="text" class="form-control" id="userLogin" bind:value={$profile.uid} readonly disabled>
            </div>
            <div class="col-md-6">
                <label for="accountType" class="form-label">Zamawiasz jako</label>
                <select class="form-select" id="accountType" required bind:value={vatField}>
                    <option value={false}>Osoba prywatna</option>
                    <option value={true}>Firma</option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label for="paymentPeriod" class="form-label">Okres płatności</label>
            <div>
                <div class="form-check form-check-inline">
                    <input checked={selectedYearly===false} on:change={onChange} class="form-check-input" type="radio"
                        name="paymentPeriod" id="monthly" value=false 
                        oninvalid="this.setCustomValidity('Wybierz okres płatności')" oninput="this.setCustomValidity('')" required>
                    <label class="form-check-label" for="monthly">Monthly</label>
                </div>
                <div class="form-check form-check-inline">
                    <input checked={selectedYearly===true} on:change={onChange} class="form-check-input" type="radio"
                        name="paymentPeriod" id="yearly" value="true" required>
                    <label class="form-check-label" for="yearly">Yearly</label>
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" bind:value={order.name}
                oninvalid="this.setCustomValidity('Podaj imię')" oninput="this.setCustomValidity('')" required>
            </div>
            <div class="col-md-6">
                <label for="surname" class="form-label">Surname</label>
                <input type="text" class="form-control" id="surname" bind:value={order.surname}
                oninvalid="this.setCustomValidity('Podaj nazwisko')" oninput="this.setCustomValidity('')" required>
            </div>
        </div>

        {#if vatField===true}
        <div class="row mb-3">
            <div class="col-md-6" id="companyNameField">
                <label for="companyName" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName" bind:value={order.companyName} 
                oninvalid="this.setCustomValidity('Podaj nazwę firmy')" oninput="this.setCustomValidity('')" required>
            </div>
            <div class="col-md-6">
                <label for="taxNumber" class="form-label">NIP</label>
                <input type="text" class="form-control" id="taxNumber" bind:value={order.taxNumber} 
                oninvalid="this.setCustomValidity('Podaj nr NIP')" oninput="this.setCustomValidity('')" required>
            </div>
        </div>
        {/if}

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" bind:value={order.address} 
                oninvalid="this.setCustomValidity('Podaj adres')" oninput="this.setCustomValidity('')" required>
            </div>
            <div class="col-md-6">
                <label for="city" class="form-label">City</label>
                <input type="text" class="form-control" id="city" bind:value={order.city} 
                oninvalid="this.setCustomValidity('Podaj nazwę miasta')" oninput="this.setCustomValidity('')" required>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="zip" class="form-label">Zip Code</label>
                <input type="text" class="form-control" id="zip" bind:value={order.zip} 
                oninvalid="this.setCustomValidity('Podaj kod pocztowy')" oninput="this.setCustomValidity('')" required>
            </div>
            <div class="col-md-6">
                <label for="country" class="form-label">Country</label>
                <!--                 <input type="text" class="form-control" id="country" bind:value={order.country} required> -->
                <select class="form-select" id="country" bind:value={order.country}
                    oninvalid="this.setCustomValidity('Wybierz kraj')" oninput="this.setCustomValidity('')"
                    required>
                    <!-- <option value="" selected="{order.country==''}" disabled>Wybierz kraj</option> -->
                    <option value="poland">Polska</option>

                </select>
            </div>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" bind:value={order.email}
                oninvalid="this.setCustomValidity('Podaj adres e-mail')" oninput="this.setCustomValidity('')" required>
        </div>

        <button type="button" class="btn btn-primary" on:click|preventDefault={validateForm}>Submit</button>
    </form>
    {/if}
    {/if}
</div>
{/await}
<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import { platformInfo } from '$lib/stores.js';

    export let data;
    let formSent = false;
    let orderId = null;
    let errorMessage = false;
    let selectedYearly = false;
    let vatField = false;

    let pricing = {
        '0': {
            'monthly': 50,
            'yearly': 550,
        },
        '5': {
            'monthly': 200,
            'yearly': 2200
        },
        '100': {
            'monthly': 200,
            'yearly': 2200
        }
    }

    let order = {
        uid: $profile.uid,
        userNumber: $profile.number,
        accountType: $profile.type,
        targetType: data.targetAccountType,
        name: $profile.name,
        surname: $profile.surname,
        email: $profile.email,
        companyName: '',
        taxNumber: '',
        address: '',
        city: '',
        zip: '',
        country: 'poland',
        yearly: selectedYearly,
    };

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
        if (!$platformInfo.paidVersionAvailable){
            goto('/');
        }  
    });

    function onChange(event) {
        selectedYearly = event.currentTarget.value;
    }

    function validateForm() {
        let form = document.getElementById('registrationForm');
        if (form.checkValidity()) {
            sendForm();
        } else {
            form.reportValidity();
        }
    }

    function sendForm() {
        console.log('sendForm');
        console.log(order);
        order.yearly = selectedYearly;
        fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': $token
            },
            body: JSON.stringify(order)
        }).then(response => {
            if (response.ok) {
                formSent = true;
                orderId = response.text();
            } else {
                errorMessage=response.statusText;
                console.log('error');
            }
        }).catch(error => {
            console.log(error);
            errorMessage=error;
        })
    }

    let labels = {
        'title': {
            'pl': "Zamówienie subskrypcji",
            'en': "Subscription order"
        },
        'attention': {
            'pl': "Uwaga!",
            'en': "Attention!"
        },
        'message': {
            'pl': "Wybrany plan jest dostępny po wcześniejszym podpisaniu umowy utrzymaniowej z administratorem serwisu signomix.com. W celu uzyskania dodatkowych informacji prosimy o kontakt poprzez wysłanie wiadomości na adres contact@experiot.pl",
            'en': "The selected plan is available after signing a maintenance agreement with the signomix.com service administrator. For additional information, please contact us by sending a message to contact@experiot.pl"
        }
    }
</script>