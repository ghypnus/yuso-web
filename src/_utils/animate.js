
export function setTransform(style, v) {
  style.transform = v;
  style.webkitTransform = v;
  style.mozTransform = v;
}

export const getTransformPropValue = (v) => ({
  transform: v,
  WebkitTransform: v,
  MozTransform: v,
});

export const getPxStyle = (value, unit = 'px', vertical = false) => {
  value = vertical ? `0px, ${value}${unit}, 0px` : `${value}${unit}, 0px, 0px`;
  return `translate3d(${value})`;
};

export const setPxStyle = (el, value, unit = 'px', vertical = false, useLeft = false) => {
  if (useLeft) {
    if (vertical) {
      el.style.top = `${value}${unit}`;
    } else {
      el.style.left = `${value}${unit}`;
    }
  } else {
    setTransform(el.style, getPxStyle(value, unit, vertical));
  }
};
