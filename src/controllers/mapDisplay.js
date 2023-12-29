mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhbzQ3IiwiYSI6ImNscHBneGhzcDB3cjkyaXFuaHlhN3Jxcm0ifQ.l74B2ZgynwxH8OhjplzVmg';

    // Get the user's current location
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true
    });
    function successLocation(position) {
        const { longitude, latitude } = position.coords;

        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: [longitude, latitude], // starting position [lng, lat]
            zoom: 15 // starting zoom
            
        });
        console.log(nguoidanController.getLocationData);
        const marker = new mapboxgl.Marker()
        .setLngLat([locationsData.coordinates.x,locationsData.coordinates.y])
        .addTo(map);
    }

    function errorLocation() {
        // Default location (if user denies location access)
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 12 // starting zoom
        });
    }
    