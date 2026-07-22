import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPinned } from 'lucide-react';
import { DlsTopNav } from '@dls/components';
import { MOCK_SERVICE_POINTS } from '../../data/servicePointMock';
import {
  analyzeCoverageByProvince,
  formatKm,
  getAverageCoverageSummary,
  ProvinceCoverage,
} from '../../utils/servicePointCoverage';

const ProvinceRow: React.FC<{
  province: ProvinceCoverage;
  open: boolean;
  onToggle: () => void;
}> = ({ province, open, onToggle }) => (
  <li className={`am-sp-coverage-province am-card${open ? ' am-sp-coverage-province--open' : ''}`}>
    <button
      type="button"
      className="am-sp-coverage-province__summary"
      onClick={onToggle}
      aria-expanded={open}
    >
      <span className="am-sp-coverage-province__main">
        <strong>{province.assignedAreaLabel}</strong>
        <em>{province.totalPoints} điểm · {province.levelLabel}</em>
      </span>
      <span
        className={`am-sp-coverage-province__badge am-sp-coverage-province__badge--${province.level}`}
      >
        {province.avgScorePercent != null ? `${province.avgScorePercent}%` : '—'}
      </span>
      <ChevronDown
        size={16}
        className={`am-sp-coverage-province__chev${open ? ' am-sp-coverage-province__chev--open' : ''}`}
        aria-hidden
      />
    </button>

    {open && (
      <ul className="am-sp-coverage-zones">
        {province.zones.map((zone) => (
          <li key={zone.zoneType} className="am-sp-coverage-zone">
            <div className="am-sp-coverage-zone__row">
              <strong>{zone.zoneLabel}</strong>
              <span className={`am-sp-coverage-zone__score am-sp-coverage-zone__score--${zone.level}`}>
                {zone.scorePercent != null ? `${zone.scorePercent}%` : '—'}
              </span>
            </div>
            <div
              className="am-sp-coverage__bar am-sp-coverage-zone__bar"
              role="progressbar"
              aria-valuenow={zone.scorePercent ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${zone.scorePercent ?? 0}%` }} />
            </div>
            <p className="am-sp-coverage-zone__meta">
              {zone.pointCount} điểm · Mục tiêu {zone.targetMinKm}–{zone.targetMaxKm} km
              {zone.avgDistanceKm != null ? ` · TB ${formatKm(zone.avgDistanceKm)} km` : ` · ${zone.levelLabel}`}
            </p>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const ServicePointCoveragePage: React.FC = () => {
  const navigate = useNavigate();
  const provinces = React.useMemo(
    () => analyzeCoverageByProvince(MOCK_SERVICE_POINTS),
    [],
  );
  const average = React.useMemo(
    () => getAverageCoverageSummary(MOCK_SERVICE_POINTS),
    [],
  );
  const [openArea, setOpenArea] = React.useState<string | null>(
    () => provinces[0]?.assignedArea ?? null,
  );

  return (
    <div className="am-sp">
      <DlsTopNav title="Tỷ lệ độ phủ" onBack={() => navigate('/service-point/points')} />

      <div className="am-sp__scroll">
        {average && (
          <section
            className={`am-sp-coverage am-card am-sp-coverage--${average.level} am-sp-coverage--compact`}
            aria-label="Độ phủ trung bình"
          >
            <div className="am-sp-coverage__head">
              <span className="am-sp-coverage__icon" aria-hidden>
                <MapPinned size={18} strokeWidth={2.25} />
              </span>
              <div>
                <p className="am-sp-coverage__eyebrow">Trung bình toàn mạng lưới</p>
                <h3 className="am-sp-coverage__title">{average.levelLabel}</h3>
              </div>
              <span className="am-sp-coverage__score">{average.avgScorePercent}%</span>
            </div>
            <p className="am-sp-coverage__hint">
              {average.provinceCount} tỉnh · {average.totalPoints} điểm
            </p>
          </section>
        )}

        <p className="am-sp-section-note">Chạm vào tỉnh để xem chi tiết 3 loại khu vực</p>

        {provinces.length === 0 ? (
          <div className="am-sp-empty am-card">
            <p>Chưa có điểm nào để đánh giá độ phủ theo tỉnh/thành.</p>
          </div>
        ) : (
          <ul className="am-sp-coverage-province-list">
            {provinces.map((province) => (
              <ProvinceRow
                key={province.assignedArea}
                province={province}
                open={openArea === province.assignedArea}
                onToggle={() =>
                  setOpenArea((prev) =>
                    prev === province.assignedArea ? null : province.assignedArea,
                  )
                }
              />
            ))}
          </ul>
        )}

        <button
          type="button"
          className="am-sp-coverage__cta"
          onClick={() => navigate('/service-point/register')}
        >
          Đăng ký thêm điểm lân cận
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
};

export default ServicePointCoveragePage;
