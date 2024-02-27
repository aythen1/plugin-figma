import { fnNativeAttributes } from './components/CssProperties';
import { getImages, changeVisibility, updateZIndex, updateProperties, deleteProperties, modifyPosition, buildRotation } from './components/PropertiesHandlers';

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
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "laptop": {
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
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "mobile": {
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
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "tablet": {
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
        "position": "absolute",
        "active": true,
        "attribute": {}
      },
      "desktop": {
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
        "position": "absolute",
        "active": true,
        "attribute":[], 
      },
      "mobileLandscape": {
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
        "position": "absolute",
        "active": true,
        "attribute": {}
      }
    },
    "event": "",
    "state": {},
    "other": {}
  }
};

let getComponentType = (node) => {
  if (node.type === 'RECTANGLE') {
    return 'div';
  } else if (node.type === 'TEXT' && node.hyperlink) {    
     return 'a'
  } else if (node.type === 'TEXT' && !node.hyperlink) {
    return 'span';
  } else if (node.type === 'ELLIPSE' || node.type === 'STAR' || node.type === "POLYGON" || node.type === 'VECTOR' || node.type === 'LINE') {
    return 'svg';
  } else if (node.type === 'IMAGE') {
    return 'img';
  } else {
    return 'div';
  }
}
function getUrl(node) {
  if (node.type === "TEXT" && node.hyperlink) {
    return node.hyperlink.value;
  }
  return "";
}

let createComponent = async (node, value, idx) => {
  let id = value
  const componentType = getComponentType(node);
  const hasChildren = node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'BOOLEAN_OPERATION';
  const componentName = (node.name).substring(0, 24);
  const cssProperties = fnNativeAttributes(node);
  const PropertiesCss = deleteProperties(cssProperties)
  const imageEncode = await getImages(node);
  const father = figma.currentPage.selection[idx].width
  const url = getUrl(node)
    
  let tree = {
    ...templateComponent,
    figmaId: id++,
    rol: hasChildren ? "container" : "default",
    tag: componentType,
    name: componentName,
    tagName: componentType,
    image: imageEncode,
    src: url,
    nativeAttributes: {
      value: "text",
      innerHTML: node.characters ? node.characters : ""
    },
    Property: {
      style: {
        wide: {
          grid: {
            height: node.height,
            width: node.width,
            positionAbsolute: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y
            },
            positionRelative: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y,
            }
          },
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: PropertiesCss
        },
        laptop: {
          grid: {
            height: node.height,
            width: node.width,
            positionAbsolute: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y
            },
            positionRelative: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y,
            }
          },
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: father >= 991 && father < 1200 ? PropertiesCss: {},
        },
        mobile: {
          grid: {
            height: node.height,
            width: node.width,
            positionAbsolute: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y
            },
            positionRelative: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y,
            }
          },
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: father < 479 ? PropertiesCss: {},
        },
        tablet: {
          grid: {
            height: node.height,
            width: node.width,
            positionAbsolute: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y
            },
            positionRelative: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y,
            }
          },
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: father >= 767 && father < 991 ? PropertiesCss: {},
        },
        desktop: {
          grid: {
            height: node.height,
            width: node.width,
            positionAbsolute: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y
            },
            positionRelative: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y,
            }
          },
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static",
          active: true,
          attribute: father >= 1200 && father <= 1600 ? PropertiesCss: {},
        },
        mobileLandscape: {
          grid: {
            height: node.height,
            width: node.width,
            positionAbsolute: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y
            },
            positionRelative: {
              x: id === 1 ? 0 : node.x,
              y: id === 1 ? 0 : node.y,
            }
          },
          position: node.layoutPositioning === "ABSOLUTE" ? "absolute" : "static", 
          active: true,
          attribute: father > 479 && father < 767 ? PropertiesCss: {},
        }
      },
      event: "",
      state: {},
      other: {}
    },
    hasChildren: hasChildren,
    type: node.type,
    x: node.x,
    y: node.y,    
    children: []
  };

  if ((node.type === 'RECTANGLE' || node.type === 'TEXT' || node.type === 'FRAME' ) && node.fills) {
    tree.tag = imageEncode?.image?.length > 3 ? "img" : componentType
    tree.tagName = tree.image?.image || imageEncode?.image?.length > 3 ?  "img" : componentType
  }

  if (hasChildren && !(componentType === 'svg')) {
    const childComponents = await Promise.all(
      node.children.map(async (childNode, i) => {
        const childComponent = await createComponent(childNode, id + ( i + 1 ), idx);
        return childComponent;
      })
    );

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

const fatherWidth = () => {
  const father = figma.currentPage.selection[0].width
    if (father < 479) return 'mobile'
    else if (father >= 479 && father < 767) return 'mobileLandscape'
    else if (father >= 767 && father < 991) return 'tablet'
    else if (father >= 991 && father < 1200) return 'laptop'
    else if (father >= 1200 && father <= 1600) return 'desktop'
    else return 'wide'
  }

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "figma-json") {
    try {
      const selectedComponent = figma.currentPage.selection;
      const views = await Promise.all(selectedComponent.map( async(el, i) => {
        const jsonTree = await createComponent(el, 1, i);
        changeVisibility(jsonTree, fatherWidth())
        updateProperties(jsonTree, fatherWidth())
        modifyPosition(jsonTree, fatherWidth())
        updateZIndex(jsonTree, fatherWidth())
        buildRotation(jsonTree, fatherWidth())
        return jsonTree
      }))
      const combinedJson = {
        views: views
      }
      const jsonText = JSON.stringify(combinedJson, null, 2);
      figma.ui.postMessage({ type: "json-data", data: jsonText });
    } catch (error) {
      console.error('Error al generar el JSON:', error);
    }
      
  }
}
