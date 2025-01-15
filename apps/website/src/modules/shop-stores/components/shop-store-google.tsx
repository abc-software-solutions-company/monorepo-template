// TODO: Remove all comments below if you want to use this component
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-unresolved */
// @ts-nocheck

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Wrapper } from '@googlemaps/react-wrapper';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import { ShopStore } from '../interfaces/shop-stores.interface';

import ShopStoreList from './shop-store-list';
import ShopStorePopup from './shop-store-popup';

// Types
type MapContextType = {
  map: google.maps.Map | null;
  setMap: (map: google.maps.Map) => void;
  moveTo: (position: google.maps.LatLngLiteral) => void;
};

type MapProviderProps = {
  children: ReactNode;
  apiKey: string;
};

type InfoWindowProps = {
  position: google.maps.LatLngLiteral;
  store: ShopStore;
  onClose?: () => void;
};

type ShopStoreMapProps = {
  className?: string;
  stores: ShopStore[];
  selectedStore?: ShopStore;
  onStoreSelect: (store?: ShopStore) => void;
};

type ShopStoreGoogleProps = {
  className?: string;
  apiKey: string;
  stores: ShopStore[];
};

const MAP_INITIAL_CENTER = { lat: 12.238540843289524, lng: 109.19344173864195 };
const MAP_INITIAL_ZOOM = 15;

const createMarkerElement = (_isSelected: boolean = false): HTMLDivElement => {
  const div = document.createElement('div');

  div.className = 'marker-animation';
  div.innerHTML = `
    <svg width="29" height="36" viewBox="0 0 29 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 0C10.6544 0 6.96623 1.51714 4.24695 4.21766C1.52767 6.91819 0 10.5809 0 14.4C0 24.012 11.1469 36 14.5 36C17.8531 36 29 24.012 29 14.4C29 10.5809 27.4723 6.91819 24.753 4.21766C22.0338 1.51714 18.3456 0 14.5 0ZM14.5 21.6C13.0661 21.6 11.6644 21.1777 10.4721 20.3866C9.27986 19.5954 8.35061 18.4709 7.80187 17.1553C7.25314 15.8397 7.10956 14.392 7.38931 12.9953C7.66905 11.5987 8.35954 10.3158 9.37348 9.30883C10.3874 8.30189 11.6792 7.61616 13.0856 7.33835C14.492 7.06053 15.9497 7.20312 17.2745 7.74807C18.5992 8.29302 19.7315 9.21586 20.5282 10.3999C21.3248 11.5839 21.75 12.976 21.75 14.4C21.75 16.3096 20.9862 18.1409 19.6265 19.4912C18.2669 20.8414 16.4228 21.6 14.5 21.6Z" fill="#F80707"/>
    </svg>
  `;

  const style = document.createElement('style');

  style.textContent = `
    .marker-animation {
      transform-origin: bottom center;
      animation: bounce 0.3s ease-in-out;
    }
    @keyframes bounce {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.1); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  return div;
};

// Context
const MapContext = createContext<MapContextType | null>(null);

const useMap = () => {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }

  return context;
};

// Components
const MapProvider: React.FC<MapProviderProps> = ({ children, apiKey }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const moveTo = (position: google.maps.LatLngLiteral) => {
    if (!map) return;
    map.panTo(position);
  };

  return (
    <MapContext.Provider value={{ map, setMap, moveTo }}>
      <Wrapper apiKey={apiKey} libraries={['marker']}>
        {children}
      </Wrapper>
    </MapContext.Provider>
  );
};

const InfoWindow: React.FC<InfoWindowProps> = ({ position, store, onClose }) => {
  const [container] = useState(document.createElement('div'));
  const { map } = useMap();
  const infoWindowRef = useRef<google.maps.InfoWindow>();

  useEffect(() => {
    if (!map) return;

    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow({
        content: container,
        pixelOffset: new google.maps.Size(0, -40),
      });
      infoWindowRef.current.addListener('closeclick', () => onClose?.());
    }

    infoWindowRef.current.setContent(container);
    infoWindowRef.current.setPosition(position);
    infoWindowRef.current.open(map);

    return () => {
      infoWindowRef.current?.close();
    };
  }, [map, position, store, container, onClose]);

  return ReactDOM.createPortal(
    <div className="duration-300 ease-in animate-in fade-in">
      <ShopStorePopup address={store.address} phoneNumber={store.phoneNumber} position={store.position} />
    </div>,
    container
  );
};

const ShopStoreMap: React.FC<ShopStoreMapProps> = ({ className, stores, selectedStore, onStoreSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, setMap, moveTo } = useMap();
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        zoom: MAP_INITIAL_ZOOM,
        center: MAP_INITIAL_CENTER,
        mapId: 'YOUR_MAP_ID',
        disableDefaultUI: true,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
      });

      setMap(newMap);
    }
  }, [mapRef, map, setMap]);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach(marker => (marker.map = null));

    markersRef.current = stores.map(store => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: store.position,
        title: store.name,
        content: createMarkerElement(store.id === selectedStore?.id),
      });

      marker.addListener('click', () => {
        onStoreSelect(store);
        moveTo(store.position);
      });

      return marker;
    });

    return () => {
      markersRef.current.forEach(marker => (marker.map = null));
    };
  }, [map, stores, selectedStore, onStoreSelect, moveTo]);

  useEffect(() => {
    if (map && selectedStore) {
      moveTo(selectedStore.position);
    }
  }, [map, selectedStore, moveTo]);

  return (
    <div ref={mapRef} className={cn('h-full w-full', className)}>
      {selectedStore && <InfoWindow position={selectedStore.position} store={selectedStore} onClose={() => onStoreSelect(undefined)} />}
    </div>
  );
};

const ShopStoreGoogle: React.FC<ShopStoreGoogleProps> = ({ className, apiKey, stores }) => {
  const [selectedStore, setSelectedStore] = useState<ShopStore>();

  return (
    <MapProvider apiKey={apiKey}>
      <div className={cn('shop-stores relative overflow-hidden rounded-lg', className)}>
        <div className="relative lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:order-2 lg:w-96 lg:p-4">
          <ShopStoreList stores={stores} selectedStore={selectedStore} onStoreClick={setSelectedStore} />
        </div>
        <div className="h-[500px] lg:h-[700px]">
          <ShopStoreMap stores={stores} selectedStore={selectedStore} onStoreSelect={setSelectedStore} />
        </div>
      </div>
    </MapProvider>
  );
};

export default ShopStoreGoogle;
