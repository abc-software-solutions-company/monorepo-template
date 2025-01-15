/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-04 10:53:06
 */

// TODO: Remove all comments below if you want to use this component
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-unresolved */
// @ts-nocheck

import React, { FC, useRef, useState } from 'react';
import { Icon, LatLngExpression, Marker as LeafletMarker } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import { ShopStore } from '../interfaces/shop-stores.interface';

import ShopStoreList from './shop-store-list';
import ShopStorePopup from './shop-store-popup';

import 'leaflet/dist/leaflet.css';

const MAP_INITIAL_CENTER_COORDINATE: LatLngExpression = [12.238540843289524, 109.19344173864195];
const MAP_INITIAL_ZOOM = 15;
const MAP_CUSTOM_MARKER = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg width='29' height='36' viewBox='0 0 29 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.5 0C10.6544 0 6.96623 1.51714 4.24695 4.21766C1.52767 6.91819 0 10.5809 0 14.4C0 24.012 11.1469 36 14.5 36C17.8531 36 29 24.012 29 14.4C29 10.5809 27.4723 6.91819 24.753 4.21766C22.0338 1.51714 18.3456 0 14.5 0ZM14.5 21.6C13.0661 21.6 11.6644 21.1777 10.4721 20.3866C9.27986 19.5954 8.35061 18.4709 7.80187 17.1553C7.25314 15.8397 7.10956 14.392 7.38931 12.9953C7.66905 11.5987 8.35954 10.3158 9.37348 9.30883C10.3874 8.30189 11.6792 7.61616 13.0856 7.33835C14.492 7.06053 15.9497 7.20312 17.2745 7.74807C18.5992 8.29302 19.7315 9.21586 20.5282 10.3999C21.3248 11.5839 21.75 12.976 21.75 14.4C21.75 16.3096 20.9862 18.1409 19.6265 19.4912C18.2669 20.8414 16.4228 21.6 14.5 21.6Z' fill='%23F80707'/%3E%3C/svg%3E",
  iconSize: [29, 36],
  iconAnchor: [14.5, 36],
  popupAnchor: [0, -36],
});

type MapControlProps = {
  position: {
    lat: number;
    lng: number;
  };
};

const MapControl: FC<MapControlProps> = ({ position }) => {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo([position.lat, position.lng], MAP_INITIAL_ZOOM, {
      duration: 0.8,
    });
  }, [map, position]);

  return null;
};

type PopupControlProps = {
  store: ShopStore;
};

const PopupControl: FC<PopupControlProps> = ({ store }) => {
  const markerRef = useRef<LeafletMarker | null>(null);

  React.useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [store]);

  return (
    <Marker ref={markerRef} position={[store.position.lat, store.position.lng]} icon={MAP_CUSTOM_MARKER}>
      <Popup>
        <ShopStorePopup address={store.address} phoneNumber={store.phoneNumber} position={store.position} />
      </Popup>
    </Marker>
  );
};

type ShopStoreMapProps = {
  className?: string;
  stores: ShopStore[];
  selectedStore?: ShopStore;
  onStoreSelect: (store?: ShopStore) => void;
};

const ShopStoreMap: FC<ShopStoreMapProps> = ({ className, stores, selectedStore, onStoreSelect }) => {
  return (
    <MapContainer
      className={cn('!z-0 h-full w-full', className)}
      center={MAP_INITIAL_CENTER_COORDINATE}
      zoom={MAP_INITIAL_ZOOM}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">Open Street Map</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedStore && <MapControl position={selectedStore.position} />}
      {stores.map(store =>
        selectedStore?.id === store.id ? (
          <PopupControl key={store.id} store={store} />
        ) : (
          <Marker
            key={store.id}
            position={[store.position.lat, store.position.lng]}
            icon={MAP_CUSTOM_MARKER}
            eventHandlers={{
              click: () => onStoreSelect(store),
            }}
          />
        )
      )}
    </MapContainer>
  );
};

type ShopStoreLeafletProps = {
  className?: string;
  stores: ShopStore[];
};

const ShopStoreLeaflet: FC<ShopStoreLeafletProps> = ({ className, stores }) => {
  const [selectedStore, setSelectedStore] = useState<ShopStore>();

  return (
    <div className={cn('shop-stores relative overflow-hidden rounded-lg', className)}>
      <div className="relative lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:order-2 lg:w-96 lg:p-4">
        <ShopStoreList stores={stores} selectedStore={selectedStore} onStoreClick={setSelectedStore} />
      </div>
      <div className="h-[500px] lg:h-[700px]">
        <ShopStoreMap stores={stores} selectedStore={selectedStore} onStoreSelect={setSelectedStore} />
      </div>
    </div>
  );
};

export default ShopStoreLeaflet;
