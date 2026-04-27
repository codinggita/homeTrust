import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

// Fix default icon paths for bundlers
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({
  center,
  zoom = 14,
  markers = [],
  showRadius,
  radiusMeters = 1000,
  className,
}) {
  return (
    <div
      className={
        className ??
        "h-64 w-full overflow-hidden rounded-xl border border-border"
      }
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center}>
          <Popup>Primary location</Popup>
        </Marker>
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
        {showRadius && (
          <Circle
            center={center}
            radius={radiusMeters}
            pathOptions={{
              color: "#b08a2c",
              fillColor: "#eecf6b",
              fillOpacity: 0.15,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
