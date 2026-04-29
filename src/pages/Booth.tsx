import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Search, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to automatically zoom/pan to the selected booth
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

const BOOTHS = [
  { id: 1, name: 'Delhi Public School', address: 'Mathura Road, New Delhi', coords: [28.5912, 77.2415] as [number, number], crowd: 'Low', time: '10 min' },
  { id: 2, name: 'Government Girls School', address: 'RK Puram Section 4, New Delhi', coords: [28.5636, 77.1706] as [number, number], crowd: 'High', time: '45 min' },
  { id: 3, name: 'Community Center', address: 'Vasant Vihar, New Delhi', coords: [28.5604, 77.1610] as [number, number], crowd: 'Medium', time: '20 min' },
  { id: 4, name: 'Kendriya Vidyalaya', address: 'Gole Market, New Delhi', coords: [28.6329, 77.2001] as [number, number], crowd: 'Low', time: '5 min' },
];

export default function BoothLocator() {
  const [epicNumber, setEpicNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<typeof BOOTHS[0] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epicNumber.trim()) return;

    setIsSearching(true);
    // Simulate API call for polling booth lookup
    setTimeout(() => {
      // Pick a random booth for demonstration
      const randomBooth = BOOTHS[Math.floor(Math.random() * BOOTHS.length)];
      setSelectedBooth(randomBooth);
      setIsSearching(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pt-8 pb-24 lg:pb-12 px-6 max-w-[1280px] mx-auto w-full flex flex-col gap-6"
    >
      <header className="glass-panel rounded-xl p-6 shadow-sm mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Find Your Polling Station
          </h1>
          <p className="text-lg text-on-surface-variant mt-2">
            Enter your Voter ID (EPIC Number) to locate your designated polling booth.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <input 
              type="text" 
              value={epicNumber}
              onChange={(e) => setEpicNumber(e.target.value.toUpperCase())}
              placeholder="e.g. ABC1234567" 
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase font-mono"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching || !epicNumber}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
            {isSearching ? 'Locating...' : 'Locate'}
          </button>
        </form>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[600px] w-full">
        {/* Map Region */}
        <div className="glass-panel rounded-xl shadow-sm border-outline-variant flex-grow overflow-hidden relative z-0 relative z-0 h-full min-h-[400px]">
          <MapContainer 
            center={selectedBooth ? selectedBooth.coords : [28.6139, 77.2090]} 
            zoom={12} 
            scrollWheelZoom={true}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedBooth && <MapUpdater center={selectedBooth.coords} />}
            
            {selectedBooth ? (
              <Marker position={selectedBooth.coords}>
                <Popup>
                  <div className="font-sans">
                    <strong className="block text-primary text-sm mb-1">{selectedBooth.name}</strong>
                    <span className="text-xs text-on-surface-variant">{selectedBooth.address}</span>
                  </div>
                </Popup>
              </Marker>
            ) : (
              BOOTHS.map(booth => (
                <Marker key={booth.id} position={booth.coords}>
                  <Popup>
                    <div className="font-sans">
                      <strong className="block text-primary text-sm mb-1">{booth.name}</strong>
                      <span className="text-xs text-on-surface-variant">{booth.address}</span>
                    </div>
                  </Popup>
                </Marker>
              ))
            )}
          </MapContainer>
        </div>

        {/* Info Pail */}
        <AnimatePresence>
          {selectedBooth && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:w-96 shrink-0 flex flex-col gap-4"
            >
              <div className="glass-panel p-6 rounded-xl border border-secondary shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-primary">Designated Booth</h2>
                  <span className="bg-secondary/10 text-secondary text-xs uppercase font-bold tracking-wider px-2 py-1 rounded">Match Found</span>
                </div>
                
                <h3 className="text-2xl font-bold text-on-surface mb-1">{selectedBooth.name}</h3>
                <p className="text-on-surface-variant text-sm mb-6 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {selectedBooth.address}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                    <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Estimated Queue</span>
                    <span className={`text-lg font-bold ${
                      selectedBooth.crowd === 'Low' ? 'text-green-600' : 
                      selectedBooth.crowd === 'Medium' ? 'text-yellow-600' : 'text-error'
                    }`}>
                      {selectedBooth.time}
                    </span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-lg border border-outline-variant">
                    <span className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Crowd Level</span>
                    <span className={`text-lg font-bold ${
                      selectedBooth.crowd === 'Low' ? 'text-green-600' : 
                      selectedBooth.crowd === 'Medium' ? 'text-yellow-600' : 'text-error'
                    }`}>
                      {selectedBooth.crowd}
                    </span>
                  </div>
                </div>

                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBooth.coords[0]},${selectedBooth.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-secondary text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
