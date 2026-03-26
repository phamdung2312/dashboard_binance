export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 0.01) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 8,
  });
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  }
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }
  return volume.toFixed(2);
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}
