<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
    <h5>{utils.getLabel('title',labels,$language)}</h5>
</div>
<div class="container">
    <div class="row mt-2">
        <div class="col-md-12 alert alert-success"><span>{utils.getLabel('thanks',labels,$language)}</span></div>
    </div>
</div>

<script>
    import { language } from '$lib/usersession.js';
    import { utils } from '$lib/utils.js';

    let labels = {
        'title': {
            'pl': "Rejestracja potwierdzona",
            'en': "Registration confirmed"
        },
        'thanks': {
            'pl': "Dziękujemy za potwierdzenie rejestracji. Możesz się teraz zalogować.",
            'en': "Thank you for confirming your registration. You can now log in."
        }
    }
</script>