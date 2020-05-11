import Animation from './Animation';

export default class AnimationManager {
  static QUEUE = [];

  static getInstance() {
    return AnimationManager._instance || (AnimationManager._instance = new AnimationManager());
  }

  static _instance = null;

  constructor() {
    typeof requestAnimationFrame === 'function' && requestAnimationFrame(this.update);
  }

  add(animation) {
    if(animation instanceof Animation) {
      AnimationManager.QUEUE.push(animation);
    }

    return this;
  }

  remove(animation) {
    for (let i = 0; i < AnimationManager.QUEUE.length; i++) {
      if(AnimationManager.QUEUE[i] === animation) {
        AnimationManager.QUEUE.splice(i, 1);
      }
    }

    return this;
  }

  // forked from https://github.com/react-spring/react-spring/blob/master/src/animated/FrameLoop.ts
  update = () => {
    let endOfAnimation = false;
    let isDone;
    let lastTime;
    let time = Date.now();

    for(let i = 0; i < AnimationManager.QUEUE.length; i++) {
      const animation = AnimationManager.QUEUE[i];
      let config = animation.config;

      isDone = true;

      for(let j = 0; j < animation.length; j++) {
        const anim = animation.getValues(j);
        // If an animation is done, skip, until all of them conclude
        if (anim.done) {
          continue;
        }

        isDone = false;

        let to = anim.toValue;
        let position = anim.lastPosition;
        let velocity = config.initialVelocity;

        if(config.easing) {
          // Easing
          if(!anim.startTime) {
            anim.from = anim.lastPosition;
            anim.startTime = time;
          }

          position = config.easing((time - anim.startTime) / config.duration) * (to - anim.from);
          endOfAnimation = time >= anim.startTime + config.duration;

          if(endOfAnimation) {
            anim.startTime = 0;
          }
        } else {
          // Spring
          lastTime = anim.lastTime !== void 0 ? anim.lastTime : time
          velocity =
            anim.lastVelocity !== void 0
              ? anim.lastVelocity
              : config.initialVelocity;

          // If we lost a lot of frames just jump to the end.
          if (time > lastTime + 64) {
            lastTime = time;
          }
          // http://gafferongames.com/game-physics/fix-your-timestep/
          let numSteps = Math.floor(time - lastTime);
          for (let i = 0; i < numSteps; ++i) {
            let force = -config.tension * (position - to);
            let damping = -config.friction * velocity;
            let acceleration = (force + damping) / config.mass;
            velocity = velocity + (acceleration * 1) / 1000;
            position = position + (velocity * 1) / 1000;
          }

          endOfAnimation = Math.abs(velocity) <= config.precision && Math.abs(to - position) <= config.precision;

          anim.lastVelocity = velocity;
          anim.lastTime = time;
        }

        if (endOfAnimation) {
          // Ensure that we end up with a round value
          if (anim.value !== to) {
            position = to;
          }

          anim.done = true;
        }

        anim.lastPosition = position;
      }

      animation.updateValue();

      if(isDone && !animation._done) {
        animation.onEnd();
      }
    }

    requestAnimationFrame(this.update)
  }
}
