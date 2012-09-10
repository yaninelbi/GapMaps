var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    onError: function() {
        //alert("oh no!");    
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        app.report('deviceready');
    },
    report: function(id) { 
        switch(id)
        {
            case 'deviceready':
                navigator.geolocation.getCurrentPosition(this.loadmap, this.onError);
                break;
        }
    },
    loadmap: function(position){ 
        var po = org.polymaps;
        latitude = (position.coords.latitude);
        longtitude = (position.coords.longitude);

        var map = po.map()
            .container(document.getElementById("mapDiv").appendChild(po.svg("svg")))
            .center({lat:  latitude, lon: longtitude})
            .zoom(17)
            .add(po.interact())
            .add(po.hash());

        map.add(po.image()
            .url(po.url("http://{S}tile.cloudmade.com"
            + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
            + "/999/256/{Z}/{X}/{Y}.png")
            .hosts(["a.", "b.", "c.", ""])));

        map.add(po.compass()
            .pan("none"));

       // var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),

    }
};

