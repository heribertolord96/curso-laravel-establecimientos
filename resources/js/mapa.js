import {
    OpenStreetMapProvider
} from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();

document.addEventListener('DOMContentLoaded', () => {


    if (document.querySelector('#mapa')) {

        const lat = document.querySelector('#lat').value === '' ? 20.6719563 : document.querySelector('#lat').value;
        const lng = document.querySelector('#lng').value === '' ? -103.416501 : document.querySelector('#lng').value;

        const mapa = L.map('mapa').setView([lat, lng], 16);

        // Eliminar pines previos
        let markers = new L.FeatureGroup().addTo(mapa);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);

        let marker;

        // agregar el pin
        marker = new L.marker([lat, lng], {
            draggable: true,
            autoPan: true
        }).addTo(mapa);

        // Agregar el pin a las capas
        markers.addLayer(marker);


        // Geocode Service
       const geocodeService = L.esri.Geocoding.geocodeService({
            apikey:'AAPK12c0f13fa0dd409396184e993bfb70a2_e9wtN1djYhWR9OAAT5V3SQVsiyBTlFg8Xw4cEXTrEUIGD3mV1HxFgkPNTm_GuCX'
          });


        // Buscador de direcciones
        const buscador = document.querySelector('#formbuscador');
        buscador.addEventListener('blur', buscarDireccion);

        reubicarPin(marker);

        function reubicarPin(marker) {
            // Detectar movimiento del marker
            marker.on('moveend', function (e) {
                marker = e.target;

                const posicion = marker.getLatLng();

                //console.log(posicion);

                // Centrar automaticamente
                mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

                // Reverse Geocoding, cuando el usuario reubica el pin
                //console.log(geocodeService.reverse().latlng(posicion, 16));

                 geocodeService.reverse().latlng(posicion, 16).run(function (err, results, response) {
                     if (err) {
                       console.log({err});
                       //return;
                     }
                    /*  console.log({results});
                     console.log({response}); */
                   });
                geocodeService.reverse().latlng(posicion, 16).run(function (error, resultado, response) {
                    if (error) {
                        console.log({error});
                        return;
                    }
                    console.log(resultado);
                    //console.log(error);

                    // console.log(resultado.address);

                    marker.bindPopup(resultado.address.LongLabel);
                    marker.openPopup();

                    // Llenar los campos
                    llenarInputs(resultado);

                })
            });
        }

        function buscarDireccion(e) {


            if (e.target.value.length > 1) {
                provider.search({
                        query: e.target.value + ' Guadalajara MX '
                    })
                    .then(resultado => {
                        if (resultado) {

                            // Limpiar los pines previos
                            markers.clearLayers();

                            // Reverse Geocoding, cuando el usuario reubica el pin
                            geocodeService.reverse().latlng(resultado[0].bounds[0], 16).run(function (error, resultado) {

                                // Llenar los inputs
                                llenarInputs(resultado);

                                // Centrar el mapa
                                mapa.setView(resultado.latlng)


                                // Agregar el Pin
                                marker = new L.marker(resultado.latlng, {
                                    draggable: true,
                                    autoPan: true
                                }).addTo(mapa);

                                // asignar el contenedor de markers el nuevo pin
                                markers.addLayer(marker);


                                // Mover el pin
                                reubicarPin(marker);

                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }


        function llenarInputs(resultado) {
            // console.log(resultado)
            document.querySelector('#direccion').value = resultado.address.Address || '';
            document.querySelector('#colonia').value = resultado.address.Neighborhood || '';
            document.querySelector('#lat').value = resultado.latlng.lat || '';
            document.querySelector('#lng').value = resultado.latlng.lng || '';
        }

    }

});
