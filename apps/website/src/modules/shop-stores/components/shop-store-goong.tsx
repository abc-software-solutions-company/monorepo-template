/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-07 14:24:24
 */

import { FC, useEffect, useRef, useState } from 'react';
import goongjs from '@goongmaps/goong-js';
import { cn } from '~react-web-ui-shadcn/lib/utils';

import { ShopStore } from '../interfaces/shop-stores.interface';

import { MAP_CUSTOM_MARKER, MAP_INITIAL_CENTER_COORDINATE, MAP_INITIAL_ZOOM, MAP_MAKER_OFFET } from '../constants/shop-stores.constant';

import ShopStoreList from './shop-store-list';

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
        style: 'https://tiles.goong.io/assets/goong_map_web.json', //goong_map_dark// map.setStyle(styleURL);
        center: MAP_INITIAL_CENTER_COORDINATE,
        zoom: MAP_INITIAL_ZOOM,
      });

      map.current = newMap;

      newMap.on('load', () => {
        if (!newMap) return;

        // newMap.addControl(new goongjs.GeolocateControl(), 'top-left');
        newMap.addControl(new goongjs.FullscreenControl(), 'top-left');
        newMap.addControl(new goongjs.NavigationControl(), 'top-left');
        // newMap.addControl(new goongjs.ScaleControl(), 'bottom-left');

        stores.forEach(store => {
          const el = document.createElement('div');

          el.innerHTML = MAP_CUSTOM_MARKER;

          const popup = new goongjs.Popup({ offset: MAP_MAKER_OFFET }).setHTML(`
            <div class="mt-1.5">
              <h3>${store.address}</h3>
              <p class="my-3">ĐT: ${store.phoneNumber}</p>
              <button type="button" class="px-3 py-1.5 text-sm font-medium border rounded hover:bg-primary/10 flex items-center gap-1"
                onclick="window.open('https://www.google.com/maps/search/?api=1&query=${store.position.lat},${store.position.lng}', '_blank')">
                Chỉ đường
                <svg class="rotate-90" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>
              </button>
            </div>
          `);

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
    <div className={cn('shop-stores z-1 relative overflow-hidden rounded-lg', className)}>
      <div className="relative lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:z-[1] lg:order-2 lg:w-96 lg:p-4">
        <ShopStoreList stores={stores} selectedStore={selectedStore} onStoreClick={handleStoreClick} />
      </div>
      <div ref={mapContainer} className="goong-map h-[500px] lg:h-[700px]" />
    </div>
  );
};

export default ShopStoreGoongJs;
