export function Emblem({ index, color }: { index: number; color: string }) {
  const count = 8 + (index * 2) % 9;
  return <svg className="emb" viewBox="0 0 400 400" aria-hidden="true"><g fill={color}>
    {Array.from({ length: count }, (_, k) => {
      const angle = k / count * 6.283 + index;
      const point = (r: number, delta: number) => `${(200 + Math.cos(angle + delta) * r).toFixed(0)} ${(200 + Math.sin(angle + delta) * r).toFixed(0)}`;
      return <path key={k} d={`M${point(120, -.12)}L${point(190, 0)}L${point(120, .12)}Z`} />;
    })}
  </g><circle cx="200" cy="200" r={70 + (index * 5) % 30} fill="none" stroke={color} strokeWidth="10" /><circle cx="200" cy="200" r="34" fill={color} /></svg>;
}
