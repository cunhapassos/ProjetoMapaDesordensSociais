markes.forEach(function (marker){
    if(marker.den_iddenuncia == query.denuncia){
      marker_zoom_x = marker.st_x;
      marker_zoom_y = marker.st_y;
    }
  })

  if(jQuery.isEmptyObject(query)){
    var map = L.map('map').setView([-15.782759, -47.870619], 13);
  }else{
    var map = L.map('map', {
        center: [marker_zoom_x, marker_zoom_y],
        zoom: 18
    });
  }
  
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);

  // Set up the OSM layer
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.drawLocal.draw.toolbar.buttons.polygon = 'Desenhar região de alerta';

  var editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);
  
  var MyCustomMarker = L.Icon.extend({
      options: {
          shadowUrl: null,
          iconAnchor: new L.Point(8, 8),
          iconSize: new L.Point(20, 20)
      }
  });
  
  var options = {
    position: 'bottomleft',
    draw: {
      polygon: {
        allowIntersection: false, // Restricts shapes to simple polygons
        drawError: {
          color: 'red', // Color the shape will turn when intersects
          message: '<strong>Ops!<strong> Você não pode desenhar isto!' // Message that will show when intersect
        },
        shapeOptions: {
          color: 'red'
        }
      },
      // disable toolbar item by setting it to false
      polyline: false,
      circle: false, // Turns off this drawing tool
      circlemarker: false,
      rectangle: false,
      marker: false,
      },
    edit: {
      featureGroup: editableLayers, //REQUIRED!!
      remove: false
    }
  };
  
  var drawControl = new L.Control.Draw(options);
  map.addControl(drawControl);
  
  map.on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
          layer = e.layer;
      var data = [];        

      e.layer._latlngs.forEach(element => {
        element.forEach(points => {
          // console.log(points.lat);
          data.push([points.lat,points.lng]);
        });
      });
      
      console.log(data);
      var data = JSON.stringify(data);

      $.ajax({
        type: "POST",
        url: "/areas/create",
        data: {data : data},
        success : function(data) {
          alert("Regiao inserida com sucesso");
          location.reload();
        },
        error : function(){
          alert("Você não tem permissão para inserir regiões de alerta");
          location.reload();
        }
      });

      editableLayers.addLayer(layer);
  });
  
  var heat_points = []
  var markersGroup = L.markerClusterGroup();


  //ADIÇÃO DE MARCADORES NO MAPA
  for(var i = 0; i < markes.length; i++){
    
    if(markes[i].des_descricao.length > 50){
      var desordem_descricao = markes[i].des_descricao.substr(0, 50) + "...";
    }else{
      var desordem_descricao = markes[i].des_descricao;
    }

    function formatDate (input) {
      var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1], day = datePart[2];

      return day+'/'+month+'/'+year;
    }

    var data_ocorreu = formatDate (markes[i].data_ocorreu); // "18/01/10"
    
    //comeca a criar string para pop-pup
    var marker_popup = "<b>" + markes[i].den_status + "</b><hr><span><strong>Descrição: </strong>" + markes[i].den_descricao + "<br><strong>Nível Confiabilidade: </strong>" + markes[i].den_nivel_confiabilidade + "</span><br><span><strong>Desordem: </strong>" + desordem_descricao  +"<br><span><strong>Data que ocorreu: </strong>" + data_ocorreu + "<br><span><strong>Hora que ocorreu: </strong>" + markes[i].hora_ocorreu  + "<br>";

    //se denuncia foi solucionada, sua hora e data sao colocadas no pop-pup
    if(markes[i].data_solucao){
      var data_solucao = formatDate (markes[i].data_solucao);

      marker_popup += "<strong>Data da solução: </strong>" + data_solucao + "<br><strong>Hora Solução: </strong>" + markes[i].hora_solucao + "<br>";
    }

    //se denuncia nao for anonima, mostra nome do usuario
    if(markes[i].den_anonimato == 0){
      marker_popup += "<strong>Usuário: </strong>" + "<a href='/usuarios/" + markes[i].usu_idusuario + "/show'>" + markes[i].usu_nome + "</a><br>";
    }

    marker_popup += "<br><a href=\"/denuncias/" + markes[i].den_iddenuncia + "/show\">Ver denúnica</a>";

    heat_points.push([markes[i].st_x, markes[i].st_y, 7]);

    var marker = L.marker([markes[i].st_x, markes[i].st_y]);

    marker.bindPopup(marker_popup);
    
    markersGroup.addLayer( marker );
  }

  var heat = L.heatLayer(heat_points, {radius: 50});
  
  var latitude;
  var longitude;
  var isMarker;
  
  // map.addLayer( heat );
  map.addLayer( markersGroup );
  
  //ADIÇÃO DE POLIGONOS NO MAPA
  for(var i = 0; i < polygons.length; i++){
    
    polygons[i].reg_regiao_alerta = polygons[i].reg_regiao_alerta.replace(/\(/g, "[").replace(/\)/g, "]");
    var array_poly = JSON.parse(polygons[i].reg_regiao_alerta); 

    var polygon = L.polygon(array_poly,{
      color : 'red'
    }).addTo(map);

    polygon.bindPopup("<strong>Região de Alerta " + polygons_ids[i].reg_idregiao_alerta + "</strong><br><form style='text-align: center;' action='/areas/delete' method='post'><input style='display: none;'  type='number' name='id_regiao' value='" + polygons_ids[i].reg_idregiao_alerta + "' /><input id='delete-regiao' class='ui red button' type='submit' name='delete' value='Delete' /></form>");
  }


  //TODA VEZ QUE OCORRE UM DOUBLE CLIQUE NO MAPA, AS VARIÁVEIS RECEBEM LATITUDE E LONGITUDE
  map.on('dblclick', function(e) {
    latitude = e.latlng.lat;
    longitude = e.latlng.lng;
    isMarker = 0;
    // alert(latitude + " " + longitude);
  })

  function addMark(){
    
    alert("Clique 2 vezes no lugar que gostaria de registrar a denúnica");
    $("#map").css("cursor", "pointer");
    $("#map").one("dblclick", function(){
      
      // map.zoomControl.disabled();
      $("#latitudemp").val(String(latitude));
      $("#longitudemp").val(String(longitude));
      $('.ui.modal').modal('show');
      $("#map").css("cursor", "");

    })
  } 