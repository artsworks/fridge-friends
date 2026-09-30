import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AssetGallery } from './components/AssetGallery';
import { PlushLab } from './components/PlushLab';
import './styles/global.css';

const q = new URLSearchParams(window.location.search);
const page = import.meta.env.DEV && q.has('assets') ? <AssetGallery /> : import.meta.env.DEV && q.has('plush') ? <PlushLab /> : <App />;

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
