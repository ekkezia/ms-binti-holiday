import { supabase } from '../config/supabase';
import { ImageData } from '../types/types'


export function generateResetButton(): void {
  const resetButton = document.getElementById('reset');
  if (!resetButton) {
    console.error('Reset button not found');
    return;
  }

  resetButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/images.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }

      const imagesData: ImageData[] = await response.json();

      for (const image of imagesData) {
        const { data, error } = await supabase
          .from('ms-binti-holiday')
          .update({
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
            ip_address: null,
          })
          .eq('id', image.id);

        if (error) {
          console.error(`Error resetting record with id ${image.id}:`, error);
        } else {
          console.log('Record resetted:', data);
        }
      }
    } catch (error) {
      console.error('Error fetching or updating data:', error);
    }
  });
}
