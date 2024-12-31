import { generateCanvas } from './canvas';
import { generateGrids } from './grids';
import { generateResetButton } from './reset-button';
import './style.css'

const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

const apiUrlElement = document.getElementById('api-url');
if (apiUrlElement) {
  apiUrlElement.textContent = apiUrl || 'API URL not defined';
}

// generate grids as background (dots)
generateGrids();

// generate reset button
generateResetButton();

// show images from Supabase
generateCanvas();