export const deleteProperties = (props) => {
    for (var key in props) {
        if (props[key] === null) {
            delete props[key];
        }
    }
    return props;
}

export const updateZIndex = (node, screen, zIndex = 0) => {
  // actualizar el padre a x = 0, y = 0 
  if (node.figmaId === 1) {
    node.Property.style[screen].position = "relative"
    node.Property.style[screen].grid.positionAbsolute.x = 0;
    node.Property.style[screen].grid.positionAbsolute.y = 0;
    node.Property.style[screen].grid.positionRelative.x = 0;
    node.Property.style[screen].grid.positionRelative.y = 0;    
    node.Property.style.wide.grid.positionAbsolute.x = 0;
    node.Property.style.wide.grid.positionAbsolute.y = 0;
  }
    
  
  // Actualiza el zIndex del objeto actual
  node.Property.style[screen].attribute.zIndex = zIndex;

  // Si el objeto tiene hijos, recorre cada uno de ellos
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      // Calcula el nuevo zIndex para el hijo actual
      const newZIndex = zIndex + i + 2;
      // Llama a la función recursivamente para cada hijo,
      // pasando el nuevo zIndex como argumento
      updateZIndex(node.children[i], screen, newZIndex);
    }
  }
}


const gradoInclinacion = (width, height) => {

    const centroX = width / 2;
    const centroY = height / 2;
    
    const esquinaX = width;
    const esquinaY = height;
    
    const catetoOpuesto = esquinaY - centroY;
    const catetoAdyacente = esquinaX - centroX;
    
    const hipotenusa = Math.sqrt(Math.pow(catetoOpuesto, 2) + Math.pow(catetoAdyacente, 2));
    
    const radianes = Math.atan2(catetoOpuesto, catetoAdyacente);
    
    const grados = radianes * (180 / Math.PI);
    
    return 90 - grados;
}

const  rever = (xr, yr, w, h, deg) => {
  const d = Math.sqrt(Math.pow(w/2, 2) + Math.pow(h/2, 2))
  const rad = ((deg + gradoInclinacion(w, h)) * Math.PI)/180
  const x1 = d * Math.sin(rad)
  const y1 = d * Math.cos(rad)
    
  return {
    x: xr + x1 - w/2,
    y: yr + y1 - h/2
  }
}

export const updateProperties = (node, screen) => {
    if (node.Property.style[screen].attribute.rotation <= 180) {
    const angle = node.Property.style[screen].attribute.rotation
    const grid = node.Property.style[screen].grid
    const newGrid = rever(grid.positionAbsolute.x, grid.positionAbsolute.y, grid.width, grid.height, angle)
    node.Property.style[screen].grid.positionAbsolute.x = newGrid.x
    node.Property.style[screen].grid.positionAbsolute.y = newGrid.y
  }
  if (node.hasChildren) {
    node.children.forEach(child => {
      updateProperties(child, screen);
    });
  }
}

export const modifyPosition = (node, screen) => {
  const parentGrid = node.Property.style[screen].grid  
  if (node.hasChildren && node.children) {
    node.children.forEach(child => {
      const grid = child.Property.style[screen].grid
      if (child.Property.style[screen]) {
        if (child.Property.style[screen].position !== 'absolute') {
          if (node.Property.style[screen].attribute.display === 'flex' ) {
            child.Property.style[screen].position = 'static';
          } else {
            child.Property.style[screen].position = 'absolute';
            child.Property.style.wide.position = 'absolute';
            if (node.type === "GROUP" ) {              
              grid.positionAbsolute.x -= node.x;
              grid.positionAbsolute.y -= node.y;
              if (child.Property.style[screen].attribute.isMask &&
                child.Property.style[screen].attribute.isMask === true) {
                node.Property.style[screen].attribute.clipPath = child.Property.style[screen].attribute.clipPath
                node.Property.style[screen].attribute.rotation = node.Property.style[screen].attribute.rotation ?? child.Property.style[screen].attribute.rotation ?? 0
                child.Property.style[screen].attribute.visibility = "hidden"
              }
            }
            grid.x -= parentGrid.positionRelative.x;
            grid.y -= parentGrid.positionRelative.y;
          }
        }
        modifyPosition(child, screen);
      }
    });
  }
}

export const buildRotation = (node, screen) => {
  if (node.Property.style[screen].attribute.rotation) {
    const deg = node.Property.style[screen].attribute.rotation

    if (deg === -180 ) {
      node.Property.style[screen].attribute.rotation = (deg + 90)
    } else if (deg === 180) {
      node.Property.style[screen].attribute.rotation = (deg - 90) 
    }
      node.Property.style[screen].attribute.rotation = deg * -1
  }
  if (node.hasChildren) {
    node.children.forEach(child => {
      buildRotation(child, screen);
    });
  }
}

export const changeVisibility = (node, screen) => {
  // Si el nodo no es visible, establece todos sus hijos como no visibles y 'isShow' en false
  if (node.Property.style[screen].attribute.visibility === "hidden" ) {
    node.isShow = false;
    if (node.hasChildren) {
      node.children.forEach(child => {
        child.Property.style[screen].attribute.visibility = "hidden";
        child.isShow = false;
        changeVisibility(child, screen);
      });      
    }
  } else if (node.hasChildren) {
    // Si el nodo es visible, recorre sus hijos
    node.children.forEach((child) => changeVisibility(child, screen));
  }
}

/**
 * Positions
*/

export const getAbsolutePosition = (node) => {
  if (
    typeof node.x !== "number" ||
    !node.parent
  ) {
    return { x: 0, y: 0 };
  }
  const position = {
    x: node.x,
    y: node.y,
  };

  if (["PAGE", "DOCUMENT"].includes(node.parent.type)) {
    return position;
  }

  let parent: SceneNode | null = node;
  while ((parent = parent.parent as SceneNode | null)) {
    if (!isGroupNode(parent) && typeof parent.x === "number") {
        position.x -= parent.x;
        position.y -= parent.y;
    }
    if (["PAGE", "DOCUMENT"].includes(parent.parent!?.type)) {
      break;
    }
  }
  return position;
};

export const isGroupNode = (node: unknown): node is GroupNode =>
    !!(node && (node as any).type === "GROUP");
  

export const getDisplay = (node) => {
  if (node.inferredAutoLayout.layoutMode) return "flex"
  if (node.layoutGrids && node.layoutGrids[0].length > 0) return "grid"
}

export const getVisibility = (node) => {
  if (node.visible === false) {
    node.isShow = false;
    return "hidden";
  }
  if (node.parent) {
    return getVisibility(node.parent);
  }
  return "visible";
}

/**
  * LAYOUT
  * @param node 
  * @returns layoutMode --> flexDirection 
*/
export const getLayoutMode = (node) => {
 
  if (node.inferredAutoLayout.layoutMode === "VERTICAL") {
    return "column";
  }
  if (node.inferredAutoLayout.layoutMode === "HORIZONTAL") {
    return "row";
  }
  return null;
};

export const getLayoutSizingHorizontal = (node) => {
  if (node.layoutSizingHorizontal === "FIXED") {
    return "fixed"; // Width fijo
  }
  if (node.layoutSizingHorizontal === "FILL") {
    return "fill" // Width 100%; 
  }
  if (node.layoutSizingHorizontal === "HUG") {
    return "hug"; // Width auto
  }
};

export const getLayoutSizingVertictal = (node) => { 
  if (node.layoutSizingVertical && node.layoutSizingVertical === "FIXED") {
    return "fixed"; // Height fijo
  }
  if (node.layoutSizingVertical && node.layoutSizingVertical === "FILL") {
    return "fill" // Height 100%; 
  }
  if (node.layoutSizingVertical && node.layoutSizingVertical === "HUG") {
    return "hug"; // Height auto
  }
};

/**
 * 
 * @param node 
 * @returns primaryAxisAlignItems --> justify-content
      ‘MIN’ en Figma puede corresponder a ‘flex-start’ o ‘start’ en CSS.
      ‘MAX’ en Figma puede corresponder a ‘flex-end’ o ‘end’ en CSS.
      ‘CENTER’ en Figma puede corresponder a ‘center’ en CSS.
      ‘SPACE_BETWEEN’ en Figma puede corresponder a ‘space-between’ en CSS
 */
export const getPrimaryAxisAlignItems = (node) => {
  if (node.inferredAutoLayout.primaryAxisAlignItems === "MIN") {
    return "flex-start";
  }
  if (node.inferredAutoLayout.primaryAxisAlignItems === "MAX") {
    return "flex-end";
  }
  if (node.inferredAutoLayout.primaryAxisAlignItems === "CENTER") {
    return "center";
  }
  if (node.inferredAutoLayout.primaryAxisAlignItems === "SPACE_BETWEEN") {
    return "space-between";
  }
  return null;
};

/**
 * 
 * @param node 
 *@returns counterAxisAlignItems --> align-items
  *   ‘MIN’ en Figma puede corresponder a ‘flex-start’ o ‘start’ en CSS.
      ‘MAX’ en Figma puede corresponder a ‘flex-end’ o ‘end’ en CSS.
      ‘CENTER’ en Figma puede corresponder a ‘center’ en CSS.
      ‘BASELINE’ en Figma puede corresponder a ‘baseline’ en CSS.
 */
export const getCounterAxisAlignItems = (node) => {
  if (node.inferredAutoLayout.counterAxisAlignItems === "MIN") {
    return "flex-start";
  }
  if (node.inferredAutoLayout.counterAxisAlignItems === "MAX") {
    return "flex-end";
  }
  if (node.inferredAutoLayout.counterAxisAlignItems === "CENTER") {
    return "center";
  }
  if (node.inferredAutoLayout.counterAxisAlignItems === "BASELINE") {
    return "baseline";
  }
  return null;
};

/**
 * COLOR
 * @param node 
 * @returns color | null
 */ 
export const getBackgroundColor = (node) => {
   if (node.type !== 'TEXT' &&  node.type === "RECTANGLE" || node.type === "FRAME" || node.type === 'INSTANCE' || node.type === 'COMPONENT' || node.type === 'GROUP' && node.fills.length > 0) {
     const fill = node.fills[0];
     if(fill.visible === false) return null
     if (fill && fill.type === 'SOLID') {
       const { r, g, b } = fill.color;
       const { opacity } = fill;
       const cssColor = {
         r: (r * 255).toString(),
         g: (g * 255).toString(),
         b: (b * 255).toString()
       };   
    return `rgba(${cssColor.r}, ${cssColor.g}, ${cssColor.b}, ${opacity})`;
    }
  }
  return "transparent";
}
 
export const buildFilterImage = (node) => { 
  if ( node.fills[0].visible === true) {
    const data = node.fills[0].filters
    function rotate(dato) {
       if(dato.tint === 0) return 0 
       if(dato.tint !== 0) return dato.tint * 100
    }
    // return `brightness(${data.exposure + 1}) contrast(${data.contrast + 1}) saturate(${data.saturation + 1}) sepia(${data.temperature <= 0 ? 0 : data.temperature + 1}) hue-rotate(${rotate(data)}deg)`
    return {
        brightness: data.exposure || 1,
        contrast: data?.contrast || 1,
        opacity: node.fills[0].opacity * 100 || 100,
        saturate: data?.saturation || 1,
        sepia: data?.temperature || 0,
        tint: rotate(data) || 0,
      }
  }
  return null;
}

export const getTextColor = (node) => {
  if (node.type === 'TEXT' || node.type === "VECTOR" || node.type === "STAR" || node.type === "ELLIPSE" || node.type === "POLYGON" || node.type === "LINE" && node.fills.length > 0) {
    const textFill = node.fills[0];
    if (textFill.type === 'SOLID' && textFill.color) {
      const { r, g, b } = textFill.color;
       const { opacity } = textFill;
       const cssColor = {
         r: (r * 255).toString(),
         g: (g * 255).toString(),
         b: (b * 255).toString()
       };   
    return `rgba(${cssColor.r}, ${cssColor.g}, ${cssColor.b}, ${opacity})`;
    }
  }
  return "transparent";
}

export async function getImages(node) {
  if (node.fills && node.fills.length > 0) {
    const image = await Promise.all( node.fills.map(async (fill) => {
        if (fill.visible === false) return null
        if (fill.type === "IMAGE") {
          const imageConvert = figma.getImageByHash(fill.imageHash);
          const imageEncode = await imageConvert.getBytesAsync();
          const imgArray = Object.values(imageEncode);
          return {
            image: imgArray,
            src: ""
          };
        }
        return null;
      }))
    const resp = image.filter(img => img !== null)
 
    return resp[0]
  } 
  return null;
}

export const buildWebkitText = (node) => { 
  if (node.type === "TEXT" && node.fills[0] && node.fills[0].type === "GRADIENT_LINEAR") {
    return "transparent"    
  }
  return null
}

const rgbToHex= (int) => {
  let hex = Number(Math.round(255 * int)).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

const makeHex = (r, g, b) => {
  let red = rgbToHex(r);
  let green = rgbToHex(g);
  let blue = rgbToHex(b);
  return '#' + red + green + blue;
}

const rgbaToHex = (r, g, b, a) => {
  let red = rgbToHex(r);
  let green = rgbToHex(g);
  let blue = rgbToHex(b);
  let alpha = rgbToHex(Math.floor(a * 255));
  return '#' + red + green + blue + alpha;
}

const getTx = (deg) => {
  if (deg >= 120) {
    if (deg >= 180) {
      return 1;
    }
    return 0.5;
  }
  return 0;
}
/**
 *"fills": [
              {
                "type": "SOLID",
                "visible": true,
                "opacity": 0.550000011920929,
                "blendMode": "NORMAL",
                "color": {
                  "r": 0.0016667683375999331,
                  "g": 0.16140009462833405,
                  "b": 1
                },
                "boundVariables": {}
                },
                {
                "type": "GRADIENT_DIAMOND" <-----
                "type": "GRADIENT_ANGULAR", <-----
                "type": "GRADIENT_RADIAL" <-----
                "type": "GRADIENT_LINEAR", <-----
                "visible": true,
                "opacity": 0.44999998807907104,
                "blendMode": "NORMAL",
                "gradientStops": [
                {
                  "color": {
                      "r": 1,
                      "g": 0.8399999141693115,
                      "b": 0,
                      "a": 1
                    },
                    "position": 0
                    },
                    {
                    "color": {
                      "r": 1,
                      "g": 0.8399999141693115,
                      "b": 0,
                      "a": 0
                    },
                    "position": 0.440624862909317
                  }
                ],
                "gradientTransform": [
                  [
                    4.148489972361337e-15,
                    1.3055555820465088,
                    -0.3055555522441864
                  ],
                  [
                    -1.3055555820465088,
                    2.691769856513884e-16,
                    1.1527777910232544
                  ]
                ]
              }
            ], 
 */
const figmaTransformToCSSAngle = (figmaTransform) => {
    // Extraer los valores de la matriz de transformación
    let a = figmaTransform[0][0];
    let b = figmaTransform[0][1];   

    // Convertir el ángulo a grados
  let angleInDegrees = Math.round(Math.atan2(b, a) * (180 / Math.PI));
   angleInDegrees = angleInDegrees + 89

    // Asegurarse de que el ángulo esté entre 0 y 360 grados
   return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
}

const transformToCSSAngle = (figmaTransform) => {
    // Extraer los valores de la matriz de transformación
    let a = figmaTransform[0][0];
    let b = figmaTransform[0][1];   

    // Convertir el ángulo a grados
  let angleInDegrees = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    // Asegurarse de que el ángulo esté entre 0 y 360 grados
   return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
}

const getDegrade= (matrix) => {
  let degrees = transformToCSSAngle(matrix) || 0; 
  return `${degrees}deg`;
}

const getDegreesForMatrix = (matrix) => {
  let degrees = figmaTransformToCSSAngle(matrix) || 0; 
  return `${degrees}deg`;
}

export const convertBorderGradient = (node) => {
    if (node.fills[0].visible === false) return null
    const paint = node.fills.find(item => item.type === 'GRADIENT_LINEAR' || item.type === 'GRADIENT_ANGULAR' || item.type === 'GRADIENT_RADIAL' || item.type === 'GRADIENT_DIAMOND');
    if (!paint || paint === "undefined") return null
  
    const { gradientTransform, gradientStops } = paint;
    const gradientStopsString = gradientStops
      .map((stop) => {
        return `#${rgbToHex(stop.color.r)}${rgbToHex(stop.color.g)}${rgbToHex(stop.color.b)} ${Math.round(stop.position * 100 * 100) / 100}%`
      })
      .join(', ');
    const gradientTransformString = getDegreesForMatrix(gradientTransform);    
    if (paint.type === "GRADIENT_LINEAR") {
      return `linear-gradient(${gradientTransformString}, ${gradientStopsString}) 1`
    } else if (paint.type === 'GRADIENT_RADIAL') {
      return `radial-gradient(${gradientStopsString}) 1`
    } else if (paint.type === 'GRADIENT_ANGULAR') {
      return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString}) 1`
    } else if (paint.type === 'GRADIENT_DIAMOND') {
      return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString}) 1`// OJO ESTE
    }  
}
/*
gradients:
[
  {
    grade: 0,
    color: '#ffffff',
    percentage: 0,
    active: true
  },
  {
    grade: 0,
    color: '#ffffff',
    percentage: 0,
    active: true
  }
] 
 */
/**
 "fills": [
            {
              "type": "GRADIENT_LINEAR",
              "visible": true,
              "opacity": 1,
              "blendMode": "NORMAL",
              "gradientStops": [
                {
                  "color": {
                    "r": 0.0625,
                    "g": 0.15625,
                    "b": 1,
                    "a": 1
                  },
                  "position": 0
                },
                {
                  "color": {
                    "r": 0.0625,
                    "g": 0.15625,
                    "b": 1,
                    "a": 0
                  },
                  "position": 1
                }
              ],
              "gradientTransform": [
                [
                  6.123234262925839e-17,
                  1,
                  0
                ],
                [
                  -1,
                  6.123234262925839e-17,
                  1
                ]
              ]
            }
          ],
 */
export const convertFigmaGradientToString = (node) => {
    if (node.fills[0].visible === false) return null
    const paint = node.fills.find(item => item.type === 'GRADIENT_LINEAR' || item.type === 'GRADIENT_ANGULAR' || item.type === 'GRADIENT_RADIAL' || item.type === 'GRADIENT_DIAMOND');
    if (!paint || paint === undefined) return null
  
    const { gradientTransform, gradientStops } = paint;
    const gradientStopsString = gradientStops
      .map((stop) => {
        return `#${rgbToHex(stop.color.r)}${rgbToHex(stop.color.g)}${rgbToHex(stop.color.b)} ${Math.round(stop.position * 100 * 100) / 100}%`
      })
      .join(', ');
    const gradientTransformString = getDegreesForMatrix(gradientTransform);
  const gradientTransformCss = getDegrade(gradientTransform);
  const grade = figmaTransformToCSSAngle(gradientTransform)
  
    if (node.type === "TEXT" && paint.type === "GRADIENT_LINEAR") {
      return `-webkit-linear-gradient(${gradientTransformCss}, ${gradientStopsString})`
    }
    if (paint.type === "GRADIENT_LINEAR") {
      const gradients = gradientStops.map(stop => {
        const cssColor = (r, g, b, a) => {
          return `rgba(${(r * 255).toString()}, ${(g * 255).toString()}, ${(b * 255).toString()}, ${a})`           
        }; 
        const colors = cssColor(stop.color.r, stop.color.g, stop.color.b, stop.color.a)
        const hexaColor = rgbaToHex(stop.color.r, stop.color.g, stop.color.b, stop.color.a)
        return {
          grade: grade,
          color: colors,
          percentage: Math.round(stop.position * 100 * 100) / 100,
          active: true
        };
      });
      return gradients;
    } else if (paint.type === 'GRADIENT_RADIAL') {
      return `radial-gradient(${gradientStopsString})`
    } else if (paint.type === 'GRADIENT_ANGULAR') {
      return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString})`
    } else if (paint.type === 'GRADIENT_DIAMOND') {
      return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString})`// OJO ESTE
    }  
}
// export const convertFigmaGradientToString = (node) => {
//     if (node.fills[0].visible === false) return null
//     const paint = node.fills.find(item => item.type === 'GRADIENT_LINEAR' || item.type === 'GRADIENT_ANGULAR' || item.type === 'GRADIENT_RADIAL' || item.type === 'GRADIENT_DIAMOND');
//     if (!paint || paint === undefined) return null
  
//     const { gradientTransform, gradientStops } = paint;
//     const gradientStopsString = gradientStops
//       .map((stop) => {
//         return `#${rgbToHex(stop.color.r)}${rgbToHex(stop.color.g)}${rgbToHex(stop.color.b)} ${Math.round(stop.position * 100 * 100) / 100}%`
//       })
//       .join(', ');
//     const gradientTransformString = getDegreesForMatrix(gradientTransform);
//     const gradientTransformCss = getDegrade(gradientTransform);
  
//     if (node.type === "TEXT" && paint.type === "GRADIENT_LINEAR") {
//       return `-webkit-linear-gradient(${gradientTransformCss}, ${gradientStopsString})`
//     }
//     if (paint.type === "GRADIENT_LINEAR") {
//       return `linear-gradient(${gradientTransformString}, ${gradientStopsString})`
//     } else if (paint.type === 'GRADIENT_RADIAL') {
//       return `radial-gradient(${gradientStopsString})`
//     } else if (paint.type === 'GRADIENT_ANGULAR') {
//       return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString})`
//     } else if (paint.type === 'GRADIENT_DIAMOND') {
//       return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString})`// OJO ESTE
//     }  
// }

/**
 * 
 * @param node 
 *"strokes": [
                    {
                      "type": "GRADIENT_LINEAR",
                      "visible": true,
                      "opacity": 1,
                      "blendMode": "NORMAL",
                      "gradientStops": [
                        {
                          "color": {
                            "r": 1,
                            "g": 0.6823529601097107,
                            "b": 0,
                            "a": 1
                          },
                          "position": 0.20208294689655304
                        },
                        {
                          "color": {
                            "r": 0.14000000059604645,
                            "g": 1,
                            "b": 0,
                            "a": 0.9800000190734863
                          },
                          "position": 0.644791305065155
                        },
                        {
                          "color": {
                            "r": 0,
                            "g": 0.3400000035762787,
                            "b": 1,
                            "a": 0.9800000190734863
                          },
                          "position": 0.9781246185302734
                        }
                      ],
                      "gradientTransform": [
                        [
                          -0.0038815049920231104,
                          1.3507132530212402,
                          0.0019407524960115552
                        ],
                        [
                          -1.3507132530212402,
                          -0.003949007950723171,
                          1.1753566265106201
                        ]
                      ]
                    }
                  ],
 */
export const buildGradientStroke = (node) => {
  const arrStroke = []

  if (node.strokes[0].type === "GRADIENT_LINEAR" ) {
    node.strokes[0].gradientStops.forEach((strokes) => {
      const gradientColor = `#${rgbToHex(strokes.color.r)}${rgbToHex(strokes.color.g)}${rgbToHex(strokes.color.b)}`
      const stroke = {
        color: gradientColor,
        stopOpacity: parseFloat((strokes.color.a).toFixed(2)),
        offset: `${Math.round(strokes.position * 100 * 100) / 100}%`
      }
      arrStroke.push(stroke)   
    })
    
    const degs = transformToCSSAngle(node.strokes[0].gradientTransform)
    
    return { data:arrStroke, deg: degs, type:node.strokes[0].type}
  }
  return null  
}

export const buildGradientFills = (node) => {
  const arrFill = []

  if (node.fills[0].visible === false) return null
  if (node.type !== "VECTOR" || node.type === 'ELLIPSE' || node.type === 'STAR' || node.type === "POLYGON") return null
  if (node.fills[0].type === "GRADIENT_LINEAR" || "GRADIENT_RADIAL" || "GRADIENT_ANGULAR" || "GRADIENT_DIAMOND") {
    node.fills[0].gradientStops.forEach((fills) => {
      const gradientColor = `#${rgbToHex(fills.color.r)}${rgbToHex(fills.color.g)}${rgbToHex(fills.color.b)}`
      const fill = {
        color: gradientColor,
        stopOpacity: parseFloat((fills.color.a).toFixed(2)),
        offset: `${(Math.round(fills.position * 100 * 100) / 100) + 10}%`
      }
      arrFill.push(fill)
    })
    const degs = transformToCSSAngle(node.fills[0].gradientTransform)
      
    return { data: arrFill, deg: degs, type: node.fills[0].type }
  }
  
  return null
}


/**
 * STYLES TEXT
 * @param style
 * @returns Number
*/
export const buildFontStyle = (style) => {
  if (style.includes("Italic")) return "italic";
  else return null;
}

export const buildLetterspacing = (letterSpacing, fontSize) => {
  if (letterSpacing.unit === 'PERCENT') return (letterSpacing.value / 100) * fontSize
  if (letterSpacing.unit === 'PIXELS') return letterSpacing.value  
}

export const buildLineheight = (lineHeight, fontSize) => {
  if (lineHeight.unit === 'PERCENT') return (lineHeight.value / 100) * fontSize
  if (lineHeight.unit === 'PIXELS') return lineHeight.value
}

// export const buildLetterspacing = (letterSpacing) => {
//   if (letterSpacing.unit === 'PERCENT') return `${letterSpacing.value / 100}em`
//   if (letterSpacing.unit === 'PIXELS') return `${letterSpacing.value}px`  
// }

// export const buildLineheight = (lineHeight) => {
//   if (lineHeight.unit === 'PERCENT') return `${lineHeight.value / 100}em`
//   if (lineHeight.unit === 'PIXELS') return `${lineHeight.value}px`
// }

export const buildTextalign = (textAlign) => {
  if (textAlign === 'LEFT') return 'start'
  if (textAlign === 'CENTER') return 'center'
  if (textAlign === 'RIGHT') return 'end'
  if (textAlign === 'JUSTIFIED') return 'justify'

}

export const buildVerticalalign = (verticalAlign) => {
  if (verticalAlign === 'TOP') return 'top'
  if (verticalAlign === 'CENTER') return 'middle'
  if (verticalAlign === 'BOTTOM') return 'bottom'
}

export const buildTextdecoration = (textDecoration) => {
  if (textDecoration === 'UNDERLINE') return 'underline'
  if (textDecoration === 'STRIKETHROUGH') return 'line-through'
  if (textDecoration === 'NONE') return 'none'
}

export const buildTextcase = (textCase) => {
  if (textCase === 'ORIGINAL') return 'none'
  if (textCase === 'UPPER') return 'uppercase'
  if (textCase === 'LOWER') return 'lowercase'
  if (textCase === 'TITLE') return 'capitalize'
}
/*
effects: 
[
blendMode: "NORMAL"
boundVariables: {}
color: {r: 0, g: 0, b: 0, a: 0.5}
offset: {x: 0, y: 10}
radius: 20
showShadowBehindNode: false
spread: 0
type: "DROP_SHADOW"
visible: true
] 
*/
/**
   * EFFECTS: 
   * Shadows
   * offset-x | offset-y | blur-radius | spread-radius | color
   * box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); <-- DROP_SHADOW
   * box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset; <-- INNER_SHADOW
   * filter: blur(2px); <-- LAYER_BLUR
   * backdrop-filter: blur(2px); <-- BACKGROUND_BLUR
  */ 
export const buildEffects = (node) => {
  if (node.effects[0].visible === false) return null
  const effects = node.effects[0]
  // const hexaColor = makeHex(effects.color.r, effects.color.g, effects.color.b)
  if (!node.effects[0] || Object.keys(node.effects[0]).length === 0 || !effects.type) return null
      
    if (effects.type === 'DROP_SHADOW') {
      // return `${offset.x}px ${offset.y}px ${radius}px ${spread}px rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
      return [{
        ejeX: effects.offset.x,
        ejeY: effects.offset.y,
        blur: effects.radius,
        opacity: effects.color.a * 100,
        color: effects.hexaColor,
        inset: false
    }]
  }
  if (effects.type === 'INNER_SHADOW') {
    // return `${effects.offset.x}px ${effects.offset.y}px ${effects.radius}px ${effects.spread}px rgba(${effects.color.r}, ${effects.color.g}, ${effects.color.b}, ${effects.color.a}) inset` 
    return [{
        ejeX: effects.offset.x,
        ejeY: effects.offset.y,
        blur: effects.radius,
        opacity: effects.color.a * 100,
        color: effects.hexaColor,
        inset: true
    }]
  }
  if (effects.type === 'LAYER_BLUR') {
    // return `blur(${effects.radius / 2}px)`
    return {
        blur: effects.radius / 2
      }
    
  }
  if (effects.type === 'BACKGROUND_BLUR') {
    // return `blur(${effects.radius/2}px)`
    return effects.radius / 2
  }
}

/**
 * Border
 * border: 1px solid #000;
 */  
export const buildStrokes = (node) => {
  if (node.strokes[0].visible === false) return null  
  const { type, color, opacity } = node.strokes[0]
  if(!type) return null
  const colors = makeHex(color.r, color.g, color.b) 
  if (type === 'SOLID') {
    return colors
  }
}

export const buildStrokesBorderGradient = (node) => {
  if (node.strokes[0].visible === false) return null    
  if (node.strokes[0].type) {    
    const { gradientTransform, gradientStops } = node.strokes[0];
    const gradientStopsString = gradientStops
    .map((stop) => {
      return `#${rgbToHex(stop.color.r)}${rgbToHex(stop.color.g)}${rgbToHex(stop.color.b)} ${Math.round(stop.position * 100 * 100) / 100}%`
    })
    .join(', ');
    const gradientTransformString = getDegreesForMatrix(gradientTransform);    
    if (node.strokes[0].type) {
      const data = {
          content: "",
          position: 'absolute',
          inset: '0',
          borderRadius: `${node.topLeftRadius ? node.topLeftRadius : 0}px ${node.topRightRadius ? node.topRightRadius : 0}px ${node.bottomRightRadius ? node.bottomRightRadius : 0}px ${node.bottomLeftRadius ? node.bottomLeftRadius : 0}px`, 
          padding: `${node.strokeWeight}px ${node.strokeWeight}px ${node.strokeWeight}px ${node.strokeWeight}px`, 
          background:`linear-gradient(${gradientTransformString}, ${gradientStopsString})`, 
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          markComposite: 'exclude',
        }        
    return data
  } 
} return null
}


// background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23268600' stroke-width='4' stroke-dasharray='50%2c 50' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

export const buildStrokestop = (node) => {
  if (node.strokes[0].visible === false) return null  
  const { type, color, opacity } = node.strokes[0]
  if(!type) return null
  const colors = makeHex(color.r, color.g, color.b) 
  if (node.dashPattern.length > 0) {
    return `${node.strokeTopWeight}px dashed ${colors}`
  }
  if (type === 'SOLID') {
    return `${node.strokeTopWeight}px solid ${colors}`
  }
}

export const buildStrokesbottom = (node) => {
  if (node.strokes[0].visible === false) return null  
  const { type, color, opacity } = node.strokes[0]
  if(!type) return null
  const colors = makeHex(color.r, color.g, color.b) 
  if (node.dashPattern.length > 0) {
    return `${node.strokeTopWeight}px dashed ${colors}`
  }
  if (type === 'SOLID') {
    return `${node.strokeBottomWeight}px solid ${colors}`
  }
}

export const buildStrokesleft = (node) => {
  if (node.strokes[0].visible === false) return null  
  const { type, color, opacity } = node.strokes[0]
  if(!type) return null
  const colors = makeHex(color.r, color.g, color.b) 
  if (node.dashPattern.length > 0) {
    return `${node.strokeTopWeight}px dashed ${colors}`
  }
  if (type === 'SOLID') {
    return `${node.strokeLeftWeight}px solid ${colors}`
  }
}

export const buildStrokesright = (node) => {
  if (node.strokes[0].visible === false) return null
  const { type, color, opacity } = node.strokes[0]
  if(!type) return null
  const colors = makeHex(color.r, color.g, color.b) 
  if (node.dashPattern.length > 0) {
    return `${node.strokeTopWeight}px dashed ${colors}`
  }
  if (type === 'SOLID') {
    return `${node.strokeRightWeight}px solid ${colors}`
  }
}

/**
 * maskType --> mask-type
 * ‘ALPHA’: En Figma, una máscara ‘ALPHA’ se aplica en función de la opacidad de la máscara. Cuanto mayor sea   la opacidad, más se revelará1. En CSS, puedes lograr un comportamiento similar utilizando una imagen con canales alfa como valor para mask-image.
 * ‘VECTOR’: En Figma, una máscara ‘VECTOR’ utiliza los contornos de las formas como máscaras, ignorando la translucidez o el valor de opacidad de más del cero por ciento de un relleno o trazo de máscara1. En CSS, puedes lograr un comportamiento similar utilizando una imagen en blanco y negro como valor para mask-image, donde el blanco revela el contenido y el negro lo oculta
*/
export const getMaskType  = (node) => {
  if (node.primaryAxisAlignItems === "ALPHA") {
    return "alpha";
  }
  if (node.primaryAxisAlignItems === "LUMINANCE") {
    return "luminance";
  }
  if (node.primaryAxisAlignItems === "VECTOR") { // A REVISAR
    return "luminance";
  }
  return null;
};

/**
 * fillGeometry --> clip-path
 * "fillGeometry": [
                {
                  "windingRule": "NONZERO",
                  "data": "M0 0L119 0L119 92L0 92L0 0Z"
                }
              ],
 * Ejemplo clip-path: path('M 0 200 L 0,75 A 5,5 0,0,1 150,75 L 200 200 z');
*/
export const getfillGeometry = (node) => {
  // node.type === "LINE" --> strokeGeometry
  // node.type === "VECTOR" --> vectorPaths
  if (node.isMask && node.isMask === true) {
    return `path("${node.fillGeometry[0].data}")`
  }
  if (node.type === "ELLIPSE" || node.type === "POLYGON" || node.type === "STAR" && node.fillGeometry.length > 0) return node.fillGeometry[0].data
  if (node.type === "VECTOR" && node.vectorPaths.length > 0) return node.vectorPaths[0].data
  if (node.type === "LINE" && node.strokeGeometry[0].length > 0) return node.strokeGeometry[0].data; 
  return null;
};

/**
 * strokeCap --> stroke-linecap
 * ‘ROUND’ en Figma puede corresponder a ‘round’ en CSS.
    ‘SQUARE’ en Figma puede corresponder a ‘square’ en CSS.
    ‘NONE’ o ‘FLAT’ en Figma puede corresponder a ‘butt’ en CSS.
 */
export const getStrokeCap  = (node) => {
  if (node.primaryAxisAlignItems === "ROUND") {
    return "round";
  }
  if (node.primaryAxisAlignItems === "SQUARE") {
    return "square";
  }
  if (node.primaryAxisAlignItems === "FLAT") {
    return "butt";
  }
  if (node.primaryAxisAlignItems === "NONE") {
    return null;
  }
  return null;
};


/**
 * strokeJoin --> stroke-linejoin
 * ‘MITER’ (unión en ángulo) en Figma puede corresponder a ‘miter’ en CSS.
   ‘BEVEL’ (unión biselada) en Figma puede corresponder a ‘bevel’ en CSS.
   ‘ROUND’ (unión redondeada) en Figma puede corresponder a ‘round’ en CSS.
 */
export const getStrokeJoin  = (node) => {
  if (node.primaryAxisAlignItems === "MITER") {
    return "miter";
  }
  if (node.primaryAxisAlignItems === "BEVEL") {
    return "bevel";
  }
  if (node.primaryAxisAlignItems === "ROUND") {
    return "round";
  }
  return null;
};
