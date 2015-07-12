/* global document */
const measureText = (texts) => {
  const bodyElement = document.getElementsByTagName('body')[0],
        svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text'),
        result = [];
  svgElement.appendChild(textElement);
  bodyElement.appendChild(svgElement);

  for (const text of texts) {
    textElement.innerHTML = text;
    const {width, height} = textElement.getBBox();
    result.push({width, height});
  }

  return result;
};

export default measureText;
