import React, { useEffect } from "react";
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
        <Konya />
      </MapContainer>
    </div>
  );
};

const Konya = () => {
  const map = useMap();
  function drawCountyBoundary() {
    const url = `https://nominatim.openstreetmap.org/search.php?state=Konya&polygon_geojson=1&format=jsonv2`;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        const geojsonFeature = json[0].geojson;
        L.geoJSON(geojsonFeature)
          .on("click", (e) => {
            map.fitBounds(e.target.getBounds(), {
              animate: true,
            });
          })
          .addTo(map);
      });
  }

  drawCountyBoundary();
};

export default Map;
