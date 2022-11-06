function load() {
    if (new URLSearchParams(window.location.search).get('app') === "true") {
        document.getElementById('btw').removeAttribute('href');
        document.getElementById('btw').setAttribute('onclick', "loadPage('library', null)");
    }

    let statuses = {'web':'Loading...', 'api':'Loading...'};

    let web = document.getElementById('status-website');
    let webst = Date.now();
    this.img = new Image();

    this.img.onload = function() {
        let difference = Date.now() - webst;
        if (difference >= 2000) { web.innerHTML = "Degraded <img src='./icons/degraded.svg'>"; statuses.web = "Degraded"; }
        else { web.innerHTML = "Online <img src='./icons/online.svg'>"; statuses.web = "Online"; }
    };
    this.img.onerror = function() { web.innerHTML = "Offline <img src='./icons/offline.svg'>"; statuses.web = "Offline"; };

    this.start = new Date().getTime();
    this.img.src = "https://www.withered.app/assets/media/icon.png";

    let api = document.getElementById('status-api');
    let apist = Date.now();
    $.ajax({
        url: 'https://api.withered.app',
        type: 'get',
        headers: { 'Access-Control-Allow-Origin': "*" },
        crossDomain: true,
        success: function(result){
           let difference = Date.now() - apist;
           console.log('api took '+difference);

           if (difference >= 2000) { api.innerHTML = "Degraded (took "+difference+"ms) <img src='./icons/degraded.svg'>"; statuses.api = "Degraded"; }
           else { api.innerHTML = "Online <img src='./icons/online.svg'>"; statuses.api = "Online"; }
        },
        error: function(result){
            api.innerHTML = "Offline <img src='./icons/offline.svg'>"; statuses.api = "Offline";
        }
    });

    setInterval(()=>{setSummary(JSON.stringify(statuses))}, 250);
}
function setSummary(statusesog) {
    let statuses = JSON.parse(statusesog);
    let summary = document.getElementById('summary');
    let e = true;
    for(let i=0; i<Object.values(statuses).length; i++) {
        if (Object.values(statuses)[i] === "Loading...") e = false;
    }
    if (e === true) {
        let onlines = 0;
        let degradeds = 0;
        let offlines = 0;
        for(let i=0; i<Object.values(statuses).length; i++) {
            if (Object.values(statuses)[i] === "Online") { onlines++; }
            else if (Object.values(statuses)[i] === "Degraded") { degradeds++; }
            else if (Object.values(statuses)[i] === "Offline") { offlines++; }
        }
        if (degradeds === 0 && offlines === 0 && onlines > 0) { summary.innerHTML = "All services online <img src='./icons/online.svg'>"; }
        else if (onlines === 0 && degradeds === 0 && offlines > 0) { summary.innerHTML = "All services offline <img src='./icons/offline.svg'>"; }
        else if (onlines >= degradeds && onlines >= offlines) { summary.innerHTML = "Most services online <img src='./icons/online.svg'>"; }
        else if (degradeds >= onlines && degradeds >= offlines) { summary.innerHTML = "Most services degraded <img src='./icons/degraded.svg'>"; }
        else if (offlines >= degradeds && offlines >= onlines) { summary.innerHTML = "Most services offline <img src='./icons/offline.svg'>"; }
        console.log("o: "+onlines+", d: "+degradeds+", of: "+offlines)
    }
}