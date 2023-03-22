import { Timer } from './timer.js';

export function Animate(animations = {}) {
  const t = Timer();

  animations = Object.keys(animations).reduce((a, c) => {
    const { delay, sequence, repeat } = animations[c];

    a[c] = {
      delay: delay ?? 1,
      sequence: sequence ?? [],
      repeat: repeat ?? true,
      frame: 0,
    };

    return a;
  }, {});

  let currentAnimation = animations[Object.keys(animations)[0]];

  function animate() {
    if (!this.currentAnimation) return;

    if (t.delta() >= this.currentAnimation.delay * 1000) {
      if (
        this.currentAnimation.frame <
        this.currentAnimation.sequence.length - 1
      )
        this.currentAnimation.frame++;
      else {
        if (this.currentAnimation.repeat) this.currentAnimation.frame = 0;
        else {
          this.currentAnimation = null;
          return;
        }
      }

      t.reset();
    }

    this.node.style.backgroundPosition = `${-(
      this.currentAnimation.sequence[this.currentAnimation.frame] *
      this.size.width
    )}px 0px`;
  }

  const playAnimation = (name) => {
    this.currentAnimation = this.animations[name];
  };

  const resetCurrentAnimation = () => {
    this.currentAnimation.frame = 0;
  };

  return {
    animations,
    currentAnimation,
    animate,
    playAnimation,
    resetCurrentAnimation,
  };
}
