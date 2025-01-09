import { Layer } from 'konva/lib/Layer';
import { supabase } from '../config/supabase';
import { ImageData } from '../types/types';

export function generateResetButton(layer: Layer): void {
  const resetButton = document.getElementById('reset') as HTMLButtonElement | null;
  if (!resetButton) {
    console.error('Reset button not found');
    return;
  }

  resetButton.addEventListener('click', async () => {
    try {
      resetButton.textContent = '⌛️ loading...';

      // Fetch data from Supabase (assuming the data matches the ImageData structure)
      const { data, error } = await supabase
        .from('ms-binti-holiday')
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        resetButton.textContent = '❤️‍🩹 something went wrong!';
        return;
      }

      // Filter data where ip_address is not null
      const dataToBeReset = data?.filter((item: { ip_address: null; }) => item.ip_address !== null) || [];

      // Fetch original image data locally
      const response = await fetch('/data/images.json');
      const imagesData: ImageData[] = await response.json();

      for (let i = 0; i < dataToBeReset.length; i++) {
        const image = imagesData.find((item) => item.id === dataToBeReset[i].id);

        if (!image) {
          console.error(`Image data with id ${dataToBeReset[i].id} not found in local data.`);
          continue;
        }

        // Update the data in Supabase
        const { data: updatedData, error: updateError } = await supabase
          .from('ms-binti-holiday')
          .update({
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
            ip_address: null,
          })
          .eq('id', dataToBeReset[i].id);

        if (updateError) {
          console.error('Error resetting record:', updateError);
          break;
        } else {
          console.log('updated:', updatedData)
          // Redraw the image that just got reset
          const group = layer.findOne(`#${dataToBeReset[i].id}`);
          // console.log('group', group);

          if (group) {
            group.position({
              x: image.x,
              y: image.y,
            });

            group.setAttrs({
              width: image.width,
              height: image.height,
            });

            // (Optional) Redraw the layer after position update
            // layer.batchDraw();
          }
        }
      }
    } catch (error) {
      console.error('Error updating data:', error);
      resetButton.textContent = '❤️‍🩹 something went wrong!';
    }

    // Reset button text after operation
    resetButton.textContent = 'reset';
  });
}
