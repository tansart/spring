import React from 'react';

class AnimatedBase extends React.Component {

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    let instance = null;
    mapCallbacks.call(this, instance);
  }

  componentDidUpdate(prevProps) {
    let instance;
    if(prevProps.style !== this.props.style) {
      Object.keys(prevProps.style).forEach(cssProp => {
        instance = prevProps.style[cssProp];
        if(!this.props.style.hasOwnProperty(cssProp)) {
          instance.instance.removeCallbackWithKey(cssProp);
        }
      });

      mapCallbacks.call(this, instance);
    }
  }

  componentWillUnmount() {
    // clean
    let instance;
    Object.keys(this.props.style).forEach(cssProp => {
      instance = this.props.style[cssProp];
      if(typeof instance.run === 'function') {
        instance.instance.removeCallbackWithKey(cssProp);
      }
    });
  }

  render() {
    const { animatedProps, children, forwaredRef, style, type, ...props } = this.props;

    return React.createElement(type, {...props, style: strip(style), ref: (el) => {
        forwaredRef ? (forwaredRef.current = el): null;
        this._ref.current = el;
      }}, children)
  }
}

function mapCallbacks(instance) {
  Object.keys(this.props.style).forEach(cssProp => {
    instance = this.props.style[cssProp];
    if(typeof instance.run === 'function') {
      instance.instance.addCallbackWithKey(cssProp, instance.run(this._ref.current, cssProp));
    }
  });
}

function strip(style) {
  return Object.keys(style).reduce((acc, k) => {
    if(typeof style[k] === 'string') {
      acc[k] = style[k];
    }
    return acc;
  }, {});
}

const AnimatedInstances = {};
export default new Proxy(AnimatedBase, {
  get(obj, type) {
    return AnimatedInstances[type] || (AnimatedInstances[type] = React.forwardRef(({children, ...props}, ref) => (
      <AnimatedBase forwaredRef={ref} type={type} {...props}>
        {children}
      </AnimatedBase>
    )));
  }
});
