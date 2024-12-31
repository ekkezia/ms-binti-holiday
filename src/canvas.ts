import { supabase } from '../config/supabase';
import Konva from 'konva';
import { ImageData } from '../types/types';

export function generateCanvas(): void {
  // Konva stage
  const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // Title
  const title = new Konva.Text({
    text: "MISS BINTI'S HOLIDAY",
    fontSize: 40,
    fontFamily: 'Helvetica',
    fontStyle: 'bold',
    fill: 'fuchsia',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    textAlign: 'center',
  });

  title.x((stage.width() - title.width()) / 2);
  layer.add(title);

  // Fetch IP address
  async function getIpAddress(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data: { ip: string } = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  }

  // Add text to canvas
  async function addTextToCanvas(x: number, y: number, textContent: string): Promise<void> {
    const ipAddress = await getIpAddress();

    const text = new Konva.Text({
      x,
      y,
      text: textContent,
      fontSize: 20,
      fontFamily: 'Arial',
      fill: 'black',
      draggable: true,
    });

    layer.add(text);
    layer.draw();

    try {
      const { data, error } = await supabase
        .from('ms-binti-holiday')
        .insert([{ text: textContent, x, y, ip_address: ipAddress }])
        .select();

      if (error) {
        console.error('Error inserting text:', error);
      } else {
        console.log('Text inserted:', data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  // Update image data in Supabase
  async function updateImageData(
    imageId: number,
    newPositionX: number,
    newPositionY: number,
    newWidth: number,
    newHeight: number,
  ): Promise<void> {
    const ipAddress = await getIpAddress();
    try {
      const { data, error } = await supabase
        .from('ms-binti-holiday')
        .update({
          x: newPositionX,
          y: newPositionY,
          width: newWidth,
          height: newHeight,
          ip_address: ipAddress,
        })
        .eq('id', imageId);

      if (error) {
        console.error('Error updating position:', error);
      } else {
        console.log('Position updated:', data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  // Fetch images from Supabase
  async function fetchData(): Promise<void> {
    try {
      const { data, error } = await supabase.from('ms-binti-holiday').select('*');

      if (error || !data) {
        console.error('Error fetching data:', error);
        return;
      }

      data.forEach((imageData: ImageData) => {
        const group = new Konva.Group({
          x: imageData.x || 0,
          y: imageData.y || 0,
          draggable: true,
        });

        // Description text
        const text = new Konva.Text({
          text: imageData.text || '',
          fontSize: 12,
          fontFamily: 'Helvetica',
          fill: 'black',
          y: (imageData.height || 0) + 5,
        });

        // Position text
        const pos = new Konva.Text({
          text: `[${imageData.x || 0}, ${imageData.y || 0}]`,
          fontSize: 12,
          fontFamily: 'Helvetica',
          fill: 'black',
          y: (imageData.height || 0) + 20,
        });

        // IP Address text
        const ipAddress = new Konva.Text({
          text: imageData.ip_address || '',
          fontSize: 10,
          fontFamily: 'Helvetica',
          fill: 'black',
          y: -15,
        });

        // Load the image
        Konva.Image.fromURL(
          `https://lmgbcuolwhkqoowxnaik.supabase.co/storage/v1/object/public/ms-binti-holiday/${imageData.src}.jpeg`,
          (img) => {
            img.setAttrs({
              width: imageData.width || 100,
              height: imageData.height || 100,
              name: 'image',
            });

            group.add(img);
            group.add(text);
            group.add(pos);
            group.add(ipAddress);

            layer.add(group);

            group.on('dragmove', () => {
              const newPos = group.position();
              pos.text(`[${Math.round(newPos.x)}, ${Math.round(newPos.y)}]`);
            });

            group.on('dragend', () => {
              const newPos = group.position();
              updateImageData(
                imageData.id,
                Math.round(newPos.x),
                Math.round(newPos.y),
                img.width(),
                img.height(),
              );
            });
          },
        );
      });

      layer.draw();
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  }

  fetchData();

  // resize canvas on resize window
  function resizeCanvas(): void {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
    layer.batchDraw();
  }

  window.addEventListener('resize', resizeCanvas);
}
