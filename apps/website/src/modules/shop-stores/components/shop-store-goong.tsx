/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-07 14:24:24
 */

// TODO: Remove all comments below if you want to use this component
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-unresolved */
// @ts-nocheck

import { FC, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import goongjs from '@goongmaps/goong-js';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import { ShopStore } from '../interfaces/shop-stores.interface';

import { MAP_CUSTOM_MARKER, MAP_INITIAL_CENTER_COORDINATE, MAP_INITIAL_ZOOM, MAP_MARKER_OFFET } from '../constants/shop-stores.constant';

import ShopStoreList from './shop-store-list';
import ShopStorePopup from './shop-store-popup';

import '@goongmaps/goong-js/dist/goong-js.css';

type ShopStoreGoongJsProps = {
  className?: string;
  stores: ShopStore[];
  apiKey: string;
};

const ShopStoreGoongJs: FC<ShopStoreGoongJsProps> = ({ className, stores, apiKey }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const map = useRef<goongjs.Map | null>(null);
  const markers = useRef<goongjs.Marker[]>([]);
  const [selectedStore, setSelectedStore] = useState<ShopStore>();

  const updateMarkerSize = (storeId: string) => {
    markers.current.forEach(marker => {
      const element = marker.getElement();

      if (marker._storeId === storeId) {
        element.classList.add('selected-marker');
      } else {
        element.classList.remove('selected-marker');
      }
    });
  };

  const handleStoreClick = (store: ShopStore) => {
    const selectedMarker = markers.current.find(marker => marker._storeId === store.id);

    if (selectedMarker && map.current) {
      markers.current.forEach(marker => {
        if (marker._storeId !== store.id) {
          marker.getPopup().remove();
        }
      });

      map.current.flyTo({
        center: [store.position.lng, store.position.lat],
        zoom: 15,
        speed: 3,
        essential: true,
      });

      updateMarkerSize(store.id);

      setTimeout(() => selectedMarker.getPopup().addTo(map.current), 1000);

      setSelectedStore(store);
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      goongjs.accessToken = apiKey;

      const newMap = new goongjs.Map({
        container: mapContainer.current,
        style: 'https://tiles.goong.io/assets/goong_map_web.json',
        center: MAP_INITIAL_CENTER_COORDINATE,
        zoom: MAP_INITIAL_ZOOM,
      });

      map.current = newMap;

      newMap.on('load', () => {
        if (!newMap) return;

        newMap.addControl(new goongjs.GeolocateControl(), 'top-left');
        newMap.addControl(new goongjs.FullscreenControl(), 'top-left');
        newMap.addControl(new goongjs.NavigationControl(), 'top-left');
        newMap.addControl(new goongjs.ScaleControl(), 'bottom-left');

        stores.forEach(store => {
          const el = document.createElement('div');

          el.innerHTML = MAP_CUSTOM_MARKER;

          const popupNode = document.createElement('div');

          createRoot(popupNode).render(<ShopStorePopup address={store.address} phoneNumber={store.phoneNumber} position={store.position} />);

          const popup = new goongjs.Popup({ offset: MAP_MARKER_OFFET }).setDOMContent(popupNode);

          const marker = new goongjs.Marker(el).setLngLat([store.position.lng, store.position.lat]).setPopup(popup).addTo(newMap);

          marker.getElement().addEventListener('click', () => {
            updateMarkerSize(store.id);
            setSelectedStore(store);
          });

          marker._storeId = store.id;
          markers.current.push(marker);
        });
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey, stores]);

  return (
    <div className={cn('shop-stores relative overflow-hidden rounded-lg', className)}>
      <div className="relative lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:order-2 lg:w-96 lg:p-4">
        <ShopStoreList stores={stores} selectedStore={selectedStore} onStoreClick={handleStoreClick} />
      </div>
      <div ref={mapContainer} className="goong-map h-[500px] lg:h-[700px]" />
    </div>
  );
};

export default ShopStoreGoongJs;
