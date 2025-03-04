import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import * as toGeoJSON from '@mapbox/togeojson';

Chart.register(...registerables);

const ElevationProfile = ({ gpxFile }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchElevationData = async () => {
      try {
        const response = await fetch(gpxFile);
        const gpxText = await response.text();
        
        const parser = new DOMParser();
        const gpx = parser.parseFromString(gpxText, 'text/xml');
        const geo = toGeoJSON.gpx(gpx);
        
        // Extract elevation and distance
        const elevations = geo.features[0].geometry.coordinates.map(coord => coord[2]);
        const distances = elevations.map((_, index) => index);

        // Destroy existing chart if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }

        // Create new chart
        const ctx = chartRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: distances,
            datasets: [{
              label: 'Elevation (m)',
              data: elevations,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Trail Elevation Profile'
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Elevation (m)'
                }
              }
            }
          }
        });

        setChartInstance(newChartInstance);
      } catch (error) {
        console.error('Error parsing elevation data:', error);
      }
    };

    fetchElevationData();

    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [gpxFile]);

  return (
    <div className="h-96 w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ElevationProfile;