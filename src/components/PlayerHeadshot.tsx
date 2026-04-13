'use client';

import Image from 'next/image';
import { useState } from 'react';

function InitialsAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full bg-[#282a2b] border border-[#43474f] flex items-center justify-center font-mono text-[#8e909a] font-bold"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export function PlayerHeadshot({
  espnId,
  name,
  size = 48,
}: {
  espnId?: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!espnId || failed) {
    return <InitialsAvatar name={name} size={size} />;
  }

  return (
    <div
      className="rounded-full overflow-hidden bg-[#282a2b] border border-[#43474f] relative"
      style={{ width: size, height: size }}
    >
      <Image
        src={`https://a.espncdn.com/i/headshots/mens-college-basketball/players/full/${espnId}.png`}
        alt={name}
        fill
        className="object-cover scale-[1.35] object-top"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
