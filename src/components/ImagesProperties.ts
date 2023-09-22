// export async function processImages(layer) {
//     try {
//       const images = getImageFills(layer);
//       const imageNodes = images.map((image) => image.node);
  
//       const promises = images.map(async (image) => {
//         try {
//           if (image?.intArr) {
//             const processedImage = {
//               imageHash: await figma.createImage(image.intArr).hash,
//               width: image.width,
//               height: image.height,
//               fillStyleId: image.fillStyleId,
//               scaleMode: image.scaleMode,
//               imageType: image.imageType,
//               src: image.src,
//               absoluteTransform: image.absoluteTransform,
//               fills: image.fills,
//               // Agrega aquí todas las demás propiedades relevantes del nodo de imagen
//             };
//             delete image.intArr;
  
//             // Actualiza el objeto image con el nodo de imagen procesado
//             image.node = processedImage;
//           }
//         } catch (error) {
//           console.error('Error processing image: Uno', error);
//         }
//       });
  
//       await Promise.all(promises); // Esperar a que se resuelvan todas las promesas
//       console.log("success:", imageNodes)
//       return imageNodes; // Devolver los nodos de imagen una vez que se hayan procesado
      
//     } catch (error) {
//       console.error('Error processing images: Dos', error);
//       return [];
//     }
//   }
  
 export function getImageFills(layer) {
    const images =
      Array.isArray(layer.fills) &&
      layer.fills.filter((item) => item.type === 'IMAGE');
  
    // Para cada imagen, crea un objeto que incluya el nodo de imagen y todas las propiedades
    return images.map((image) => ({
      node: image,
      name: image.name,
      fillStyleId: image.fillStyleId,
      scaleMode: image.scaleMode,
      width: image.width,
      height: image.height,
      imageType: image.imageType,
      src: image.src,
      absoluteTransform: image.absoluteTransform,
      fills: image.fills,
      // Agrega aquí todas las demás propiedades relevantes del nodo de imagen
    }));
  }

  export async function processImages(layer) {
    try {
      // Verifica si el nodo tiene la propiedad "fills" definida y contiene imágenes
      if (layer.fills && Array.isArray(layer.fills)) {
        const imageFills = layer.fills.filter(item => item.type === 'IMAGE');
        
        if (imageFills.length > 0) {
          const images = getImageFills(layer);
          const imageNodes = images.map((image) => image.node);
    
          const promises = images.map(async (image) => {
            try {
              if (image?.intArr) {
                const processedImage = {
                  imageHash: await figma.createImage(image.intArr).hash,
                  width: image.width,
                  height: image.height,
                  fillStyleId: image.fillStyleId,
                  scaleMode: image.scaleMode,
                  imageType: image.imageType,
                  src: image.src,
                  absoluteTransform: image.absoluteTransform,
                  fills: image.fills,
                 
                };
                delete image.intArr;
    
                // Actualiza el objeto image con el nodo de imagen procesado
                image.node = processedImage;
              }
            } catch (error) {
              console.error('Error processing image: Uno', error);
            }
          });
    
          await Promise.all(promises); // Esperar a que se resuelvan todas las promesas
          //console.log("succes:", imageNodes)
          return imageNodes; // Devolver los nodos de imagen una vez que se hayan procesado
          
        } else {
          console.error('El nodo seleccionado no contiene imágenes en las propiedades "fills".');
          return [];
        }
      } else {
        console.error('El nodo seleccionado no tiene la propiedad "fills" definida.');
        return [];
      }
    } catch (error) {
      console.error('Error processing images:Dos', error);
      return [];
    }
  }