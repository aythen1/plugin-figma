/**
 * Positions
*/
export const getAbsolutePositionRelativeToArtboard = (node) => {
  if (
    typeof node.x !== "number" ||
    !node.parent ||
    ["PAGE", "DOCUMENT"].includes(node.type)
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
      position.x += parent.x;
      position.y += parent.y;
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
  if (!node.layoutGrids) return "flex"
  if (node.layoutGrids && node.layoutGrids[0].length > 0) return "grid"
}

// export const getVisibility = (node) => {
//   if (node.parent && node.parent.visible === false) {
//     return "hidden"    
//   }
//   if (node.visible === false) {
//     node.isShow = false;
//     return "hidden"
//   }
//   return "visible"
// }

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

export const changeVisibility = (node) => {
  // Si el nodo no es visible, establece todos sus hijos como no visibles y 'isShow' en false
  if (node.Property?.style?.desktop?.attribute?.visible === false && node.hasChildren) {
    node.isShow = false;
    node.children.forEach(child => {
      child.Property.style.desktop.attribute.visible = false;
      child.isShow = false;
      changeVisibility(child);
    });
  } else if (node.hasChildren) {
    // Si el nodo es visible, recorre sus hijos
    node.children.forEach(changeVisibility);
  }
}

// export const changeVisibility = (node) => {
//   if (node.Property?.style?.desktop?.attribute?.visible === false || null) {
//     node.isShow = false;
//     node.Property.style.desktop.attribute.visible = "hidden"
//     if (Array.isArray(node.children)) {
//       node.children.forEach(child => {
//         child.isShow = false;
//         changeVisibility(child);
//       });
//     }
//   } else {
//     if (Array.isArray(node.children)) {
//       node.children.forEach(changeVisibility);
//     }
//   }
// }


/**
  * LAYOUT
  * @param node 
  * @returns layoutMode --> flexDirection 
*/
export const getLayoutMode = (node) => {
  // Simple single layer group wrapping we can ignore
  if (isGroupNode(node) && node.children?.length === 1) {
    return "column";
  }
  if ((node).layoutMode === "VERTICAL") {
    return "column";
  }
  if ((node).layoutMode === "HORIZONTAL") {
    return "row";
  }
  return null;
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
  if (node.primaryAxisAlignItems === "MIN") {
    return "flex-start";
  }
  if (node.primaryAxisAlignItems === "MAX") {
    return "flex-end";
  }
  if (node.primaryAxisAlignItems === "CENTER") {
    return "center";
  }
  if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
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
  if (node.primaryAxisAlignItems === "MIN") {
    return "flex-start";
  }
  if (node.primaryAxisAlignItems === "MAX") {
    return "flex-end";
  }
  if (node.primaryAxisAlignItems === "CENTER") {
    return "center";
  }
  if (node.primaryAxisAlignItems === "BASELINE") {
    return "baseline";
  }
  return null;
};

/**
 * COLOR
 * @param obj 
 * @returns rgb( 0 0 255 )
 */
 export const transformBackground = (obj) => {
  const newObj = Object.values(obj)
  
  let rgb = 'rgb('
  newObj.forEach((o:number) => {
    rgb = rgb + (o * 255).toString() + ' '
  })  
  rgb = rgb +')'
  return rgb
}
/**
 * COLOR
 * @param node 
 * @returns color | null
 */ 
export const getBackgroundColor = (node) => {
   if (node.type !== 'TEXT' && node.type === "RECTANGLE" || node.type === "FRAME" && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill && fill.type === 'SOLID') {        
      return transformBackground(fill.color)
    }
  }
  return "transparent";
}
  
export const getTextColor = (node) => {
  if (node.type === 'TEXT' || node.type === "VECTOR" || node.type === "STAR" || node.type === "ELLIPSE" && node.fills.length > 0) {
    const textFill = node.fills[0];
    if (textFill.type === 'SOLID' && textFill.color) {
      return transformBackground(textFill.color);
    }
  }
  return "transparent";
}

export async function getImages(node) {
  if (node.fills && node.fills.length > 0) {
  const image = node.fills[0]
  if (image.type === "IMAGE") {
      const imageConvert = figma.getImageByHash(image.imageHash)
      const imageEncode = await imageConvert.getBytesAsync()
      const imgArray = Object.values(imageEncode)
    return {
      image: imgArray,
      src: ""
    }
    } 
  } 
  return null;
}


const rgbToHex= (int) => {
  var hex = Number(Math.round(255 * int)).toString(16);
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

    // Calcular el ángulo en radianes
    let angleInRadians = Math.atan2(b, a);

    // Convertir el ángulo a grados
    let angleInDegrees = Math.round(angleInRadians * (180 / Math.PI));

    // Asegurarse de que el ángulo esté entre 0 y 360 grados
    if (angleInDegrees < 0) {
        angleInDegrees += 360;
    }

    return angleInDegrees;
}

const convertToDegrees = (matrix) => {
  const a = matrix[0][0];
  const b = matrix[1][1];
  const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  return angle < 0 ? angle + 360 : angle;
}

const getDegreesForMatrix = (matrix) => {
  const degrees = figmaTransformToCSSAngle(matrix) || 0;
  return `${degrees}deg`;
}

export const convertFigmaGradientToString = (node) => {
 const paint = node.fills.find(item => item.type === 'GRADIENT_LINEAR' || item.type === 'GRADIENT_ANGULAR' || item.type === 'GRADIENT_RADIAL' || item.type === 'GRADIENT_DIAMOND' );
  if(!paint || paint === "undefined") return null
  
  const { gradientTransform, gradientStops } = paint;
  const gradientStopsString = gradientStops
    .map((stop) => {
      return `#${rgbToHex(stop.color.r)}${rgbToHex(stop.color.g)}${rgbToHex(stop.color.b)} ${Math.round(stop.position * 100 * 100) / 100}%`
    })
    .join(', ');
  const gradientTransformString = getDegreesForMatrix(gradientTransform);
  if (paint.type === "GRADIENT_LINEAR") {
    return `linear-gradient(${gradientTransformString}, ${gradientStopsString})` 
  } else if (paint.type === 'GRADIENT_RADIAL') {
    return `radial-gradient(${gradientStopsString})`
  } else if (paint.type === 'GRADIENT_ANGULAR') {
    return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString})`

  } else if (paint.type === 'GRADIENT_DIAMOND') {
    return `conic-gradient(from ${gradientTransformString}, ${gradientStopsString})`// OJO ESTE
  }
}

/**
 * STYLES TEXT
 * @param style
 * @returns Number
*/
export const buildFontStyle = (style) => {
  if (style === 'Thin') return 100
  else if (style === 'ExtraLight') return 200
  else if (style === 'Light') return 300
  else if (style === 'Regular') return 400
  else if (style === 'Medium') return 500
  else if (style === 'SemiBold') return 600
  else if (style === 'Bold') return 700
  else if (style === 'ExtraBold') return 800
  else if (style === 'Black') return 900
  else return style
}

export const buildLetterspacing = (letterSpacing) => {
  if (letterSpacing.unit === 'PERCENT') return `${letterSpacing.value / 100}em`
  if (letterSpacing.unit === 'PIXELS') return `${letterSpacing.value}px`  
}

export const buildLineheight = (lineHeight) => {
  if (lineHeight.unit === 'PERCENT') return `${lineHeight.value / 100}em`
  if (lineHeight.unit === 'PIXELS') return `${lineHeight.value}px`  
}

export const buildTextalign = (textAlign) => {
  if (textAlign === 'LEFT') return 'start'
  if (textAlign === 'CENTER') return 'center'
  if (textAlign === 'RIGHT') return 'end'
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
  
/**
   * EFFECTS: 
   * Shadows
   * offset-x | offset-y | blur-radius | spread-radius | color
   * box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); <-- DROP_SHADOW
   * box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset; <-- INNER_SHADOW
   * filter: blur(2px); <-- LAYER_BLUR
   * backdrop-filter: blur(2px); <-- BACKGROUND_BLUR
  */ 
export const buildEffects = (effects) => {
  const { type, offset, radius, spread, color } = effects
  if(!effects || Object.keys(effects).length == 0 || !type) return null
  if (type === 'DROP_SHADOW') {
    return `${offset.x}px ${offset.y}px ${radius}px ${spread}px rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`    
  }
  if (type === 'INNER_SHADOW') {
    return `${offset.x}px ${offset.y}px ${radius}px ${spread}px rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}) inset`    
  }
  if (type === 'LAYER_BLUR') {
    return `blur(${radius/2}px)`   
  }
  if (type === 'BACKGROUND_BLUR') {
    return `blur(${radius/2}px)`   
  }
}


/**
 * Border
 * border: 1px solid #000;
 */  
export const buildStrokes = (strokeWeight, strokes ) => {
  const { type, color, opacity } = strokes
  const colors = makeHex(color.r, color.g, color.b) 
  if(!type) return null
  if (type === 'SOLID') {
    return `${strokeWeight}px solid ${colors}`    
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
  if ( node.type === "ELLIPSE" && node.fillGeometry[0].length > 0) {
    return node.fillGeometry[0].data;
  } 
  // if (node.type !== "VECTOR" && node.type == "RECTANGLE" && node.fillGeometry.length > 0) {
  //   return `${node.fillGeometry.data}`;
  // }
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
