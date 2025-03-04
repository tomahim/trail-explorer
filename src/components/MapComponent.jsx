import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as toGeoJSON from '@mapbox/togeojson';

const MapComponent = ({ gpxFile }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchGPX = async () => {
      try {
        const response = await fetch(gpxFile);
        const gpxText = await response.text();
        
        const parser = new DOMParser();
        const gpx = parser.parseFromString(gpxText, 'text/xml');
        const geo = toGeoJSON.gpx(gpx);
        
        const coordinates = geo.features[0].geometry.coordinates.map(
          coord => [coord[1], coord[0]]
        );
        
        setRoute(coordinates);
      } catch (error) {
        console.error('Error parsing GPX:', error);
      }
    };

    fetchGPX();
  }, [gpxFile]);

  return (
    <div className="h-96 w-full">
      <MapContainer 
        center={route[Math.floor(route.length / 2)] || [46.2, 6.1]} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color="blue" 
            weight={5} 
            opacity={0.7} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;