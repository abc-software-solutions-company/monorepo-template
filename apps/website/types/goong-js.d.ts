/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-07 14:29:17
 */

declare module '@goongmaps/goong-js' {
  namespace goongjs {
    export class Map {
      constructor(options: { container: HTMLElement | string; style: string; center: number[]; zoom: number });
      addControl(control: Control, position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): void;
      remove(): void;
      flyTo(options: { center: number[]; zoom: number; speed: number; essential: boolean }): void;
      on(event: 'load', callback: () => void): void;
    }

    export class Marker {
      constructor(element?: HTMLElement);
      setLngLat(coordinates: [number, number]): this;
      setPopup(popup: Popup): this;
      addTo(map: Map): this;
      remove(): void;
      getPopup(): Popup;
      getElement(): HTMLElement;
      _storeId?: string | number;
    }

    export class Popup {
      constructor(options?: { offset?: number });
      setHTML(html: string): this;
      setDOMContent(element: HTMLElement): this;
      remove(): void;
      addTo(map: Map | null): this;
    }

    export class Control {}
    export class GeolocateControl extends Control {}
    export class FullscreenControl extends Control {}
    export class NavigationControl extends Control {}
    export class ScaleControl extends Control {}

    // eslint-disable-next-line no-var
    export var accessToken: string; // Changed from 'let' to 'var' and moved inside namespace
  }

  export = goongjs;
  export as namespace goongjs;
}
