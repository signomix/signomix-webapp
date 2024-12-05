<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
{#await data then data}
<div class="row mb-3">
    <div class="col-md-12">
        <div class="card">
            <BillingPlanDetails actualPlan={$profile.type} pricing={pricing} />
        </div>
    </div>
</div>
{#if utils.isDefaultOrganizationUser($profile)}
<div class="row mb-3">
    <div class="col-md-12 mt-3 mb-1 w-100">
        <div class="d-flex justify-content-center w-100">
            <label class="me-3 h6" for="customSwitch1">{utils.getLabel('monthlyPayload',labels, $language)}</label>
            <div class="form-check form-switch h6">
                <input class="form-check-input h6" type="checkbox" id="customSwitch1" bind:checked={yearlySelected} style="width: 3rem;">
            </div>
            <label class="ms-3 h6" for="customSwitch1">{utils.getLabel('yearlyPayload',labels, $language)}</label>
        </div>
    </div>
</div>
<div class="row mb-3">
    <div class="col-md-4 mb-3">
        <div class="card h-100">
            <BillingPlanDetails actualPlan={$profile.type} targetPlan={0} pricing={pricing} yearly={yearlySelected} />
        </div>
    </div>
    <div class="col-md-4 mb-3">
        <div class="card h-100">
            <BillingPlanDetails actualPlan={$profile.type} targetPlan={5} pricing={pricing} yearly={yearlySelected} />
        </div>
    </div>
    <div class="col-md-4 mb-3">
        <div class="card h-100">
            <BillingPlanDetails actualPlan={$profile.type} targetPlan={100} pricing={pricing} yearly={yearlySelected} />
        </div>
    </div>
</div>
{:else}
<div class="row mb-3">
    <div class="col-md-12 mb-3">
        <div class="card h-100 p-2">
            <p>{utils.getLabel('organizationComment',labels, $language)}</p>
        </div>
    </div>
</div>
{/if}
{:catch error}
<div class="alert alert-danger" role="alert">
    {error.message}
</div>
{/await}

<script>
    import SettingsForm from '$lib/components/SettingsForm.svelte';
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { utils } from '$lib/utils.js';
    import { platformInfo } from '$lib/stores.js';
    import BillingPlanDetails from '$lib/components/BillingPlanDetails.svelte';

    export let data;
    let yearlySelected = false;

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
        if (!$platformInfo.paidVersionAvailable){
            goto('/');
        }   
    });

    let pricing={
        yearlyPLN:$platformInfo.pricesYearlyPLN,
        monthlyPLN:$platformInfo.pricesMonthlyPLN
    }

    let labels = {
        'title': {
            'en': "Billing",
            'pl': "Płatności"
        },
        'monthlyPayload': {
            'pl': "Płatność miesięczna",
            'en': "Monthly payment"
        },
        'yearlyPayload': {
            'pl': "Płatność roczna (miesiąc gratis)",
            'en': "Yearly payment (1 month free)"
        },
        'free': {
            'en': "Free account",
            'pl': "Konto darmowe"
        },
        'standard': {
            'en': "Standard account",
            'pl': "Konto standardowe"
        },
        'premium': {
            'en': "Premium account",
            'pl': "Konto premium"
        },
        'professional': {
            'en': "Professional account",
            'pl': "Konto profesjonalne"
        },
        'organization': {
            'en': "Organization account",
            'pl': "Konto organizacyjne"
        },
        'changePlan': {
            'en': "Change plan",
            'pl': "Zmień plan"
        },
        'organizationComment': {
            'en': "You are using an organization account. To change the plan, please contact the administrator.",
            'pl': "Korzystasz z konta organizacyjnego. Aby zmienić plan, skontaktuj się z administratorem."
        }
    }

</script>