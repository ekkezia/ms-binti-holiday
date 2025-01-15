import { supabase } from '../config/supabase';
import Konva from 'konva';
import { ImageData } from '../types/types';
import { Layer } from 'konva/lib/Layer';

export function generateCanvas(layer: Layer): void {
  // Konva stage
  const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
    x: 200,
    y: 100,
    scaleX: 0.25,
    scaleY: 0.25
  });

  stage.add(layer);

  // Title
  const title_ms = new Konva.Text({
    text: "Ms.",
    fontSize: 150,
    fontFamily: 'Jacquarda Bastarda 9',
    fontStyle: 'bold',
    fill: 'black',
    x: window.innerWidth / 2 + 2150,
    y: window.innerHeight / 2 + 1800,
    textAlign: 'center',
  });
  const title_b = new Konva.Text({
    text: "B",
    fontSize: 300,
    fontFamily: 'Jacquarda Bastarda 9',
    fontStyle: 'bold',
    fill: '#00AAFF',
    stroke: 'black',
    x: window.innerWidth / 2 + 2500,
    y: window.innerHeight / 2 + 1700,
    textAlign: 'center',
  });
  const title_inti= new Konva.Text({
    text: "inti's",
    fontSize: 150,
    fontFamily: 'Itim',
    fontStyle: 'bold',
    fill: 'black',
    x: window.innerWidth / 2 + 2780,
    y: window.innerHeight / 2 + 1800,
    textAlign: 'center',
  });
  const title_h= new Konva.Text({
    text: "H",
    fontSize: 300,
    fontFamily: 'Jacquarda Bastarda 9',
    fontStyle: 'bold',
    fill: 'black',
    stroke: '#00AAFF',
    x: window.innerWidth / 2 + 3200,
    y: window.innerHeight / 2 + 1700,
    textAlign: 'center',
  });

  const title_oli= new Konva.Text({
    text: "oli",
    fontSize: 150,
    fontFamily: 'Itim',
    fontStyle: 'bold',
    fill: 'black',
    x: window.innerWidth / 2 + 3450,
    y: window.innerHeight / 2 + 1800,
    textAlign: 'center',
  });
  const title_day= new Konva.Text({
    text: "day",
    fontSize: 150,
    fontFamily: 'Itim',
    fontStyle: 'bold',
    fill: '#00AAFF',
    stroke: 'black',
    x: window.innerWidth / 2 + 3610,
    y: window.innerHeight / 2 + 1800,
    textAlign: 'center',
  });



  layer.add(title_ms);
  layer.add(title_b);
  layer.add(title_inti);
  layer.add(title_h);
  layer.add(title_oli);
  layer.add(title_day);

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
  // async function addTextToCanvas(x: number, y: number, textContent: string): Promise<void> {
  //   const ipAddress = await getIpAddress();

  //   const text = new Konva.Text({
  //     x,
  //     y,
  //     text: textContent,
  //     fontSize: 20,
  //     fontFamily: 'Arial',
  //     fill: 'black',
  //     draggable: true,
  //   });

  //   layer.add(text);
  //   layer.draw();

  //   try {
  //     const { data, error } = await supabase
  //       .from('ms-binti-holiday')
  //       .insert([{ text: textContent, x, y, ip_address: ipAddress }])
  //       .select();

  //     if (error) {
  //       console.error('Error inserting text:', error);
  //     } else {
  //       console.log('Text inserted:', data);
  //     }
  //   } catch (error) {
  //     console.error('Unexpected error:', error);
  //   }
  // }

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

        // add id to the group
        group.id(`${imageData.id}`);

        // Description text
        const text = new Konva.Text({
          text: imageData.text?.slice(16, 27) || '',
          fontSize: 30,
          fontFamily: 'Helvetica',
          fill: 'black',
          y: (imageData.height || 0) + 5,
        });

        // Position text
        const pos = new Konva.Text({
          text: `[${imageData.x || 0}, ${imageData.y || 0}]`,
          fontSize: 30,
          fontFamily: 'Helvetica',
          fill: 'black',
          y: (imageData.height || 0) + 5,
        });

        // IP Address text
        const ipAddress = new Konva.Text({
          text: imageData.ip_address || '',
          fontSize: 30,
          fontFamily: 'Helvetica',
          fill: 'black',
          y: -30,
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
            // group.add(text);
            group.add(pos);
            group.add(ipAddress);

            layer.add(group);

              // Update text when group is moved
              group.on('dragmove', async () => {
                const newPos = group.position();
                pos.text(`[${Math.round(newPos.x)}, ${Math.round(newPos.y)}]`);
                text.fill('fuchsia');
                pos.fill('fuchsia');
                if (ipAddress) {
                  ipAddress.fill('fuchsia');
                }
              });

              group.on('dragend', async () => {
                const newIpAddress = await getIpAddress();

                text.fill('black');
                pos.fill('black');

                if (newIpAddress) ipAddress.text(newIpAddress);

                if (ipAddress) {
                  ipAddress.fill('black');
                }

                const newPos = group.position();

                updateImageData(
                  imageData.id,
                  Math.round(newPos.x),
                  Math.round(newPos.y),
                  imageData.width,
                  imageData.height,
                );
              });

              const tr = new Konva.Transformer({
                nodes: [img],
                keepRatio: true,
                flipEnabled: false,
                anchorSize: 4,
                rotateEnabled: false,
                  anchorStroke: 'gray', // Anchor stroke color
  anchorFill: 'white', // Anchor fill color
                boundBoxFunc: (oldBox: any, newBox: { width: number; height: number; }) => {
                  if (
                    Math.abs(newBox.width) < 10 ||
                    Math.abs(newBox.height) < 10
                  ) {
                    return oldBox;
                  }
                  return newBox;
                },
              });

              // Add transformer to the layer
              layer.add(tr);

              img.on('transform', () => {
                img.setAttrs({
                  scaleX: 1,
                  scaleY: 1,
                  width: img.width() * img.scaleX(),
                  height: img.height() * img.scaleX(),
                });
              });

              img.on('transformend', () => {
                console.log('width', img.width() * img.scaleX());
                const newPos = group.position();

                updateImageData(
                  imageData.id,
                  newPos.x,
                  newPos.y,
                  img.width() * img.scaleX(),
                  img.height() * img.scaleX(),
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

        // Optional
      // enable typing text
// stage.on('click', (event: any) => {
//   if (event.target === stage) {
//     const pointerPosition = stage.getPointerPosition();

//     if (!pointerPosition) return;

//     const text = document.createElement('div');
//     text.contentEditable = 'true';
//     text.style.background = 'transparent';
//     text.style.border = 'none';
//     text.style.position = 'absolute';
//     text.style.left = `${pointerPosition.x}px`;
//     text.style.top = `${pointerPosition.y}px`;
//     text.style.zIndex = '10';
//     document.body.appendChild(text);

//     text.focus();

//     text.addEventListener('blur', () => {
//       if (text.textContent && text.textContent.trim() !== '') {
//         // Add the entered text to the canvas
//         addTextToCanvas(
//           pointerPosition.x,
//           pointerPosition.y,
//           text.textContent.trim(),
//         );
//       }

//       // Remove the text input element from the DOM
//       document.body.removeChild(text);
//     });

//     // Handle Enter key
//     text.addEventListener('keydown', (e: KeyboardEvent) => {
//       if (e.key === 'Enter') {
//         e.preventDefault(); // Prevent default Enter key behavior
//         text.blur(); // Trigger the blur event
//       }
//     });
//   }
// });

  // resize canvas on resize window
  function resizeCanvas(): void {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
    layer.batchDraw();
  }

  window.addEventListener('resize', resizeCanvas);
}
