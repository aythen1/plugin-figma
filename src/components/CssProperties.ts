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
  buildGradientFills,
  buildRotation,
} from './PropertiesHandlers';

const specialProperties = {
  parent: () => ({
    zIndex: 0
  }),
  visible: (node) => ({
    visibility: node.visible ? "visible" : "hidden"
  }),
  clipsContent: (node) => ({
    overflow: node.clipsContent === true ? "hidden" : null
  }),
  opacity: (node) => ({
    opacity: node.opacity ? node.opacity * 100 : null
  }),  
  layoutGrids: (node) => ({
    display: getDisplay(node)
  }),
  layoutMode: (node) => ({
    flexDirection: node.inferredAutoLayout.layoutMode ? getLayoutMode(node) : null
  }),
  primaryAxisAlignItems: (node) => ({
    justifyContent: node.inferredAutoLayout.primaryAxisAlignItems ? getPrimaryAxisAlignItems(node) : null
  }),
  counterAxisAlignItems: (node) => ({
    alignItems: node.inferredAutoLayout.counterAxisAlignItems ? getCounterAxisAlignItems(node) : null
  }),
  layoutWrap: (node) => ({
    flexWrap: node.flexWrap ? node.flexWrap.toLowerCase() : null
  }),
  layoutGrow: (node) => ({
    flexGrow: node.layoutGrow? node.layoutGrow : null
  }),
  itemSpacing: (node) => ({
    gap: node.itemSpacing || node.inferredAutoLayout.itemSpacing  ? node.inferredAutoLayout.itemSpacing : null
  }),
  removed: (node) => ({
    gradientFill: Object.keys(node.fills).length === 0 ? null : buildGradientFills(node)
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
    gradientStroke: !node.strokes || Object.keys(node.strokes).length === 0 ? null: buildGradientStroke(node)
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
    borderWidth: node.strokeWeight ? node.strokeWeight : null
  }),
  cornerRadius: (node) => ({
  borderRadius: node.cornerRadius && node.cornerRadius !== 0 ? node.cornerRadius : null
  }),
  topLeftRadius: (node) => ({
    borderTopLeftRadius: node.topLeftRadius ? node.topLeftRadius : null
  }),
  topRightRadius: (node) => ({
    borderTopRightRadius: node.topRightRadius ? node.topRightRadius : null
  }),
  bottomLeftRadius: (node) => ({
    borderBottomLeftRadius: node.bottomLeftRadius ? node.bottomLeftRadius : null
  }),
  bottomRightRadius: (node) => ({
    borderBottomRightRadius: node.bottomRightRadius ? node.bottomRightRadius : null
  }),
  fontName: (node) => ({
    fontFamily: node.fontName ? node.fontName.family : null,
    fontWeight: node.fontName ? buildFontStyle(node.fontName.style) : null,
  }),
  fontSize: (node) => ({
    fontSize: node.fontSize ? node.fontSize : null
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
    rotation: node.rotation ? buildRotation(node.rotation) : null
  }),
  strokeMiterLimit: (node) => ({
    strokeMiterlimit: node.strokeMiterLimit ? node.strokeMiterLimit : null
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
    "id",
    // "name",
    // "x",
    // "y",
    "parent",
    // "description",
    // "dashPattern"
     "removed",
    // "absoluteTransform",
    // "absoluteBoundingBox",
    // "absoluteRenderBounds",
    // "inferredAutoLayout",
    // "counterAxisAlignContent",
    "counterAxisAlignItems",
    // "counterAxisSizingMode",
    // "primaryAxisSizingMode",
    "primaryAxisAlignItems",
    // "relativeTransform",
    // "constraints",
    // "type",
    "blendMode",
    // "backgrounds"
    "clipsContent",
    "visible",
    // "width",
    // "height",
    "maxHeight",
    "minHeight",
    "maxWidth",
    "minWidth",
    "fontSize",
    "fontName",
    "rotation",
    "opacity",
    "paddingTop",
    "paddingRight",
    "paddingLeft",
    "paddingBottom",
    // "cornerSmoothing",
    "cornerRadius",
    "topRightRadius",
    "topLeftRadius",
    "bottomRightRadius",
    "bottomLeftRadius",
    "layoutMode",
    "layoutGrow",
    // "layoutAlign",
    "layoutGrids",
    "layoutWrap",
    // "layoutPositioning",
    // "layoutSizingHorizontal",
    // "layoutSizingVertical",
    // "isAsset",
    "maskType",
    "effects",
    "fills",
    "strokes",
    "fillGeometry",
    // "strokeAlign",
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
    // "arcData",
    // "itemReverseZIndex",
    "selectedTextRange",
    "innerRadius",
    "textAlignHorizontal",
    "textCase",
    // "textAutoResize",
    "textAlignVertical",
    "textDecoration",
    "lineHeight",
    "letterSpacing",
    // "scaleFactor",
    // "paragraphIndent",
    // "paragraphSpacing"
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
