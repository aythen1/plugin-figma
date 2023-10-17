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
  buildLetterspacing,
  buildTextalign,
  buildTextcase,
  buildVerticalalign,
  buildTextdecoration,
  buildLineheight,
  getfillGeometry
} from './PropertiesHandlers';

const specialProperties = {
  layoutMode: (node) => ({
    flexDirection: getLayoutMode(node)
  }),
  primaryAxisAlignItems: (node) => ({
    justifyContent: getPrimaryAxisAlignItems(node)
  }),
  counterAxisAlignItems: (node) => ({
    alignItems: getCounterAxisAlignItems(node)
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
    color: getTextColor(node),
    backgroundColor: getBackgroundColor(node),
    background: convertFigmaGradientToString(node)
  }),
  strokes: (node) => ({
    border: !node.strokes || Object.keys(node.strokes).length == 0 ? null : node.strokes[0] ? buildStrokes(node.strokeWeight, node.strokes[0]) : null
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
    boxShadow: !node.effects || Object.keys(node.effects).length == 0 ? null : node.effects[0] ? buildEffects(node.effects[0]) : null,
    filter: !node.effects || Object.keys(node.effects).length == 0 ? null : node.effects[0] ? buildEffects(node.effects[0]) : null,
    backdropFilter: !node.effects || Object.keys(node.effects).length == 0 ? null : node.effects[0] ? buildEffects(node.effects[0]) : null,
  }),
  rotation: (node) => ({
    transform: node.rotation? `rotate(${node.rotation}deg)` : null
  }),
  strokeCap: (node) => ({
    strokeLinecap: getStrokeCap(node)
  }),
  strokeJoin: (node) => ({
    strokeLinejoin: getStrokeJoin(node)
  }),
  maskType: (node) => ({
    maskType: node.maskType ? getMaskType(node) : null
  }),
  strokeWeight: (node) => ({
    strokeWidth: node.strokeWeight ? node.strokeWeight : null
  }),
  fillGeometry: (node) => ({
      clipPath: node.fillGeometry ? node.fillGeometry[0].data : null
  }),
};

export const fnNativeAttributes = (node) => {    
  const allPropertyNames = [
      "id",
      "onmessage",
      "currentPage",
      "type",
      "cancel",
      "guides",
      "center",
      "locked",
      "detachedInfo",
      "visible",
      "origin",
      "name",
      "zoom",
      "description",
      "autoRename",
      "x",
      "y",
      "parent",
      "width",
      "height",
      "maxHeight",
      "minHeight",
      "maxWidth",
      "characters",
      "minWidth",
      "fontSize",
      "fontName",
      "backgrounds",
      "rotation",
      "backgroundStyleId",
      "opacity",
      "componentPropertyReferences",
      "attachedConnectors",
      "exportSettings",    
      "dashPattern",
      "paddingRight",
      "paddingLeft",
      "paddingBottom",
      "paddingTop",
      "horizontalPadding",
      "verticalPadding",
      "cornerSmoothing",
      "cornerRadius",
      "topRightRadius",
      "topLeftRadius",
      "bottomRightRadius",
      "bottomLeftRadius",
      "constrainProportions",
      "constraints",
      "clipsContent",
      "children",
      "layoutGrow",
      "layoutAlign",
      "layoutGrids",
      "layoutMode",
      "layoutSizingHorizontal",
      "layoutPositioning",
      "layoutWrap",
      "layoutSizingVertical",
      "blendMode",
      "gridStyleId",
      "isMask",
      "isAsset",
      "maskType",
      "expanded",
      "effects",
      "effectStyleId",
      "fills",
      "fillStyleId",
      "strokes",
      "fillGeometry",
      "strokeAlign",
      "strokeWeight",
      "strokeStyleId",
      "strokeCap",
      "strokeGeometry",
      "strokeJoin",
      "strokeLeftWeight",
      "strokeBottomWeight",
      "strokeRightWeight",
      "strokeMiterLimit",
      "strokesIncludedInLayout",
      "strokeTopWeight",
      "overflowDirection",
      "relativeTransform",
      "overlayBackgroundInteraction",
      "overlayBackground",
      "numberOfFixedChildren",
      "overlayPositionType",
      "primaryAxisSizingMode",
      "playbackSettings",
      "counterAxisSizingMode",
      "primaryAxisAlignItems",
      "counterAxisAlignContent",
      "counterAxisAlignItems",
      "itemSpacing",
      "counterAxisSpacing",
      "arcData",
      "itemReverseZIndex",
      "removed",
      "selection",
      "booleanOperation",
      "reactions",
      "pointCount",
      "selectedTextRange",
      "vectorNetwork",
      "innerRadius",
      "handleMirroring",
      "vectorPaths",
      "textAlignHorizontal",
      "textCase",
      "textAutoResize",
      "textAlignVertical",
      "textDecoration",
      "textStyleId",
      "lineHeight",
      "letterSpacing",
      "scaleFactor",
      "mainComponent",
      "paragraphIndent",
      "paints",
      "absoluteRenderBounds",
      "paragraphSpacing",
      "absoluteTransform",
      "absoluteBoundingBox",
      "inferredVariables",
      "inferredAutoLayout",
      "variableConsumptionMap",
      "boundVariables",
      "resolvedVariableModes",
      "explicitVariableModes",
      "stuckNodes"
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
  