function load() {
    if (new URLSearchParams(window.location.search).get('app') === "true") {
        document.getElementById('btw').removeAttribute('href');
        document.getElementById('btw').setAttribute('onclick', "loadPage('library', null)");
    }

    let web = document.getElementById('status-website');
    let webst = Date.now();
    this.img = new Image();

    this.img.onload = function() {
        let difference = Date.now() - webst;
           console.log('web took '+difference);

        if (difference >= 2000) { web.innerHTML = "Degraded <img src='./icons/degraded.svg'>"; }
        else { web.innerHTML = "Online <img src='./icons/online.svg'>"; }
    };
    this.img.onerror = function() { web.innerHTML = "Offline <img src='./icons/offline.svg'>"; };

    this.start = new Date().getTime();
    this.img.src = "https://www.withered.app/assets/media/icon.png";

    let api = document.getElementById('status-api');
    let db = document.getElementById('status-database');
    let apist = Date.now();
    $.ajax({
        url: 'https://api.withered.app',
        type: 'get',
        headers: { 'Access-Control-Allow-Origin': "*" },
        crossDomain: true,
        success: function(result){
           let difference = Date.now() - apist;
           console.log('api took '+difference);

           if (difference >= 2000) { api.innerHTML = "Degraded (took "+difference+"ms) <img src='./icons/degraded.svg'>";
                db.innerHTML = "Degraded <img src='./icons/degraded.svg'>"; }
           else { api.innerHTML = "Online <img src='./icons/online.svg'>";
                db.innerHTML = "Online <img src='./icons/online.svg'>"; }
        },
        error: function(result){
            api.innerHTML = "Offline <img src='./icons/offline.svg'>";
            db.innerHTML = "Offline <img src='./icons/offline.svg'>";
        }
    });
}