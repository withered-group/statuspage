function load() {
    if (new URLSearchParams(window.location.search).get('app') === "true") {
        document.getElementById('btw').removeAttribute('href');
        document.getElementById('btw').setAttribute('onclick', "loadPage('library', null)");
    }

    setStatus('web', 'loading'); setStatus('api', 'loading'); setStatus('db', 'loading');

    let webst = Date.now();
    this.img = new Image();
    this.img.onload = function() {
        let difference = Date.now() - webst;
           console.log('web took '+difference);

        if (difference >= 2000) { setStatus('web', 'degraded', difference); }
        else { setStatus('web', 'online', difference); }
    };
    this.img.onerror = function() { setStatus('web', 'offline'); };
    this.start = new Date().getTime();
    this.img.src = "https://www.withered.app/assets/media/icon.png";

    let apist = Date.now();
    $.ajax({
        url: 'https://api.withered.app',
        type: 'get',
        headers: { 'Access-Control-Allow-Origin': "*" },
        crossDomain: true,
        success: function(result){
           let difference = Date.now() - apist;
           console.log('api took '+difference);

           if (difference >= 2000) { setStatus('api', 'degraded', difference); setStatus('db', 'degraded', difference); }
           else { setStatus('api', 'online', difference); setStatus('db', 'online', difference); }
        },
        error: function(result){
            setStatus('api', 'offline'); setStatus('db', 'offline');
        }
    });
}

function setStatus(service, status, ping=0) {
    let e = document.getElementById('status-'+service);
    e.classList = "status";
    e.classList.add(status);
    if (status === "online") { e.innerHTML = "Online <img src='./icons/online.svg'>"; }
    else if (status === "degraded") { e.innerHTML = "Degraded ("+ping+"ms) <img src='./icons/degraded.svg'>"; }
    else if (status === "offline") { e.innerHTML = "Offline <img src='./icons/offline.svg'>"; }
    else if (status === "loading") { e.innerHTML = "Loading... <img src='./icons/loading.svg'>"; }
    else if (status === "couldnotload") { e.innerHTML = "Could not load <img src='./icons/loading.svg'>"; }
}