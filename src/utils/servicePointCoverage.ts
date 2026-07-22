export type PointZoneType = 'highway' | 'urban' | 'mountain';

export const ZONE_ORDER: PointZoneType[] = ['highway', 'urban', 'mountain'];

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

export interface ZoneCoverageStat {
  zoneType: PointZoneType;
  zoneLabel: string;
  pointCount: number;
  targetMinKm: number;
  targetMaxKm: number;
  /** null khi chưa đủ ≥ 2 điểm để tính */
  avgDistanceKm: number | null;
  scorePercent: number | null;
  level: CoverageLevel | 'insufficient';
  levelLabel: string;
}

export interface ProvinceCoverage {
  assignedArea: string;
  assignedAreaLabel: string;
  totalPoints: number;
  /** Trung bình % các loại khu vực đã tính được trong tỉnh */
  avgScorePercent: number | null;
  level: CoverageLevel | 'insufficient';
  levelLabel: string;
  zones: ZoneCoverageStat[];
}

export interface AverageCoverageSummary {
  avgScorePercent: number;
  level: CoverageLevel;
  levelLabel: string;
  provinceCount: number;
  zoneComputedCount: number;
  totalPoints: number;
  hint: string;
}

const LEVEL_LABELS: Record<CoverageLevel, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  good: 'Cao',
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

function scoreFromDistance(avgDistanceKm: number, targetMaxKm: number): number {
  return Math.min(100, Math.round((targetMaxKm / avgDistanceKm) * 100));
}

function levelFromScore(scorePercent: number): CoverageLevel {
  if (scorePercent >= 100) return 'good';
  if (scorePercent >= 72) return 'medium';
  return 'low';
}

function hintForLevel(level: CoverageLevel): string {
  if (level === 'low') {
    return 'Khoảng cách giữa các điểm còn xa so với mục tiêu. Nên mở thêm điểm lân cận để tăng độ phủ.';
  }
  if (level === 'medium') {
    return 'Độ phủ đang cải thiện. Cân nhắc bổ sung điểm tại vùng còn khoảng trống.';
  }
  return 'Mạng lưới điểm đang đạt mục tiêu khoảng cách cho khu vực này.';
}

function buildZoneStat(
  zoneType: PointZoneType,
  locations: PointLocation[],
): ZoneCoverageStat {
  const target = ZONE_SPACING_KM[zoneType];
  if (locations.length < 2) {
    return {
      zoneType,
      zoneLabel: target.label,
      pointCount: locations.length,
      targetMinKm: target.min,
      targetMaxKm: target.max,
      avgDistanceKm: null,
      scorePercent: null,
      level: 'insufficient',
      levelLabel: locations.length === 0 ? 'Chưa có điểm' : 'Chưa đủ dữ liệu',
    };
  }

  const avgDistanceKm = avgPairwiseDistanceKm(locations);
  const scorePercent = scoreFromDistance(avgDistanceKm, target.max);
  const level = resolveLevel(avgDistanceKm, target.max);

  return {
    zoneType,
    zoneLabel: target.label,
    pointCount: locations.length,
    targetMinKm: target.min,
    targetMaxKm: target.max,
    avgDistanceKm,
    scorePercent,
    level,
    levelLabel: LEVEL_LABELS[level],
  };
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
    const scorePercent = scoreFromDistance(avgDistanceKm, target.max);

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
      hint: hintForLevel(level),
    });
  }

  return insights.sort((a, b) => a.scorePercent - b.scorePercent);
}

export function getPrimaryCoverageInsight(points: CoveragePoint[]): CoverageInsight | null {
  const insights = analyzePointCoverage(points);
  if (insights.length === 0) return null;
  return insights.find((item) => item.level === 'low') ?? insights[0];
}

/** Phân tích độ phủ theo từng tỉnh / thành — mỗi tỉnh có 3 loại khu vực. */
export function analyzeCoverageByProvince(points: CoveragePoint[]): ProvinceCoverage[] {
  const byArea = new Map<
    string,
    {
      assignedAreaLabel: string;
      byZone: Map<PointZoneType, PointLocation[]>;
    }
  >();

  for (const point of points) {
    if (!point.location || !point.assignedArea) continue;
    const area = byArea.get(point.assignedArea) ?? {
      assignedAreaLabel: point.assignedAreaLabel ?? point.assignedArea,
      byZone: new Map(),
    };
    const list = area.byZone.get(point.location.zoneType) ?? [];
    list.push(point.location);
    area.byZone.set(point.location.zoneType, list);
    byArea.set(point.assignedArea, area);
  }

  const provinces: ProvinceCoverage[] = [];

  for (const [assignedArea, area] of byArea) {
    const zones = ZONE_ORDER.map((zoneType) =>
      buildZoneStat(zoneType, area.byZone.get(zoneType) ?? []),
    );

    const scored = zones.filter((z) => z.scorePercent != null) as Array<
      ZoneCoverageStat & { scorePercent: number }
    >;
    const totalPoints = zones.reduce((sum, z) => sum + z.pointCount, 0);
    const avgScorePercent =
      scored.length === 0
        ? null
        : Math.round(scored.reduce((sum, z) => sum + z.scorePercent, 0) / scored.length);

    const level =
      avgScorePercent == null ? ('insufficient' as const) : levelFromScore(avgScorePercent);

    provinces.push({
      assignedArea,
      assignedAreaLabel: area.assignedAreaLabel,
      totalPoints,
      avgScorePercent,
      level,
      levelLabel: level === 'insufficient' ? 'Chưa đủ dữ liệu' : LEVEL_LABELS[level],
      zones,
    });
  }

  return provinces.sort((a, b) => {
    const scoreA = a.avgScorePercent ?? -1;
    const scoreB = b.avgScorePercent ?? -1;
    return scoreA - scoreB;
  });
}

/** Độ phủ trung bình toàn mạng lưới điểm của user (dùng trên list / hub). */
export function getAverageCoverageSummary(points: CoveragePoint[]): AverageCoverageSummary | null {
  const provinces = analyzeCoverageByProvince(points);
  const scores: number[] = [];
  let totalPoints = 0;
  let zoneComputedCount = 0;

  for (const province of provinces) {
    totalPoints += province.totalPoints;
    for (const zone of province.zones) {
      if (zone.scorePercent != null) {
        scores.push(zone.scorePercent);
        zoneComputedCount += 1;
      }
    }
  }

  if (scores.length === 0) return null;

  const avgScorePercent = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const level = levelFromScore(avgScorePercent);

  return {
    avgScorePercent,
    level,
    levelLabel: LEVEL_LABELS[level],
    provinceCount: provinces.length,
    zoneComputedCount,
    totalPoints,
    hint: hintForLevel(level),
  };
}

export function formatKm(value: number): string {
  return value < 10 ? value.toFixed(1) : Math.round(value).toString();
}
