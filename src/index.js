import Animated from './Animated';
import Animation from './Animation';
import AnimationManager from './AnimationManager';
import useSpring from './useSpring';

function interpolate(animation, interpolator) {
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

export {
  Animated,
  Animation,
  AnimationManager,
  useSpring,
  interpolate
};
