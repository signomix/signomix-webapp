<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
{#await data}
{:then data}
<div class="container">
    {#if formSent}
    <div class="alert alert-success" role="alert">
        <p><b>Zamówienie zostało zarejestrowane.</b></p>
        <p>Wkrótce, na podany w zamówieniu adres e-mail otrzymasz potwierdzenie wraz informacją na temat płatności.</p>
        <p><b>Jeżeli potwierdzenie nie dotrze w ciągu 24 godzin</b>, prosimy o kontakt poprzez wysłanie 
            wiadomości na adres contact@experiot.pl
        </p>
    </div>
    {:else}
    {#if (data.targetAccountType == "100")}
    <div class="alert alert-warning" role="alert">
        <p><b>Uwaga!</b></p>
        <p>Wybrany plan jest dostępny po wcześniejszym podpisaniu umowy utrzymaniowej z administratorem 
            serwisu signomix.com. W celu uzyskania dodatkowych informacji prosimy o kontakt poprzez
            wysłanie wiadomości na adres contact@experiot.pl
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
                <label for="accountType" class="form-label">Account Type</label>
                <select class="form-select" id="accountType" required>
                    <option value="" selected disabled>Select account type</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label for="paymentPeriod" class="form-label">Payment Period</label>
            <div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="paymentPeriod" id="monthly" value="monthly" required>
                    <label class="form-check-label" for="monthly">Monthly</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="paymentPeriod" id="yearly" value="yearly" required>
                    <label class="form-check-label" for="yearly">Yearly</label>
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" bind:value={order.name}>
            </div>
            <div class="col-md-6">
                <label for="surname" class="form-label">Surname</label>
                <input type="text" class="form-control" id="surname">
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6" id="companyNameField">
                <label for="companyName" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName">
            </div>
            <div class="col-md-6">
                <label for="vat" class="form-label">VAT</label>
                <input type="text" class="form-control" id="vat">
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" required>
            </div>
            <div class="col-md-6">
                <label for="city" class="form-label">City</label>
                <input type="text" class="form-control" id="city" required>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label for="zip" class="form-label">Zip Code</label>
                <input type="text" class="form-control" id="zip" required>
            </div>
            <div class="col-md-6">
                <label for="country" class="form-label">Country</label>
                <input type="text" class="form-control" id="country" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required>
        </div>

        <button type="button" class="btn btn-primary" on:click|preventDefault={sendForm}>Submit</button>
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

    export let data;
    let formSent = false;

    let order = {
        uid: $profile.uid,
        userNumber: $profile.number,
        targetType: data.targetAccountType,
        uid: $profile.uid,
        email:$profile.email,
        name: $profile.name,
        surname: $profile.surname,
        companyName: '',
        vat: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        accountType: $profile.type,
        paymentYearly: false
    };

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    });

    function sendForm() {
        console.log('sendForm');
        console.log(order);
        /* fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $token
            },
            body: JSON.stringify(order)
        }).then(response => {
            if (response.ok) {
                formSent = true;
            } else {
                console.log('error');
            }
        }); */
        formSent = true;
    }

    let labels = {
        'title': {
            'pl': "Zamówienie subskrypcji",
            'en': "Subscription order"
        }
    }
</script>