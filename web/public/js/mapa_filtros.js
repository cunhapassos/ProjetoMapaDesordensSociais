$("#botao-marker").on("click", function(){
    map.addLayer( markersGroup );
    map.removeLayer( heat );
})

$("#botao-heat").on("click", function(){
    map.removeLayer( markersGroup );
    map.addLayer( heat );
})