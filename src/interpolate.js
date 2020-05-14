export default function interpolate(animation, interpolator) {
  return {
    instance: animation,
    run: (node, cssProp) => {
      if(cssProp.indexOf('--') === -1) {
        return (values) => {
          node.style[cssProp] = interpolator(values);
        }
      }

      return (values) => {
        node.style.setProperty(cssProp, interpolator(values));
      }
    }
  }
}
