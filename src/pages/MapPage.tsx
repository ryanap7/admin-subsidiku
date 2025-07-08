import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { Agent } from "../types";

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [mapFilter, setMapFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [showLayers, setShowLayers] = useState(false);

  const mockAgents: Agent[] = [
    {
      id: "1",
      name: "Kios Makmur Jaya",
      address: "Jl. Sudirman No. 45, Bantul",
      coordinates: { lat: -7.8753849, lng: 110.3261904 },
      status: "active",
      capacity: 1000,
      currentStock: 750,
      district: "Bantul",
    },
    {
      id: "2",
      name: "Toko Berkah Tani",
      address: "Jl. Kaliurang KM 5, Sleman",
      coordinates: { lat: -7.7455643, lng: 110.4083594 },
      status: "active",
      capacity: 800,
      currentStock: 200,
      district: "Sleman",
    },
    {
      id: "3",
      name: "Agen Subur Mandiri",
      address: "Jl. Wates KM 10, Kulon Progo",
      coordinates: { lat: -7.8063153, lng: 110.1640543 },
      status: "inactive",
      capacity: 600,
      currentStock: 0,
      district: "Kulon Progo",
    },
  ];

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      mapFilter === "all" ||
      (mapFilter === "active" && agent.status === "active") ||
      (mapFilter === "low_stock" && agent.currentStock / agent.capacity <= 0.3);

    return matchesSearch && matchesFilter;
  });

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      const mapElement = document.getElementById("google-map");
      if (mapElement && window.google) {
        const mapInstance = new google.maps.Map(mapElement, {
          center: { lat: -7.8, lng: 110.3 },
          zoom: 11,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9e9e9" }],
            },
          ],
        });

        setMap(mapInstance);
        createMarkers(mapInstance);
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCP58B08SVqxpGpq3IpNCYAG9g1R3oilnw&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const createMarkers = (mapInstance: google.maps.Map) => {
    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = filteredAgents.map((agent) => {
      const marker = new google.maps.Marker({
        position: agent.coordinates,
        map: mapInstance,
        title: agent.name,
        icon: {
          url: getMarkerIcon(agent),
          scaledSize: new google.maps.Size(30, 30),
        },
      });

      marker.addListener("click", () => {
        setSelectedAgent(agent);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const getMarkerIcon = (agent: Agent) => {
    if (agent.status === "inactive")
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiM2Qjc0ODEiLz4KPC9zdmc+";

    const stockPercentage = (agent.currentStock / agent.capacity) * 100;
    if (stockPercentage <= 20)
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNFRjQ0NDQiLz4KPC9zdmc+";
    if (stockPercentage <= 50)
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNGNTk1MjAiLz4KPC9zdmc+";
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiMxMEI5ODEiLz4KPC9zdmc+";
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  };

  const handleResetView = () => {
    if (map) {
      map.setCenter({ lat: -7.8, lng: 110.3 });
      map.setZoom(11);
    }
  };

  const toggleLayer = (layerType: string) => {
    if (map) {
      switch (layerType) {
        case "traffic":
          const trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(map);
          break;
        case "transit":
          const transitLayer = new google.maps.TransitLayer();
          transitLayer.setMap(map);
          break;
        case "satellite":
          map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
          break;
        case "roadmap":
          map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
          break;
      }
    }
  };

  const getStockStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage <= 20) return { color: "bg-red-500", text: "Stok Rendah" };
    if (percentage <= 50)
      return { color: "bg-yellow-500", text: "Stok Sedang" };
    return { color: "bg-green-500", text: "Stok Cukup" };
  };

  const getMarkerColor = (agent: Agent) => {
    if (agent.status === "inactive") return "bg-gray-500";
    const stockPercentage = (agent.currentStock / agent.capacity) * 100;
    if (stockPercentage <= 20) return "bg-red-500";
    if (stockPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate("/agents")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Peta Agen & Kios
            </h1>
            <p className="text-gray-600 mt-1">
              Visualisasi lokasi dan status agen penyalur subsidi
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowLayers(!showLayers)}
          >
            <Layers className="w-4 h-4 mr-2" />
            Layer
          </Button>
          <Button variant="primary">
            <MapPin className="w-4 h-4 mr-2" />
            Tambah Lokasi
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Search & Filter */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari agen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={mapFilter}
                  onChange={(e) => setMapFilter(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="all">Semua Agen</option>
                  <option value="active">Agen Aktif</option>
                  <option value="low_stock">Stok Rendah</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </Card>

          {/* Legend */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Legenda</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stok Cukup</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stok Sedang</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stok Rendah</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Tidak Aktif</span>
              </div>
            </div>
          </Card>

          {/* Layer Controls */}
          {showLayers && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Layer Peta</h3>
              <div className="space-y-2">
                <button
                  onClick={() => toggleLayer("roadmap")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Peta Jalan
                </button>
                <button
                  onClick={() => toggleLayer("satellite")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Satelit
                </button>
                <button
                  onClick={() => toggleLayer("traffic")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Lalu Lintas
                </button>
                <button
                  onClick={() => toggleLayer("transit")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Transportasi Umum
                </button>
              </div>
            </Card>
          )}

          {/* Agent List */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Daftar Agen ({filteredAgents.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAgents.map((agent) => {
                const stockStatus = getStockStatus(
                  agent.currentStock,
                  agent.capacity
                );
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedAgent?.id === agent.id
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${getMarkerColor(
                          agent
                        )}`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {agent.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {agent.address}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${stockStatus.color} text-white`}
                          >
                            {stockStatus.text}
                          </span>
                          <span className="text-xs text-gray-500">
                            {agent.currentStock}/{agent.capacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Map Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="relative overflow-hidden">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              <Button variant="secondary" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleResetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Google Maps Container */}
            <div id="google-map" className="w-full h-[600px]"></div>

            {/* District Labels */}
            <div className="absolute top-4 left-4 bg-white/90 rounded-xl p-3">
              <h4 className="font-medium text-gray-800 mb-2">
                Wilayah Cakupan
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Bantul: 89 agen</div>
                <div>• Sleman: 76 agen</div>
                <div>• Kulon Progo: 54 agen</div>
                <div>• Gunung Kidul: 67 agen</div>
                <div>• Yogyakarta: 38 agen</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Detail Agen Terpilih
              </h3>
              <Button
                variant="secondary"
                onClick={() => setSelectedAgent(null)}
              >
                Tutup
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Informasi Dasar
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Nama:</span>{" "}
                    {selectedAgent.name}
                  </div>
                  <div>
                    <span className="text-gray-600">Alamat:</span>{" "}
                    {selectedAgent.address}
                  </div>
                  <div>
                    <span className="text-gray-600">Kecamatan:</span>{" "}
                    {selectedAgent.district}
                  </div>
                  <div>
                    <span className="text-gray-600">Koordinat:</span>{" "}
                    {selectedAgent.coordinates.lat},{" "}
                    {selectedAgent.coordinates.lng}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Status & Stok
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedAgent.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedAgent.status === "active"
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stok Saat Ini:</span>{" "}
                    {selectedAgent.currentStock}
                  </div>
                  <div>
                    <span className="text-gray-600">Kapasitas:</span>{" "}
                    {selectedAgent.capacity}
                  </div>
                  <div>
                    <span className="text-gray-600">Utilisasi:</span>{" "}
                    {Math.round(
                      (selectedAgent.currentStock / selectedAgent.capacity) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Aksi Cepat</h4>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/agents/${selectedAgent.id}`)}
                  >
                    Lihat Detail Lengkap
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    Hubungi Agen
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    Buat Rute Navigasi
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MapPage;
