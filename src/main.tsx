import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AssetGallery } from './components/AssetGallery';
import './styles/global.css';

const showAssets = import.meta.env.DEV && new URLSearchParams(window.location.search).has('assets');

createRoot(document.getElementById('root')!).render(<StrictMode>{showAssets ? <AssetGallery /> : <App />}</StrictMode>);
