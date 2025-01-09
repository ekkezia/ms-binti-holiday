import Konva from 'konva';

import { generateCanvas } from './canvas';
import { generateGrids } from './grids';
import { generateResetButton } from './reset-button';
import './style.css'

const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

const apiUrlElement = document.getElementById('api-url');
if (apiUrlElement) {
  apiUrlElement.textContent = apiUrl || 'API URL not defined';
}

// generate layer, layer is shared across different ts files
const layer = new Konva.Layer();

// generate grids as background (dots)
generateGrids();

// generate reset button
generateResetButton(layer);

// show images from Supabase
generateCanvas(layer);