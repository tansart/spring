import React from 'react';

import Animation from "./Animation";
import AnimationManager from "./AnimationManager";

export default function useSpring(defaultValues, config) {
  const animation = React.useRef(null);
  const [values, setValues] = React.useState(null);

  if(!animation.current) {
    animation.current = new Animation(defaultValues, config);
    AnimationManager.getInstance().add(animation.current);
  }

  React.useEffect(() => () => {
    AnimationManager.getInstance().remove(animation.current);
  }, []);

  return [values || animation.current, (style) => {
    animation.current.set(style);
    setValues(animation.current);
  }];
}
