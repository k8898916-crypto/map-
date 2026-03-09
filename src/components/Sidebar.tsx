import React, { useState } from 'react';
import { Place, Route, AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, MapPin, Route as RouteIcon, Settings, Globe } from 'lucide-react';

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  activeTool: 'pointer' | 'add-place';
  setActiveTool: (tool: 'pointer' | 'add-place') => void;
}

const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

export default function Sidebar({ state, setState, activeTool, setActiveTool }: SidebarProps) {
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceColor, setNewPlaceColor] = useState(COLORS[0]);
  const [newRouteFrom, setNewRouteFrom] = useState('');
  const [newRouteTo, setNewRouteTo] = useState('');
  const [newRouteColor, setNewRouteColor] = useState(COLORS[4]);

  const handleAddPlace = () => {
    if (!newPlaceName) return;
    const newPlace: Place = {
      id: uuidv4(),
      name: newPlaceName,
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      color: newPlaceColor,
    };
    setState(s => ({ ...s, places: [...s.places, newPlace] }));
    setNewPlaceName('');
  };

  const handleAddRoute = () => {
    if (!newRouteFrom || !newRouteTo || newRouteFrom === newRouteTo) return;
    const newRoute: Route = {
      id: uuidv4(),
      fromId: newRouteFrom,
      toId: newRouteTo,
      color: newRouteColor,
    };
    setState(s => ({ ...s, routes: [...s.routes, newRoute] }));
    setNewRouteFrom('');
    setNewRouteTo('');
  };

  const removePlace = (id: string) => {
    setState(s => ({
      ...s,
      places: s.places.filter(p => p.id !== id),
      routes: s.routes.filter(r => r.fromId !== id && r.toId !== id),
    }));
  };

  const removeRoute = (id: string) => {
    setState(s => ({ ...s, routes: s.routes.filter(r => r.id !== id) }));
  };

  return (
    <div className="w-80 bg-zinc-950 text-zinc-100 flex flex-col h-full border-r border-zinc-800/50 overflow-y-auto shadow-2xl z-10">
      <div className="p-5 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/50">
        <h1 className="text-lg font-bold flex items-center gap-2 tracking-tight">
          <Globe className="text-blue-500" size={20} /> 
          Map Animator
        </h1>
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <Settings size={18} />
        </button>
      </div>

      <div className="p-5 border-b border-zinc-800/50">
        <button
          onClick={() => setActiveTool(activeTool === 'add-place' ? 'pointer' : 'add-place')}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTool === 'add-place' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-zinc-950' 
              : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          <MapPin size={16} /> {activeTool === 'add-place' ? 'Click on map to add...' : 'Add Place on Map'}
        </button>
      </div>

      <div className="p-5 border-b border-zinc-800/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          <MapPin size={14} /> Places
        </h2>
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
          {state.places.map(place => (
            <div key={place.id} className="flex items-center justify-between bg-zinc-900/80 hover:bg-zinc-800 p-2.5 rounded-lg transition-colors group border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: place.color }} />
                <span className="text-sm font-medium text-zinc-200">{place.name}</span>
              </div>
              <button onClick={() => removePlace(place.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {state.places.length === 0 && (
            <div className="text-center py-4 text-sm text-zinc-600 italic">No places added yet</div>
          )}
        </div>
        <div className="space-y-2 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlaceName}
              onChange={e => setNewPlaceName(e.target.value)}
              placeholder="Quick add place..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-zinc-300 placeholder:text-zinc-600"
              onKeyDown={e => e.key === 'Enter' && handleAddPlace()}
            />
            <button onClick={handleAddPlace} className="bg-zinc-100 hover:bg-white text-zinc-900 p-2 rounded-lg transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex gap-1 justify-between pt-1">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNewPlaceColor(color)}
                className={`w-5 h-5 rounded-full transition-transform ${newPlaceColor === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-zinc-950 ring-zinc-500' : 'hover:scale-110'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          <RouteIcon size={14} /> Routes
        </h2>
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
          {state.routes.map(route => {
            const from = state.places.find(p => p.id === route.fromId);
            const to = state.places.find(p => p.id === route.toId);
            return (
              <div key={route.id} className="flex items-center justify-between bg-zinc-900/80 hover:bg-zinc-800 p-2.5 rounded-lg transition-colors group border border-zinc-800/50">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }} />
                  <span className="font-medium text-zinc-300">{from?.name}</span>
                  <span className="text-zinc-600">→</span>
                  <span className="font-medium text-zinc-300">{to?.name}</span>
                </div>
                <button onClick={() => removeRoute(route.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {state.routes.length === 0 && (
            <div className="text-center py-4 text-sm text-zinc-600 italic">No routes added yet</div>
          )}
        </div>
        <div className="space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
          <select
            value={newRouteFrom}
            onChange={e => setNewRouteFrom(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-zinc-300"
          >
            <option value="">Select start...</option>
            {state.places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            value={newRouteTo}
            onChange={e => setNewRouteTo(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-zinc-300"
          >
            <option value="">Select destination...</option>
            {state.places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="flex gap-1 justify-between py-1">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNewRouteColor(color)}
                className={`w-5 h-5 rounded-full transition-transform ${newRouteColor === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-zinc-950 ring-zinc-500' : 'hover:scale-110'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleAddRoute}
            disabled={!newRouteFrom || !newRouteTo || newRouteFrom === newRouteTo}
            className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 disabled:bg-zinc-800 disabled:text-zinc-500 py-2 rounded-lg text-sm font-semibold transition-colors mt-2"
          >
            <Plus size={16} /> Create Route
          </button>
        </div>
      </div>
    </div>
  );
}
