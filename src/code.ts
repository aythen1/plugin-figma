import { fnNativeAttributes } from './components/CssProperties';
import { getAbsolutePosition, getImages, changeVisibility, updateZIndex, updateProperties, deleteProperties, modifyPosition } from './components/PropertiesHandlers';

let templateComponent = {
  "tag": "span",
  "name": "span",
  "tagName": "",
  "rol": "default",
  "attributes": {},
  "image": [],
  "src":"",
  "nativeAttributes": {
    "value": "text",
    "innerHTML": ""
  },
  "isShow": true,
  "isDeleted": false,
  "Property": {
    "style": {
      "wide": {
        "width": "1600",
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "laptop": {
        "width": "1200",
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "mobile": {
        "width": "479",
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "tablet": {
        "width": "991",
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "desktop": {
        "width": "1920",
        "position": "absolute",
        "active": true,
        "attribute":[], 
      },
      "mobileLandscape": {
        "width": "767",
        "position": "absolute",
        "active": true,
        "attribute": {}
      }
    },
    "grid": {
      "height": "",
      "width": "",
      "positionAbsolute": {
          "x": 0,
          "y": 0,
        },
        "positionRelative": {
          "x": 0,
          "y": 0,
        }
    },
    "event": "",
    "state": {},
    "other": {}
  }
};

let getComponentType = (type) => {
  if (type === 'RECTANGLE') {
    return 'div';
  } else if (type === 'TEXT') {
    return 'span';
  } else if (type === 'ELLIPSE' || type === 'STAR' || type === "POLYGON" || type === 'VECTOR' || type === 'LINE') {
    return 'svg';
  } else if (type === 'IMAGE') {
    return 'img';
  } else {
    return 'div';
  }
}

let id = 1
let createComponent =  async (node) => {
  const componentType = getComponentType(node.type);
  const hasChildren = node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'BOOLEAN_OPERATION';
  const componentName = (node.name).substring(0, 24);
  const cssProperties = fnNativeAttributes(node);
  const PropertiesCss = deleteProperties(cssProperties)
  const position = getAbsolutePosition(node);
  const imageEncode = await getImages(node);
  
  let tree = {
    ...templateComponent,
    figmaId: id++,
    rol: hasChildren ? "container" : "default",
    tag: componentType,
    name: componentName,
    tagName: componentType,
    image: imageEncode,
    nativeAttributes: {
      value: "text",
      innerHTML: node.characters? node.characters : ""
    },
    Property: {
      style: {
        wide: {
          width: "1600",
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: {}
        },
        laptop: {
          width: "1200",
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: {}
        },
        mobile: {
          width: "479",
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: {}
        },
        tablet: {
          width: "991",
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: {}
        },
        desktop: {
          width: "1920",
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: PropertiesCss,
        },
        mobileLandscape: {
          width: "767",
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static", 
          active: true,
          attribute: {}
        }
      },
      grid: {
        height: node.height, 
        width: node.width,
        positionAbsolute: {
          x: node.layoutPositioning === "ABSOLUTE" ? node.absoluteTransform[0][2] : position.x,
          y: node.layoutPositioning === "ABSOLUTE" ? node.absoluteTransform[1][2] : position.y
        },
        positionRelative: {
          x: node.x,
          y: node.y,
        }
      },
      event: "",
      state: {},
      other: {}
    },
    hasChildren: hasChildren,
    children: []
  };

  if ((node.type === 'RECTANGLE' || node.type === 'TEXT' || node.type === 'FRAME' ) && node.fills) {
    tree.tag = imageEncode?.image?.length > 3 ? "img" : componentType
    tree.tagName = tree.image?.image || imageEncode?.image?.length > 3 ?  "img" : componentType
  }
  if (hasChildren && !(componentType === 'svg')) {
    const childComponents = await Promise.all(
      node.children.map(async (childNode) => {
        const childComponent = await createComponent(childNode);
        return childComponent;
      })
    );

    // const chunkSize = 90000000;
    const chunkSize = 4500000;
    const childChunks = [];

    for (let i = 0; i < childComponents.length; i += chunkSize) {
      const chunk = childComponents.slice(i, i + chunkSize);
    
    childChunks.unshift(childComponents);
    }   
    for (const chunk of childChunks) {
      tree.children.unshift(...chunk);
      await new Promise((resolve) => setTimeout(resolve, 0)); 
    }
  }
  return tree;
};

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "figma-json") {
    try {
      const selectedComponent = figma.currentPage.selection[0];
      const jsonTree = await createComponent(selectedComponent);
      changeVisibility(jsonTree)
      updateZIndex(jsonTree)
      modifyPosition(jsonTree)
      updateProperties(jsonTree)
      const jsonText = JSON.stringify(jsonTree, null, 2);
      
      figma.ui.postMessage({ type: "json-data", data: jsonText });
    } catch (error) {
      console.error('Error al generar el JSON:', error);
    }
  }
}
