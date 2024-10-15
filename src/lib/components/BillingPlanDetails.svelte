{#if (targetPlan === undefined || targetPlan === null)}
<div class="card-header">
    <h4>{utils.getLabel('yourPlan',labels, $language)}</h4>
</div>
{/if}
<div class="card-body">
    {#if (targetPlan === undefined || targetPlan === null)}
    <h4 class="card-title">{utils.getLabel(getUserTypeName(actualPlan),labels, $language)}</h4>
    {:else}
    <h4 class="card-title text-center">{utils.getLabel(getUserTypeName(targetPlan),labels, $language)}</h4>
    {/if}
    {#if !(targetPlan === undefined || targetPlan === null) && pricing !== undefined}
    <div class="row">
        <div class="col-md-12 text-center my-2">
            {#if yearly}
            <h4 class="card-text">{pricing[targetPlan][$language].yearly}</h4>
            {:else}
            <h4 class="card-text">{pricing[targetPlan][$language].monthly}</h4>
            {/if}
        </div>
    </div>
    {/if}
    <div class="row">
        {#if !(targetPlan === undefined || targetPlan === null)}
        <div class="col-md-12">
            <p class="card-text">{utils.getLabel('planDetails',labels, $language)}</p>
            {#if utils.isDefaultOrganizationUser($profile)  && (targetPlan == 4 || targetPlan == 5 || targetPlan == 0)}
            <ul>
                <li>{getNumberOfDataSources(targetPlan)+' '+utils.getLabel('dataSources',labels, $language)}</li>
                <li>{getDataRetentionDays(targetPlan)+' '+utils.getLabel('dataRetention',labels, $language)}</li>
                <li>{utils.getLabel(getSupportName(targetPlan),labels, $language)}</li>
            </ul>
            {:else}
            <ul>
                <li>{utils.getLabel('organizationDataSources',labels, $language)}</li>
                <li>{utils.getLabel('organizationDataRetention',labels, $language)}</li>
                <li>{utils.getLabel(getSupportName(targetPlan),labels, $language)}</li>
            </ul>         
            {/if}
        </div>
        {:else}
        <div class="col-md-6">
            <h6 class="card-text">{utils.getLabel('planDetails',labels, $language)}</h6>
            {#if utils.isDefaultOrganizationUser($profile)  && (actualPlan == 4 || actualPlan == 5 || actualPlan == 0)}
            <ul>
                <li>{getNumberOfDataSources(actualPlan)+' '+utils.getLabel('dataSources',labels, $language)} <InfoText></InfoText></li>
                <li>{getDataRetentionDays(actualPlan)+' '+utils.getLabel('dataRetention',labels, $language)}</li>
                <li>{utils.getLabel(getSupportName(actualPlan),labels, $language)}</li>
            </ul>
            {:else}
            <ul>
                <li>{utils.getLabel('organizationDataSources',labels, $language)}</li>
                <li>{utils.getLabel('organizationDataRetention',labels, $language)}</li>
                <li>{utils.getLabel(getSupportName(actualPlan),labels, $language)}</li>
            </ul>
            {/if}
        </div>
        <div class="col-md-6">
            <h6 class="card-text">{utils.getLabel('paymentHistory',labels, $language)}</h6>
            <p>{utils.getLabel('paymentHistoryNotAvailable',labels, $language)}</p>
        </div>
        {/if}
    </div>
</div>
{#if !(targetPlan === undefined || targetPlan === null)}
<div class="card-footer">
    <a href="/account/billing/change_plan/{targetPlan}"
        class="btn-sticked btn btn-outline-primary">{utils.getLabel('changePlan',labels,$language)}</a>
</div>
{/if}

<script>
    import { token, profile, language, isAuthenticated } from '$lib/usersession.js';
    import { utils } from '$lib/utils';
    import InfoText from '$lib/components/InfoText.svelte';
    export let actualPlan;
    export let targetPlan;
    export let pricing;
    export let yearly

    /** Returns the name of the user type.
     * Similar to the function in src/lib/utils.js but with limited names available.
     * @param {number} type - the type of the user
     * @returns {string} - the name of the user type
     */
    function getUserTypeName(type) {
        if (utils.isDefaultOrganizationUser($profile)) {
            switch (type) {
                case 0:
                    return 'user';
                case 4:
                    return 'free';
                case 5:
                    return 'primary';
                default:
                    return 'otherAccountType';
            }
        } else {
            return 'organizationType';
        }
    }

    function getDataRetentionDays(accountType) {
        if (utils.isDefaultOrganizationUser($profile)) {
            switch (accountType) {
                case 0:
                    return 30;
                case 4:
                    return 7;
                case 5:
                    return 365;
                default:
                    return 'organizationDataRetention';
            }
        } else {
            return 'organizationDataRetention';
        }
    }

    function getSupportName(accountType) {
        if (utils.isDefaultOrganizationUser($profile)) {
            switch (accountType) {
                case 0:
                    return 'emailSupport';
                case 4:
                    return 'communitySupport';
                case 5:
                    return 'trackerSupport';
                default:
                    return 'otherSupport';
            }
        }else{
            return 'otherSupport';
        }
    }

    function getNumberOfDataSources(accountType) {
        if (utils.isDefaultOrganizationUser($profile)) {
            switch (accountType) {
                case 0:
                    return 20;
                case 4:
                    return 5;
                case 5:
                    return 50;
                default:
                    return 'organizationDataSources';
            }
        } else {
            return 'organizationDataSources';
        }
    }

    let labels = {
        yourPlan: {
            en: "Your current plan",
            pl: "Twój aktualny plan"
        },
        planDetails: {
            en: 'Plan details:',
            pl: 'Szczegóły planu:'
        },
        changePlan: {
            en: 'Change plan',
            pl: 'Zmień plan'
        },
        paymentHistory: {
            en: 'Payment history',
            pl: 'Historia płatności'
        },
        paymentHistoryNotAvailable: {
            en: 'Payment history is not available yet',
            pl: 'Historia płatności nie jest na razie dostępna'
        },
        paymentHistoryNotAvailableForAccount: {
            en: 'Payment history is not available for this account',
            pl: 'Historia płatności nie jest dostępna dla tego konta'
        },
        free: {
            en: 'Free account',
            pl: 'Konto Darmowe'
        },
        user: {
            en: 'Standard account',
            pl: 'Konto Standardowe'
        },
        primary: {
            en: 'Premium account',
            pl: 'Konto Premium'
        },
        otherAccountType: {
            pl: 'Konto dedykowane',
            en: 'Dedicated account'
        },
        organizationType: {
            pl: 'Konto organizacyjne',
            en: 'Organization account'
        },
        dataSources: {
            en: 'data sources',
            pl: 'źródeł danych'
        },
        dataRetention: {
            pl: 'dniowy okres retencji danych',
            en: 'days data retention period'
        },
        emailSupport: {
            en: 'e-mail support',
            pl: 'wsparcie e-mailowe'
        },
        communitySupport: {
            en: 'community support',
            pl: 'wsparcie społecznościowe'
        },
        trackerSupport: {
            en: 'support via GitHub dedicated issue tracker',
            pl: 'wsparcie poprzez dedykowany system zgłoszeń na GitHubie'
        },
        otherSupport: {
            pl: 'rodzaj wsparcia zależy od umowy',
            en: 'type of support depends on the agreement'
        },
        organizationDataSources: {
            pl: 'liczba źródeł danych zależy od umowy',
            en: 'number of data sources depends on the agreement'
        },
        organizationDataRetention: {
            pl: 'okres retencji danych zależy od umowy',
            en: 'data retention period depends on the agreement'            
        },
    }
</script>