import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  height?: string;
  onMapClick?: (lat: number, lng: number) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 13,
  markers = [],
  height = "400px",
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && window.google) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9e9e9" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
          ],
        });

        setMap(mapInstance);
        setIsLoaded(true);

        // Add click listener
        if (onMapClick) {
          mapInstance.addListener(
            "click",
            (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                onMapClick(event.latLng.lat(), event.latLng.lng());
              }
            }
          );
        }
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCP58B08SVqxpGpq3IpNCYAG9g1R3oilnw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [center, zoom, onMapClick]);

  // Add markers when map is loaded
  useEffect(() => {
    if (map && isLoaded) {
      // Clear existing markers
      markers.forEach((markerData) => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: {
            url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiMxMEI5ODEiLz4KPC9zdmc+",
            scaledSize: new google.maps.Size(30, 30),
          },
        });

        if (markerData.info) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0; font-weight: bold;">${markerData.title}</h3>
                <p style="margin: 0; color: #666;">${markerData.info}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, markers, isLoaded]);

  if (!isLoaded) {
    return (
      <div
        className="bg-gray-100 rounded-xl flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height }}
    />
  );
};

export default GoogleMap;
