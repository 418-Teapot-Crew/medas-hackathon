import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet/hooks";
import L, { latLng, latLngBounds } from "leaflet";

const Map = () => {
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
        className="w-full h-full"
        zoomSnap={1}
        zoomDelta={1}
        maxBounds={bounds}
        maxZoom={18}
        minZoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Counties /> */}
        <Cities />
      </MapContainer>
    </div>
  );
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// const Cities = () => {
//   const map = useMap();
//   function drawCountyBoundary(city) {
//     const url = `https://nominatim.openstreetmap.org/search.php?state=${city}&polygon_geojson=1&format=jsonv2`;
//     fetch(url)
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (json) {
//         const geojsonFeature = json[0].geojson;
//         L.geoJSON(geojsonFeature, {
//           style: {
//             color: getRandomColor(),
//           },
//         })
//           .on("click", (e) => {
//             map.fitBounds(e.target.getBounds(), {
//               animate: true,
//             });
//           })
//           .addTo(map);
//       });
//   }

//   cities.forEach((city) => {
//     drawCountyBoundary(city);
//   });
// };

const Cities = () => {
  const map = useMap();
  function drawCityBoundary() {
    fetch("../../constants/cities.geojson")
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        const array = json.features;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          L.geoJSON(element.geometry, {
            style: {
              color: "lightgray",
              weight: 2,
            },
          })
            .on("click", (e) => {
              map.fitBounds(e.target.getBounds(), {
                animate: true,
              });
              // drawCountyBoundary(map); // TODO: draw county boundaries
            })
            .on("mouseover", (e) => {
              e.target.setStyle({
                color: "red",
              });
            })
            .on("mouseout", (e) => {
              e.target.setStyle({
                color: "lightgray",
              });
            })
            .addTo(map);
        }
      });
  }
  drawCityBoundary();
};

function drawCountyBoundary(map) {
  fetch("../../constants/konya_ilceler.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const array = json.features;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        L.geoJSON(element.geometry, {
          style: {
            color: "lightgray",
            weight: 2,
          },
        })
          .on("click", (e) => {
            map.fitBounds(e.target.getBounds(), {
              animate: true,
            });
          })
          .on("mouseover", (e) => {
            e.target.setStyle({
              color: "red",
            });
          })
          .on("mouseout", (e) => {
            e.target.setStyle({
              color: "lightgray",
            });
          })
          .addTo(map);
      }
    });
}

const Counties = () => {
  const map = useMap();
  function drawCountyBoundary() {
    fetch("../../constants/konya_ilceler.geojson")
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        const array = json.features;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          L.geoJSON(element.geometry, {
            style: {
              color: "lightgray",
              weight: 2,
            },
          })
            .on("click", (e) => {
              map.fitBounds(e.target.getBounds(), {
                animate: true,
              });
            })
            .on("mouseover", (e) => {
              e.target.setStyle({
                color: "red",
              });
            })
            .on("mouseout", (e) => {
              e.target.setStyle({
                color: "lightgray",
              });
            })
            .addTo(map);
        }
      });
  }
  drawCountyBoundary(name);
};

export default Map;
