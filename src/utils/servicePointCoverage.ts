export type PointZoneType = 'highway' | 'urban' | 'mountain';

export const ZONE_SPACING_KM: Record<
  PointZoneType,
  { min: number; max: number; label: string }
> = {
  highway: { min: 15, max: 20, label: 'Cao tốc' },
  urban: { min: 3, max: 5, label: 'Nội độ' },
  mountain: { min: 35, max: 45, label: 'Vùng núi' },
};

export type CoverageLevel = 'low' | 'medium' | 'good';

export interface PointLocation {
  lat: number;
  lng: number;
  zoneType: PointZoneType;
}

export interface CoveragePoint {
  location?: PointLocation;
  assignedArea?: string;
  assignedAreaLabel?: string;
}

export interface CoverageInsight {
  zoneType: PointZoneType;
  zoneLabel: string;
  assignedArea: string;
  assignedAreaLabel: string;
  coverageTitle: string;
  pointCount: number;
  avgDistanceKm: number;
  targetMinKm: number;
  targetMaxKm: number;
  scorePercent: number;
  level: CoverageLevel;
  levelLabel: string;
  hint: string;
}

const LEVEL_LABELS: Record<CoverageLevel, string> = {
  low: 'Chưa cao',
  medium: 'Trung bình',
  good: 'Tốt',
};

function haversineKm(a: PointLocation, b: PointLocation): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function avgPairwiseDistanceKm(locations: PointLocation[]): number {
  if (locations.length < 2) return 0;
  let sum = 0;
  let pairs = 0;
  for (let i = 0; i < locations.length; i += 1) {
    for (let j = i + 1; j < locations.length; j += 1) {
      sum += haversineKm(locations[i], locations[j]);
      pairs += 1;
    }
  }
  return sum / pairs;
}

function resolveLevel(avgKm: number, targetMaxKm: number): CoverageLevel {
  if (avgKm <= targetMaxKm) return 'good';
  if (avgKm <= targetMaxKm * 1.4) return 'medium';
  return 'low';
}

export function analyzePointCoverage(points: CoveragePoint[]): CoverageInsight[] {
  const grouped = new Map<
    string,
    {
      zoneType: PointZoneType;
      assignedArea: string;
      assignedAreaLabel: string;
      locations: PointLocation[];
    }
  >();

  for (const point of points) {
    if (!point.location || !point.assignedArea) continue;
    const key = `${point.location.zoneType}::${point.assignedArea}`;
    const bucket = grouped.get(key) ?? {
      zoneType: point.location.zoneType,
      assignedArea: point.assignedArea,
      assignedAreaLabel: point.assignedAreaLabel ?? point.assignedArea,
      locations: [],
    };
    bucket.locations.push(point.location);
    grouped.set(key, bucket);
  }

  const insights: CoverageInsight[] = [];

  for (const bucket of grouped.values()) {
    if (bucket.locations.length < 2) continue;

    const target = ZONE_SPACING_KM[bucket.zoneType];
    const avgDistanceKm = avgPairwiseDistanceKm(bucket.locations);
    const level = resolveLevel(avgDistanceKm, target.max);
    const scorePercent = Math.min(100, Math.round((target.max / avgDistanceKm) * 100));

    insights.push({
      zoneType: bucket.zoneType,
      zoneLabel: target.label,
      assignedArea: bucket.assignedArea,
      assignedAreaLabel: bucket.assignedAreaLabel,
      coverageTitle: `${target.label} · ${bucket.assignedAreaLabel}`,
      pointCount: bucket.locations.length,
      avgDistanceKm,
      targetMinKm: target.min,
      targetMaxKm: target.max,
      scorePercent,
      level,
      levelLabel: LEVEL_LABELS[level],
      hint:
        level === 'low'
          ? 'Khoảng cách giữa các điểm còn xa so với mục tiêu. Nên mở thêm điểm lân cận để tăng độ phủ.'
          : level === 'medium'
            ? 'Độ phủ đang cải thiện. Cân nhắc bổ sung điểm tại vùng còn khoảng trống.'
            : 'Mạng lưới điểm đang đạt mục tiêu khoảng cách cho khu vực này.',
    });
  }

  return insights.sort((a, b) => a.scorePercent - b.scorePercent);
}

export function getPrimaryCoverageInsight(points: CoveragePoint[]): CoverageInsight | null {
  const insights = analyzePointCoverage(points);
  if (insights.length === 0) return null;
  return insights.find((item) => item.level === 'low') ?? insights[0];
}

export function formatKm(value: number): string {
  return value < 10 ? value.toFixed(1) : Math.round(value).toString();
}
