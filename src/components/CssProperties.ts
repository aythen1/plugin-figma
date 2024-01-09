import {
  getBackgroundColor,
  getTextColor,
  buildStrokes,
  buildFontStyle,
  buildEffects,
  getLayoutMode,
  getPrimaryAxisAlignItems,
  getCounterAxisAlignItems,
  getStrokeCap,
  getStrokeJoin,
  getMaskType,
  convertFigmaGradientToString,
  buildWebkitText,
  buildLetterspacing,
  buildTextalign,
  buildTextcase,
  buildVerticalalign,
  buildTextdecoration,
  buildLineheight,
  getfillGeometry,
  getDisplay,
  buildStrokesleft,
  buildStrokesbottom,
  buildStrokesright,
  buildStrokestop,
  convertBorderGradient,
  buildStrokesBorderGradient,
  buildGradientStroke,
  getImages,
  buildGradientFills,
} from './PropertiesHandlers';

const specialProperties = {
  parent: () => ({
    zIndex: 0
  }),
  layoutGrids: (node) => ({
    display: getDisplay(node)
  }),
  layoutMode: (node) => ({
    flexDirection: node.layoutMode ? getLayoutMode(node) : null
  }),
  primaryAxisAlignItems: (node) => ({
    justifyContent: node. primaryAxisAlignItems ? getPrimaryAxisAlignItems(node) : null
  }),
  counterAxisAlignItems: (node) => ({
    alignItems: node.counterAxisAlignItems ? getCounterAxisAlignItems(node) : null
  }),
  layoutWrap: (node) => ({
    flexWrap: node.flexWrap ? node.flexWrap.toLowerCase() : null
  }),
  layoutGrow: (node) => ({
    flexGrow: node.layoutGrow? node.layoutGrow : null
  }),
  itemSpacing: (node) => ({
    gap: node.itemSpacing? `${node.itemSpacing}px` : null
  }),
  fills: (node) => ({
    background: !node.fills || Object.keys(node.fills).length == 0 ? null : node.fills[0] ? convertFigmaGradientToString(node) : null,
    color: !node.fills || Object.keys(node.fills).length == 0 ? null : node.fills[0] ? getTextColor(node) : null,
    backgroundColor: !node.fills || Object.keys(node.fills).length == 0 ? null : node.fills[0] ? getBackgroundColor(node) : null,
    "-webkitBackgroundClip": node.type === "TEXT" ? "text" : null,
    "-webkitTextFillColor": buildWebkitText(node),
    borderImage: !node.fills || Object.keys(node.fills).length == 0 ? null : node.fills[0] ? convertBorderGradient(node) : null,
  }),
  // removed: async (node) => ({
  //   backgroundImage: !node.fills || Object.keys(node.fills).length == 0 ? null : node.fills[0] ? await getImages(node) : null,
  // }),
  blendMode: (node) => ({
    gradientStroke: !node.strokes || Object.keys(node.strokes).length == 0 ? null: buildGradientStroke(node)
  }),
  type: (node) => ({
    gradientFill: !node.strokes || Object.keys(node.fills).length == 0 ? null: buildGradientFills(node)
  }),
  strokeTopWeight: (node) => ({
    borderTop: node.strokeTopWeight ? buildStrokestop(node) : null
  }),
  strokeBottomWeight: (node) => ({
    borderBottom: node.strokeBottomWeight ? buildStrokesbottom(node) : null
  }),
  strokeRightWeight: (node) => ({
    borderRight: node.strokeRightWeight ? buildStrokesright(node) : null
  }),
  strokeLeftWeight: (node) => ({
    borderLeft: node.strokeLeftWeight ? buildStrokesleft(node) : null
  }),
  strokes: (node) => ({
    // borderStyle: "solid",
    borderColor: !node.strokes || Object.keys(node.strokes).length == 0 ? null : node.strokes[0] ? buildStrokes(node) : null,
  }),
  id: (node) => ({
    "&::before": !node.strokes || Object.keys(node.strokes).length == 0 ? null : buildStrokesBorderGradient(node)
  }),
  strokeWeight: (node) => ({
    borderWidth: node.strokeWeight ? `${node.strokeWeight}px` : null
  }),
  cornerRadius: (node) => ({
    borderRadius: `${node.topLeftRadius ? node.topLeftRadius : 0}px ${node.topRightRadius ? node.topRightRadius : 0}px ${node.bottomRightRadius ? node.bottomRightRadius : 0}px ${node.bottomLeftRadius ? node.bottomLeftRadius : 0}px`,
  }),
  paddingTop: (node) => ({
    padding: `${node.paddingTop ? node.paddingTop : 0}px ${node.paddingRight ? node.paddingRight : 0}px ${node.paddingBottom ? node.paddingBottom : 0}px ${node.paddingLeft ? node.paddingLeft : 0}px`,
  }),
  fontName: (node) => ({
    fontFamily: node.fontName ? node.fontName.family : null,
    fontWeight: node.fontName ? buildFontStyle(node.fontName.style) : null,
  }),
  fontSize: (node) => ({
    fontSize: node.fontSize ? `${node.fontSize}px` : null
  }),
  lineHeight: (node) => ({
    lineHeight: node.lineHeight ? buildLineheight(node.lineHeight) : null
  }),
  letterSpacing: (node) => ({
    letterSpacing: node.letterSpacing ? buildLetterspacing(node.letterSpacing) : null
  }),
  textAlignHorizontal: (node) => ({
    textAlign: node.textAlignHorizontal ? buildTextalign(node.textAlignHorizontal) : null
  }),
  textAlignVertical: (node) => ({
    verticalAlign: node.textAlignVertical ? buildVerticalalign(node.textAlignVertical) : null
  }),
  textDecoration: (node) => ({
    textDecoration: node.textDecoration ? buildTextdecoration(node.textDecoration) : null
  }),
  textCase: (node) => ({
    textTransform: node.textCase ? buildTextcase(node.textCase) : null
  }),
  effects: (node) => ({
    boxShadow: !node.effects || Object.keys(node.effects).length == 0 ? null : node.effects[0] ? buildEffects(node) : null,
    filter: !node.effects || Object.keys(node.effects).length == 0 ? null : node.effects[0] ? buildEffects(node) : null,
    backdropFilter: !node.effects || Object.keys(node.effects).length == 0 ? null : node.effects[0] ? buildEffects(node) : null,
  }),
  rotation: (node) => ({
    transform: node.rotation ? `rotate(${node.rotation}deg)` : null
  }),
  strokeCap: (node) => ({
    strokeLinecap: node.strokeLinecap ? getStrokeCap(node) : null
  }),
  strokeJoin: (node) => ({
    strokeLinejoin: node.strokeLinejoin ? getStrokeJoin(node) : null
  }),
  maskType: (node) => ({
    maskType: node.maskType ? getMaskType(node) : null
  }),
  fillGeometry: (node) => ({
    clipPath: getfillGeometry(node)
  })
};

export const fnNativeAttributes = (node) => {    
  const allPropertyNames = [
    // "currentPage",
    // "name",
    // "x",
    // "y",
    // "parent",
    // "onmessage",
    // "description",
    // "dashPattern"
    // "removed",
    // "absoluteTransform",
    // "absoluteBoundingBox",
    // "absoluteRenderBounds",
    // "inferredAutoLayout",
    "counterAxisAlignContent",
    "counterAxisAlignItems",
    "counterAxisSizingMode",
    "primaryAxisAlignItems",
    "primaryAxisSizingMode",
    // "relativeTransform",
    // "constraints",
      "type",
      "blendMode", 
      "id",
      "visible",
      "width",
      "height",
      "maxHeight",
      "minHeight",
      "maxWidth",
      "minWidth",
      "fontSize",
      "fontName",
      "rotation",
      "opacity",
      "paddingRight",
      "paddingLeft",
      "paddingBottom",
      "paddingTop",
      "cornerSmoothing",
      "cornerRadius",
      "topRightRadius",
      "topLeftRadius",
      "bottomRightRadius",
      "bottomLeftRadius",  
      "layoutMode",
      "layoutGrow",
    "layoutAlign",
    "layoutGrids",    
    "layoutWrap", 
    "layoutPositioning",
    "layoutSizingHorizontal",
    "layoutSizingVertical",
      "isAsset",
      "maskType",     
      "effects",
      "fills",
      "strokes",
      "fillGeometry",
      "strokeAlign",
      "strokeWeight",
      "strokeCap",
      "strokeJoin",
      "strokeLeftWeight",
      "strokeBottomWeight",
      "strokeRightWeight",
      "strokeMiterLimit",
      "strokeTopWeight",
      "itemSpacing",
      // "counterAxisSpacing",
      "arcData",
      // "itemReverseZIndex",
      "selectedTextRange",
      "innerRadius",
      "textAlignHorizontal",
      "textCase",
      "textAutoResize",
      "textAlignVertical",
      "textDecoration",
      "lineHeight",
      "letterSpacing",
      "scaleFactor",
      "paragraphIndent",
      "paragraphSpacing"
  ];
  
    const data = {};
    
    for (const propertyName of allPropertyNames) {
      try {
        if (propertyName in node) {
          if (specialProperties[propertyName]) {
            Object.assign(data, specialProperties[propertyName](node));
          } else {
            data[propertyName] = node[propertyName];
          }
        }
      } catch (error) {
        console.error(`Error processing property ${propertyName}: ${error}`);
      }
    }
    
    return data;
  };
  