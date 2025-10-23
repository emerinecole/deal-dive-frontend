'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Input } from "@/components/ui/input";

export type FormData = {
  address: string;
  lat: number;
  lng: number;
};

interface LocationPickerProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function LocationPicker({ formData, setFormData }: LocationPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          //console.error("Error getting current location:", error);
          setCenter({ lat: 40.7128, lng: -74.006 });
        }
      );
    }
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "us" },
    },
  });

  // Handle when user selects an address from autocomplete
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = (await getGeocode({ address })) as google.maps.GeocoderResult[];
      if (!results || results.length === 0) return;

      const { lat, lng } = await getLatLng(results[0]);

      setFormData({
        address: results[0].formatted_address,
        lat,
        lng,
      });
    } catch {
      //console.error("Error fetching geocode:", error);
      alert("Error fetching geocode");
    }
  };

  // Handle marker drag to update lat/lng and full address
  const handleMarkerDrag = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        
        if (!response || !response.results || response.results.length === 0) return;
        
        const firstResult = response.results[0];

      setFormData({
        address: firstResult.formatted_address,
        lat,
        lng,
      });
    } catch {
      //console.error("Error reverse geocoding:", error);
      alert("Error reverse geocoding");
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
  
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
  
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
        
      if (!response || !response.results || response.results.length === 0) return;
        
      const firstResult = response.results[0];

      setFormData({
        address: firstResult.formatted_address,
        lat,
        lng,
      });
  
      setCenter({ lat, lng });
    } catch (error) {
      //console.error("Error reverse geocoding clicked location:", error);
      alert("Error reverse geocoding clicked location");
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium">Location</label>

      {/* Autocomplete Input */}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Start typing an address..."
      />

      {/* Suggestions Dropdown */}
      {status === "OK" && (
        <ul className="border p-2 rounded-md bg-white max-h-60 overflow-y-auto">
          {data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="p-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(suggestion.description)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}

      {/* Map */}
      <div className="h-64 w-full mt-2">
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerClassName="h-64 w-full"
        onClick={handleMapClick}
      >
        {formData.lat && formData.lng && (
          <Marker
            position={{ lat: formData.lat, lng: formData.lng }}
            draggable
            onDragEnd={handleMarkerDrag}
          />
        )}
      </GoogleMap>
      </div>
    </div>
  );
}
