import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet/hooks';
import L, { latLng, latLngBounds } from 'leaflet';
import { useState } from 'react';

const Map = () => {
  const [test, setTest] = useState(false);
  const mapBoundaries = {
    southWest: latLng(34.025514, 25.584519),
    northEast: latLng(42.211024, 44.823563),
  };

  const bounds = latLngBounds(mapBoundaries.southWest, mapBoundaries.northEast);
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center gap-5">
      <MapContainer
        center={[39.1560158, 35.0479979]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        zoomSnap={1}
        zoomDelta={1}
        maxBounds={bounds}
        maxZoom={18}
        minZoom={7}
      >
        <Cities />
        <TileLayer
          attribution="418 Teapot MEDAŞ Askerleri"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-10 left-5 z-20"
        onClick={() => {
          setTest(!test);
        }}
      >
        Reset Map
      </button>
    </div>
  );
};

const Cities = () => {
  const map = useMap();
  drawCityBoundary(map);
};

const resetMap = () => {
  const map = useMap();
  map.eachLayer((layer) => {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  drawCityBoundary(map);
};

function drawCityBoundary(map) {
  fetch('../../constants/cities.geojson')
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const array = json.features;
      const featureGroup = [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];

        const geoJson = L.geoJSON(element.geometry, {
          title: element?.properties?.name,
          style: {
            color: 'black',
            fillColor: 'lightgray',
            weight: 2,
          },
        })
          .on('click', (e) => {
            map.fitBounds(e.target.getBounds(), {
              animate: true,
            });
            map.eachLayer((layer) => {
              if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
              }
            });
            drawCountyBoundary(map, element?.properties?.name);
          })
          .on('mouseover', (e) => {
            e.target.setStyle({
              fillColor: 'red',
            });
          })
          .on('mouseout', (e) => {
            e.target.setStyle({
              fillColor: 'lightgray',
            });
          });
        featureGroup.push(geoJson);
      }
      L.featureGroup(featureGroup).addTo(map);
    });
}

function drawCountyBoundary(map, cityName) {
  fetch(`../../constants/${cityName}_ilceler.geojson`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const array = json.features;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        L.geoJSON(element.geometry, {
          style: {
            color: 'black',
            fillColor: 'blue',
            weight: 1,
          },
        })
          .on('click', (e) => {
            map.fitBounds(e.target.getBounds(), {
              animate: true,
            });
            map.eachLayer((layer) => {
              // TODO: test this
              if (layer instanceof L.Marker) {
                map.removeLayer(layer);
              }
            });
            pinMarkers(map, 'Karatay');
          })
          .on('mouseover', (e) => {
            e.target.setStyle({
              fillColor: 'red',
            });
          })
          .on('mouseout', (e) => {
            e.target.setStyle({
              fillColor: 'blue',
            });
          })
          .addTo(map);
      }
    });
}

const pinMarkers = (map, countyName) => {
  function pinStations() {
    fetch('../../constants/elektrikli-sarj.json')
      .then(function (response) {
        return response.json();
      })
      .then((json) => {
        const array = json.data.filter((item) => item.storeCity === 'Konya');
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          L.marker([element.latitude, element.longitude]).addTo(map);
        }
      });
  }

  pinStations();
};

export default Map;
