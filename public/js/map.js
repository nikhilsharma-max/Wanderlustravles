
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
// Create a default Marker and add it to the map.
// const marker1 = new mapboxgl.Marker()
//     .setLngLat([coordinates])
//     .addTo(map);

//    const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
//         .setLngLat(listing.geometry.coordinates)
//         .setPopup(new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
//         .setLngLat(e.lngLat)
//         .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
//         .setMaxWidth("300px"))
//         .addTo(map);

// Make sure the map is fully loaded before adding markers
map.on('load', () => {

    // === Default Marker (Recommended - simple and reliable) ===
    const marker = new mapboxgl.Marker({
        color: '#FF0000',      // optional: red color
        // scale: 1.2          // optional
    })
    .setLngLat(listing.geometry.coordinates)   // ← Must be [lng, lat] array
    .setPopup(
        new mapboxgl.Popup({ offset: 25, maxWidth: '300px' })
            .setHTML(`
                <h4>${listing.title || listing.location}</h4>
                <p>Exact location will be provided after booking</p>
            `)
    )
    .addTo(map);

    // Optional: Open popup by default
    // marker.togglePopup();

});