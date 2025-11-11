'use client';

import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Input } from "@/components/ui/input";

export type FormData = {
  address: string;
  lat: number;
  lng: number;
};

interface LocationPickerProps {
  formData: FormData;
  setFormData: (loc: FormData) => void;
  useUserLocation?: boolean;
}

// Autocomplete input component
function AutocompleteInput({ formData, setFormData }: LocationPickerProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } },
  });

  useEffect(() => {
    setValue(formData.address);
  }, [formData.address, setValue]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      if (!results?.length) return;
      const { lat, lng } = await getLatLng(results[0]);
      setFormData({ address: results[0].formatted_address, lat, lng });
    } catch {
      alert("Error fetching geocode");
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Start typing an address..."
      />
      {status === "OK" && (
        <ul className="border p-2 rounded-md bg-white max-h-60 overflow-y-auto">
          {data.map((s) => (
            <li
              key={s.place_id}
              className="p-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(s.description)}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Main LocationPicker component
export function LocationPicker({ formData, setFormData, useUserLocation }: LocationPickerProps) {

  const mapRef = useRef<google.maps.Map | null>(null);

  // Default coordinates (University of Florida)
  const DEFAULT_COORDS = { lat: 29.6535, lng: -82.3388 };
  const [center, setCenter] = useState(formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : DEFAULT_COORDS);
  const [error, setError] = useState<string | null>(null);

  // Only attempt user location if prop is true
  useEffect(() => {
    if (!useUserLocation) return;

    if (!navigator.geolocation || !navigator.permissions) return;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (status.state === "granted" || status.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            try {
              const geocoder = new google.maps.Geocoder();
              const response = await geocoder.geocode({ location: { lat, lng } });
              if (!response?.results?.length) return;
              const firstResult = response.results[0];
              setFormData({ address: firstResult.formatted_address, lat, lng });
              setCenter({ lat, lng });
            } catch {
              setError("Error reverse geocoding your location.");
            }
          },
          () => setError("Permission denied or unable to get your location.")
        );
      } else if (status.state === "denied") {
        setError("Location access denied. Using default location.");
      }
    });
  }, [useUserLocation, setFormData]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.panTo(center);
  };

  const handleMarkerDrag = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (!response?.results?.length) return;
      const firstResult = response.results[0];
      setFormData({ address: firstResult.formatted_address, lat, lng });
      setCenter({ lat, lng });
    } catch {
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
      if (!response?.results?.length) return;
      const firstResult = response.results[0];
      setFormData({ address: firstResult.formatted_address, lat, lng });
      setCenter({ lat, lng });
    } catch {
      alert("Error reverse geocoding clicked location");
    }
  };

  // Keep map centered when formData changes
  useEffect(() => {
    if (mapRef.current && formData.lat && formData.lng) {
      mapRef.current.panTo({ lat: formData.lat, lng: formData.lng });
    }
  }, [formData.lat, formData.lng]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium">Location</label>
      {error && <div className="text-red-500">{error}</div>}
      <AutocompleteInput formData={formData} setFormData={setFormData} />
      <div className="h-64 w-full mt-2">
        <GoogleMap
          onLoad={onMapLoad}
          center={center}
          zoom={15}
          mapContainerClassName="h-64 w-full"
          onClick={handleMapClick}
        >
          {typeof formData.lat === "number" && typeof formData.lng === "number" && (
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
