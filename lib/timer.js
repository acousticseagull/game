export const timer = (m = 0) => {
  return {
    t: Date.now(),
    m: m * 1000,
    set(m) {
      this.m = this.m * 1000;
      this.t = Date.now() + this.m;
    },
    reset() {
      this.t = Date.now() + this.m;
    },
    delta() {
      return Date.now() - this.t;
    },
    expired() {
      return this.delta() > 0;
    },
  };
};
