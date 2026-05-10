"use client";

import React, { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
 Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "@elfalem/leaflet-curve";


const DefaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon =
  DefaultIcon;

type Props = {
  from: string;
  to: string;
};


const airports: Record<
  string,
  {
    name: string;
    coords: [number, number];
  }
> = {

  NZNE: {
    name: "Dairy Flat",
    coords: [-36.6767, 174.655],
  },

  YSSY: {
    name: "Sydney",
    coords: [-33.9399, 151.1753],
  },

  NZRO: {
    name: "Rotorua",
    coords: [-38.1092, 176.317],
  },

  NZGB: {
    name: "Great Barrier",
    coords: [-36.2414, 175.472],
  },

  NZCI: {
    name: "Chatham Islands",
    coords: [-43.81, 183.543],
  },

  NZTL: {
    name: "Lake Tekapo",
    coords: [-44.235, 170.119],
  },
};


function buildRealisticCurve(
  start: [number, number],
  end: [number, number]
) {

  const lat1 = start[0];
  const lng1 = start[1];

  const lat2 = end[0];
  const lng2 = end[1];

  const midLat =
    (lat1 + lat2) / 2;

  const midLng =
    (lng1 + lng2) / 2;


  const distance = Math.sqrt(
    Math.pow(lat2 - lat1, 2) +
    Math.pow(lng2 - lng1, 2)
  );

  let offset =
    distance * 0.06;


  if (distance > 15) {
    offset =
      distance * 0.10;
  }


  const controlPoint: [
    number,
    number
  ] = [

    midLat + offset,

    midLng,
  ];

  return [

    "M",
    start,

    "Q",
    controlPoint,

    end,
  ];
}


function FlightCurve({
  from,
  to,
}: Props) {

  const map = useMap();

  useEffect(() => {

    const start =
      airports[from].coords;

    const end =
      airports[to].coords;

    const path =
      buildRealisticCurve(
        start,
        end
      );

    const curve = (L as any)
      .curve(path, {

        color: "#2563eb",

        weight: 4,

        opacity: 0.85,

        lineCap: "round",

      })
      .addTo(map);


    const bounds =
      L.latLngBounds([
        start,
        end,
      ]);

    map.fitBounds(bounds, {
      padding: [60, 60],
      animate: true,
    });

    return () => {
      map.removeLayer(curve);
    };

  }, [from, to, map]);

  return null;
}


export default function Map({
  from,
  to,
}: Props) {

  return (
    <div className="h-[700px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200">

      <MapContainer

        center={[-39, 174]}

        zoom={5}

        scrollWheelZoom={true}

        className="h-full w-full z-0"

        worldCopyJump={false}

        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
      >

        {/* Map */}
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(airports).map(
          ([code, airport]) => (

            <React.Fragment key={code}>

                
              <Marker
                key={`${code}-marker`}
                position={airport.coords}
              >

                <Popup>

                  <div className="text-center min-w-[140px]">

                    <div className="font-bold text-blue-700 text-lg">
                      {airport.name}
                    </div>

                    <div className="text-gray-500 text-sm mt-1">
                      {code}
                    </div>

                  </div>

                </Popup>

              </Marker>

              {/* Place name tag */}
              <Marker
                key={`${code}-label`}
                position={[
                  airport.coords[0] - 0.35,
                  airport.coords[1],
                ]}

                icon={L.divIcon({

                  className: "",

                  html: `
                    <div
                      style="
                        font-size:13px;
                        font-weight:700;
                        color:#111827;
                        white-space:nowrap;
                        text-shadow:
                          0 0 4px white,
                          0 0 8px white;
                      "
                    >
                      ${airport.name}
                    </div>
                  `,
                })}
              />

            </React.Fragment>
          )
        )}

        {/* air route */}
        <FlightCurve
          from={from}
          to={to}
        />

      </MapContainer>
    </div>
  );
}