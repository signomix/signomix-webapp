<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels, $language)}</h5>
</div>
{#await data}
{:then data}
<div class="row mb-3">
    <div class="col-md-12">
        <div class="card">
            <BillingPlanDetails actualPlan={$profile.type} />
        </div>
    </div>
</div>
{#if utils.isDefaultOrganizationUser($profile)}
<div class="row mb-3">
    <div class="col-md-4 mb-3">
        <div class="card h-100">
            <BillingPlanDetails actualPlan={$profile.type} targetPlan={0} />
        </div>
    </div>
    <div class="col-md-4 mb-3">
        <div class="card h-100">
            <BillingPlanDetails actualPlan={$profile.type} targetPlan={5} />
        </div>
    </div>
    <div class="col-md-4 mb-3">
        <div class="card h-100">
            <BillingPlanDetails actualPlan={$profile.type} targetPlan={100} />
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
    import BillingPlanDetails from '$lib/components/BillingPlanDetails.svelte';

    export let data;

    onMount(async () => {
        if (!$isAuthenticated) {
            console.log('redirect to login');
            goto('/login');
        }
    });

    let labels = {
        'title': {
            'en': "Billing",
            'pl': "Płatności"
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
    }

</script>