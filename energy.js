export default function addEnergy(g, settings) {
  const { pos } = settings;

  const sprite = g.add(g.sprite('energy.png', 7, 7), g.pos(pos), g.area());

  sprite.onAdd = () => {};

  sprite.onUpdate = (dt) => {
    if (g.global.player.isActive() && sprite.distanceTo(g.global.player) < 100) {
      const angle = sprite.angleTo(g.global.player);
      sprite.vel.x = Math.cos(angle) * 300;
      sprite.vel.y = Math.sin(angle) * 300;
    } else {
      sprite.vel.x = 0;
      sprite.vel.y = 80;
    }
  };

  sprite.onCollide = (other) => {
    if (!other.hasTag('player')) return;

    sprite.destroy();
    other.energy.actual += other.energy.actual < 10 ? 0.15 : 0;
  };
}
