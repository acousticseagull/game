export const timer = (s = 0) => {
  s = s * 1000;

  return {
    s,
    t: Date.now() + s,
    set(s) {
      this.s = s * 1000;
      this.t = Date.now() + this.s;
    },
    reset() {
      this.t = Date.now() + this.s;
    },
    delta() {
      return Date.now() - this.t;
    },
    expired() {
      return this.delta() > 0;
    },
  };
};
