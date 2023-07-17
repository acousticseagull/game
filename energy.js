export default function addEnergy(g, settings) {
  const { pos } = settings;

  const sprite = g.add(g.sprite('energy.png', 7, 7), g.pos(pos), g.area());

  sprite.onAdd = () => {};

  sprite.onUpdate = (dt) => {
    const players = g.getSpritesByTag('player');

    players.forEach((player) => {
      if (player.isActive() && sprite.distanceTo(player) < 50) {
        const angle = sprite.angleTo(player);
        sprite.vel.x = Math.cos(angle) * 360;
        sprite.vel.y = Math.sin(angle) * 360;
      } else {
        sprite.vel.x = 0;
        sprite.vel.y = 120;
      }
    });
  };

  sprite.onCollide = (other) => {
    if (!other.hasTag('player')) return;

    sprite.destroy();
    other.energy.actual += other.energy.actual < 10 ? 0.15 : 0;
  };
}
