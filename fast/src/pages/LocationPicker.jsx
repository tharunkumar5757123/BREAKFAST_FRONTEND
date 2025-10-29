import React, { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Modal } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// 📍 Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const { BaseLayer } = LayersControl;

const LocationPicker = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [address, setAddress] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // 🌍 Load saved or auto-detect location
  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      const { lat, lng, address } = JSON.parse(saved);
      if (lat && lng) {
        setPosition([lat, lng]);
        setAddress(address);
      } else {
        handleDetectLocation();
      }
    } else {
      handleDetectLocation();
    }
  }, []);

  // 📦 Fetch clean readable address
  const fetchAddress = async (lat, lng) => {
    if (!lat || !lng) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&format=json`
      );
      const data = await res.json();

      const addr = data.address || {};
      const formatted = [
        addr.road,
        addr.neighbourhood,
        addr.suburb,
        addr.city || addr.town || addr.village,
        addr.state,
        addr.country,
      ]
        .filter(Boolean)
        .join(", ");

      setAddress(formatted || data.display_name || "Unknown location");
      setShortAddress(
        [addr.road, addr.suburb, addr.city || addr.town]
          .filter(Boolean)
          .join(", ") || "Unknown area"
      );
    } catch (err) {
      console.error("Address fetch failed:", err);
      setAddress("Unable to fetch address");
      setShortAddress("");
    }
  };

  // 🛰️ Detect current location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (lat && lng) {
          setPosition([lat, lng]);
          fetchAddress(lat, lng);
        } else {
          alert("Could not detect coordinates.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Geo error:", err);
        alert("Unable to fetch location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  // 🔍 Manual search by address
  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          manualAddress
        )}&format=json&limit=1&addressdetails=1`
      );
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);

        if (!isNaN(latNum) && !isNaN(lonNum)) {
          setPosition([latNum, lonNum]);
          fetchAddress(latNum, lonNum);
        } else {
          alert("Invalid coordinates received. Try again.");
        }
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🗺️ Map marker + drag update
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (lat && lng) {
          setPosition([lat, lng]);
          fetchAddress(lat, lng);
        }
      },
    });

    return position ? (
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            if (lat && lng) {
              setPosition([lat, lng]);
              fetchAddress(lat, lng);
            }
          },
        }}
      />
    ) : null;
  };

  // 🧭 Recenter map when position changes
  const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) map.setView(position, 17, { animate: true });
    }, [position]);
    return null;
  };

  // ✅ Save location
  const handleSaveLocation = () => {
    if (!position) {
      alert("Please select a location first");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSave = () => {
    const userLoc = {
      lat: position[0],
      lng: position[1],
      address,
    };
    localStorage.setItem("userLocation", JSON.stringify(userLoc));
    window.dispatchEvent(new Event("storage"));
    setShowConfirm(false);
    navigate("/");
  };

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #fffbe6, #fff2b3)",
      }}
    >
      <Container
        className="bg-white rounded-4 shadow-lg p-4 position-relative"
        style={{ maxWidth: "700px" }}
      >
        <h3 className="fw-bold text-center mb-3">📍 Pick Your Delivery Location</h3>

        {/* Search Input */}
        <Form onSubmit={handleManualSearch} className="d-flex mb-3">
          <Form.Control
            placeholder="Search for an area, street, or city..."
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
          />
          <Button type="submit" className="ms-2">
            Search
          </Button>
        </Form>

        {/* Detect Location */}
        <div className="text-center mb-3">
          <Button variant="warning" onClick={handleDetectLocation} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Detecting...
              </>
            ) : (
              "📡 Use My Current Location"
            )}
          </Button>
        </div>

        {/* Map Section */}
        <div
          className="rounded overflow-hidden position-relative"
          style={{ height: "450px", border: "2px solid #ffd700" }}
        >
          <MapContainer
            center={position || [20.5937, 78.9629]}
            zoom={position ? 17 : 5}
            style={{ height: "100%", width: "100%" }}
          >
            <LayersControl position="topright">
              <BaseLayer checked name="Street View">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              </BaseLayer>
              <BaseLayer name="Satellite View">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
              </BaseLayer>
              <BaseLayer name="Terrain View">
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution="Map data: © OpenTopoMap contributors"
                />
              </BaseLayer>
            </LayersControl>
            <LocationMarker />
            <RecenterMap position={position} />
          </MapContainer>

          {/* Floating Address Bar */}
          {shortAddress && (
            <div
              className="position-absolute bottom-0 start-50 translate-middle-x bg-white shadow rounded-pill px-4 py-2 text-center fw-semibold"
              style={{
                width: "90%",
                marginBottom: "1rem",
                border: "1px solid #ccc",
              }}
            >
              📍 {shortAddress}
            </div>
          )}
        </div>

        <div className="text-center mt-3">
          <Button variant="success" size="lg" onClick={handleSaveLocation}>
            ✅ Confirm Location
          </Button>
        </div>
      </Container>

      {/* Confirm Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Address:</strong>
          </p>
          <p>{address}</p>
          <p>Do you want to set this as your delivery location?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmSave}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LocationPicker;
