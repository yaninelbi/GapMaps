function l(l){
    console.log(l);
}


var mapObj = {
    readyState : false,
    map : {},
    markerLayer_self : {},
    m_interaction : {},
    usr_changing_coords : false,
    usr_track_position : true,
    map_div : 'mapDiv',
    map_div_dimensions : {width:$(document).width(),height:$(document).height()},
    curCoords : {},
    viewCoords : {},
    curZoom : 17,
    features_self : [{
    "geometry": { "type": "Point", "coordinates": [0, 0]},
    "properties": {
          'marker-color': '#f63a39',
          'marker-symbol': 'pitch',
          'marker-size': 'medium',      }
    }],

    initmap : function(){
        console.log($(document).width())
        this.curCoords.lat=0;
        this.curCoords.lon=0;
        this.map = mapbox.map(this.map_div,false,{x:this.map_div_dimensions.width,y:this.map_div_dimensions.height}).zoom(this.curZoom).center({ lat: 0, lon: 0 });
        this.markerLayer_self = mapbox.markers.layer().features(this.features_self) .key(function(f) { return f.properties.id;});;
        this.m_interaction = mapbox.markers.interaction(this.markerLayer_self);
        
    /*this.m_interaction.formatter(function(feature) {
        var o = '<a target="_blank" href="' + feature.properties.url + '">' +
            '<img src="' + feature.properties.image + '">' +
            '<h2>' + feature.properties.city + '</h2>' +
            '</a>';

        return o;
    });*/
        this.map.addLayer(mapbox.layer().id('shmatul.map-tuk5ly8t'));
        this.map.addLayer(this.markerLayer_self);
        this.map.setZoomRange(16, 18);
        this.map.smooth(false);
        this.map.addCallback("panned", function(map, panOffset) {mapObj.usr_panning();});
        this.map.addCallback("zoomed", function(map, panOffset) {mapObj.usr_panning();});
    },
    SetCurrentGPSLocation : function(lat,lon){      
 
        console.log("Setting current GPS location. "+lat+","+lon);
        //simulate movement form latest point? later on
        this.features_self[0].geometry.coordinates[0] = lon;
        this.features_self[0].geometry.coordinates[1] = lat;      
        this.markerLayer_self.features(this.features_self);     

        this.curCoords.lat = lat; 
        this.curCoords.lon = lon; 
        if (this.usr_track_position==true){
            this.map.center({ 'lat': lat, 'lon': lon },false);  
            this.viewCoords.lon = this.curCoords.lon;  
            this.viewCoords.lat = this.curCoords.lat;             
        }
                   
    },
    simulateMovement: function(newLon,newLat)
    {
        
        //console.log(newLon);
        //console.log(this function sucked);
    },
    usr_panning : function(){
        this.usr_track_position = false;
        if (this.usr_changing_coords == false)
        {
            this.usr_changing_coords = true;
            setTimeout(function(){mapObj.usr_changing_coords_f()},500);
        }
    },
    usr_changing_coords_f : function()
    {   
        //function to determine when user finished panning/zooming/w.e to retrieve new parking slots according to panned area
        
        newCoords = this.map.getCenter();
        newZoom = this.map.getZoom();
        if ((newCoords.lan == this.viewCoords.lan) && (newCoords.lon == this.viewCoords.lon) )
        {
           // usr_changing_coords = false;
            l("done panning, fetching new parkings right now...");   
            this.usr_changing_coords = false;    
            console.log("current coords",this.curCoords,"viewcoors",this.viewCoords);
        }
        else
        {   
            this.viewCoords.lat = newCoords.lat; 
            this.viewCoords.lon = newCoords.lon;
            this.curZoom = newZoom;
            $("#mapDiv_usr_tracking").show();
            setTimeout(function(){mapObj.usr_changing_coords_f()},0);         
        }
    },
    reset_location :function()
    {
        this.usr_track_position = true;
        $("#mapDiv_usr_tracking").hide();
        this.SetCurrentGPSLocation(this.curCoords.lat,this.curCoords.lon);    
    }
}




function onDeviceReady(manual)
{
    console.log("aaa");
    $.mobile.loading( 'show' );
    mapObj.initmap();
    //curCoords = {lat:"32.066158",lon:'34.777819'}; s
    //this is a timer for tracking position movement, needs to be validated(!!)
    if (!manual)
    {
        var watchID = navigator.geolocation.watchPosition(function(position){
            l("Got new position from gps");
            console.log(position);
            mapObj.SetCurrentGPSLocation(position.coords.latitude,position.coords.longitude); 
        }, function(error){
            l(error);
            alert("cannot find location!");
        }, { frequency: 3000 });
    }
    else
        mapObj.SetCurrentGPSLocation(32.573905,34.951977); 

//var int=self.setInterval(function(){.html((mapObj.usr_track_position) ? "" : '<a href="" onclick="javascript:mapObj.usr_track_position=true;">Reset Location</a>');},100);
}

$(document).ready(function(){onDeviceReady(false);});
//document.addEventListener("deviceready",onDeviceReady,false); 
