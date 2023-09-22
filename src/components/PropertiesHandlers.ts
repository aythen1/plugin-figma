
export function getBackgroundColor(node) {   
    if (node.type !== 'TEXT' && node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill && fill.type === 'SOLID') {        
        return fill.color;
      }
    }
    return null;
  }
  
  export function getTextColor(node) {
    if (node.type === 'TEXT' && node.fills.length > 0) {
      const textFill = node.fills[0];
      if (textFill.type === 'SOLID' && textFill.color) {
        return textFill.color;
      }
    }
    return null;
  }
  