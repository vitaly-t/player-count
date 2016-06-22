function createSVGElem(type, attributes){
  try{
    var svg = document.createElementNS("http://www.w3.org/2000/svg",type);
    for(var attr in attributes){
      if(attributes.hasOwnProperty(attr)){
        svg.setAttribute(attr, attributes[attr]);
      }
    }
    return svg;
  }
  catch(e){
    throw e;
  }
}

module.exports = createSVGElem;
