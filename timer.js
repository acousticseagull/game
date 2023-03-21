export const timer = () => {
  let t = Date.now(),
    m = 0;

  return {
    set(m) {
      m = m;
      t = Date.now() + m;
    },
    reset() {
      t = Date.now() + m;
    },
    delta() {
      return Date.now() - t;
    },
    expired() {
      return this.delta() > 0;
    },
  };
};
