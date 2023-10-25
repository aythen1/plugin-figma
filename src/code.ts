import { fnNativeAttributes } from './components/CssProperties';
import { getAbsolutePositionRelativeToArtboard, getImages, changeVisibility, updateZIndex } from './components/PropertiesHandlers';

let templateComponent = {
  "tag": "span",
  "name": "span",
  "tagName": "" ,
  "attributes": {},
  "image":[],
  "nativeAttributes": {
    "value": "text",
    "innerHTML": "text"
  },
  "isShow": true,
  "isDeleted": false,
  "Property": {
    "style": {
      "wide": {
        "width": "1600",
        "active": true,
        "attribute": {}
      },
      "laptop": {
        "width": "1200",
        "active": true,
        "attribute": {}
      },
      "mobile": {
        "width": "479",
        "active": true,
        "attribute": {}
      },
      "tablet": {
        "width": "991",
        "active": true,
        "attribute": {}
      },
      "desktop": {
        "width": "1920",
        "active": true,
        "attribute":[], 
      },
      "mobileLandscape": {
        "width": "767",
        "active": true,
        "attribute": {}
      }
    },
    "grid": {
      "height": "",
      "width": "",
      "x": "",
      "y": ""
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
  } else if (type === 'ELLIPSE' || type === 'STAR' || type === 'VECTOR' || type === 'LINE') {
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
  const hasChildren = node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT';
  const componentName = (node.name).substring(0, 15);
  const cssProperties = fnNativeAttributes(node);
  const position = getAbsolutePositionRelativeToArtboard(node)
  const imageEncode = await getImages(node)
  
  let tree = {
    ...templateComponent,
    figmaId: id++,
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
          active: true,
          attribute: {}
        },
        laptop: {
          width: "1200",
          active: true,
          attribute: {}
        },
        mobile: {
          width: "479",
          active: true,
          attribute: {}
        },
        tablet: {
          width: "991",
          active: true,
          attribute: {}
        },
        desktop: {
          width: "1920",
          active: true,
          attribute:cssProperties,
        },
        mobileLandscape: {
          width: "767",
          active: true,
          attribute: {}
        }
      },
      grid: {
        height: node.height,
        width: node.width,
        x: position.x,
        y: position.y,
      },
      event: "",
      state: {},
      other: {}
    },
    hasChildren: hasChildren,
    children: []
  };
  
    
  if ((node.type === 'RECTANGLE' || node.type === 'TEXT') && node.fills) {
    tree.image = imageEncode;
    tree.tag = imageEncode?.image?.length > 3 ? "img" : componentType
    tree.tagName = imageEncode?.image?.length > 3 ? "img" : componentType
    tree.name = imageEncode?.image?.length > 3 ? "img" : componentName
  }
  if (hasChildren && !(componentType == 'svg')) {
    const childComponents = await Promise.all(
      node.children.map(async (childNode) => {
        const childComponent = await createComponent(childNode);
        return childComponent;
      })
    );

    const chunkSize = 1000000; 
    const childChunks = [];

    for (let i = 0; i < childComponents.length; i += chunkSize) {
      const chunk = childComponents.slice(i, i + chunkSize);
      childChunks.push(chunk);
    }   
    for (const chunk of childChunks) {
      tree.children.push(...chunk);
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
      const jsonText = JSON.stringify(jsonTree, null, 2);
      
      figma.ui.postMessage({ type: "json-data", data: jsonText });
    } catch (error) {
      console.error('Error al generar el JSON:', error);
    }
  }
}
