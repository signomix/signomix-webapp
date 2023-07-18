<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h5>Ustawienia</h5>
</div>
<div class="col-12">
    <table class="table">
        <tbody>
            <tr>
                <td>Login</td>
                <td>{data.settings.uid}</td>
            </tr>
            <tr>
                <td>Name</td>
                <td>{data.settings.name}</td>
            </tr>
            <tr>
                <td>Surname</td>
                <td>{data.settings.surname}</td>
            <tr>
                <td>Role</td>
                <td>{data.settings.role}</td>
            </tr>
            <tr>
                <td>Language</td>
                <td>{data.settings.preferredLanguage}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{data.settings.email}</td>
            </tr>
            <tr>
                <td>Registration date</td>
                <td>{new Date(data.settings.createdAt).toISOString() }</td>
            </tr>
        </tbody>
    </table>
    <table class="table mt-2">
        <thead>
            <tr>
                <th scope="col" class="col-3">Notification type</th>
                <th scope="col" class="col-2">Channel</th>
                <th scope="col" class="col-7">Configuration</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="col-3">General notifications</td>
                <td class="col-2">{getChannelType(data.settings.generalNotificationChannel)}</td>
                <td class="col-7">{getChannelConfig(data.settings.generalNotificationChannel)}</td>
            </tr>
            <tr>
                <td class="col-3">Info notifications</td>
                <td class="col-2">{getChannelType(data.settings.infoNotificationChannel)}</td>
                <td class="col-7">{getChannelConfig(data.settings.infoNotificationChannel)}</td>
            </tr>
            <tr>
                <td class="col-3">Warning notifications</td>
                <td class="col-2">{getChannelType(data.settings.warningNotificationChannel)}</td>
                <td class="col-7">{getChannelConfig(data.settings.warningNotificationChannel)}</td>
            </tr>
            <tr>
                <td class="col-3">Alert notifications</td>
                <td class="col-2">{getChannelType(data.settings.alertNotificationChannel)}</td>
                <td class="col-7">{getChannelConfig(data.settings.alertNotificationChannel)}</td>
            </tr>
        </tbody>
    </table>
</div>
<script>
    export let data;
    console.log(data);

    function getChannelType(config){
        if(config.startsWith("SIGNOMIX")){
            return "Application";
        }else if(config.startsWith("SMTP")){
            return "Email";
        }else if(config.startsWith("SMS")){
            return "SMS";
        }else if(config.startsWith("WEBHOOK")){
            return "Webhook";
        }else{
            return "Unknown";
        }
    }

    function getChannelConfig(config){
        console.log("config: ",config);
        if(config.indexOf(":")>0){
            return config.substring(config.indexOf(":")+1);
        }else{
            return "";
        }
    }

</script>