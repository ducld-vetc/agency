import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, MapPinned } from 'lucide-react';
import {
  DlsBrandButton,
  DlsNeutralButton,
  DlsSheetHeader,
  DlsStatusBadge,
  DlsTopNav,
  FilterIcon,
} from '@dls/components';
import { getDlsOverlayRoot } from '@dls/portal';
import {
  ASSIGNED_AREAS,
  CONTRACT_LABELS,
  MOCK_SERVICE_POINTS,
  POINT_TYPE_LABELS,
  ServicePointStatus,
  ServicePointType,
  STATUS_LABELS,
  STATUS_VARIANT,
} from '../../data/servicePointMock';
import {
  getAverageCoverageSummary,
} from '../../utils/servicePointCoverage';

const STATUS_FILTERS: { key: 'all' | ServicePointStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'rejected', label: 'Từ chối' },
  { key: 'activated', label: 'Đã kích hoạt' },
];

const AREA_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  ...ASSIGNED_AREAS.map((area) => ({ key: area.value, label: area.label })),
] as const;

const POINT_TYPE_FILTERS: { key: 'all' | ServicePointType; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'new', label: POINT_TYPE_LABELS.new },
  { key: 'conversion', label: POINT_TYPE_LABELS.conversion },
];

type AreaFilterKey = (typeof AREA_FILTERS)[number]['key'];
type PointTypeFilterKey = (typeof POINT_TYPE_FILTERS)[number]['key'];

type AdvancedFilterDraft = {
  area: AreaFilterKey;
  pointType: PointTypeFilterKey;
};

const EMPTY_ADVANCED_FILTER: AdvancedFilterDraft = {
  area: 'all',
  pointType: 'all',
};

const FilterSection: React.FC<{
  title: string;
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}> = ({ title, options, value, onChange }) => (
  <div className="dls-filter-section am-sp-filter-sheet__section">
    <span className="dls-label">{title}</span>
    <div className="am-sp-filter-sheet__options">
      {options.map((option) => {
        const selected = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            className={`dls-multi-select-item${selected ? ' dls-multi-select-item--on' : ''}`}
            onClick={() => onChange(option.key)}
            aria-pressed={selected}
          >
            <span
              className={`dls-checkbox dls-multi-select-item__check${selected ? ' dls-checkbox--on' : ''}`}
              aria-hidden
            >
              {selected && <Check size={14} strokeWidth={3} />}
            </span>
            <span className="dls-multi-select-item__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const AdvancedFilterSheet: React.FC<{
  open: boolean;
  draft: AdvancedFilterDraft;
  onDraftChange: (draft: AdvancedFilterDraft) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}> = ({ open, draft, onDraftChange, onClose, onApply, onClear }) => {
  if (!open) return null;

  return createPortal(
    <div
      className="dls-sheet-overlay"
      role="dialog"
      aria-modal
      aria-label="Bộ lọc"
      onClick={onClose}
    >
      <div className="dls-sheet am-sp-filter-sheet" onClick={(e) => e.stopPropagation()}>
        <DlsSheetHeader title="Bộ lọc" onClose={onClose} />
        <div className="dls-sheet-body am-sp-filter-sheet__body">
          <FilterSection
            title="Địa bàn phân công"
            options={AREA_FILTERS.map((item) => ({ key: item.key, label: item.label }))}
            value={draft.area}
            onChange={(area) => onDraftChange({ ...draft, area: area as AreaFilterKey })}
          />
          <FilterSection
            title="Loại điểm"
            options={POINT_TYPE_FILTERS.map((item) => ({ key: item.key, label: item.label }))}
            value={draft.pointType}
            onChange={(pointType) =>
              onDraftChange({ ...draft, pointType: pointType as PointTypeFilterKey })
            }
          />
        </div>
        <div className="dls-sheet-footer">
          <DlsNeutralButton onClick={onClear}>Xoá bộ lọc</DlsNeutralButton>
          <DlsBrandButton onClick={onApply}>Áp dụng</DlsBrandButton>
        </div>
      </div>
    </div>,
    getDlsOverlayRoot(),
  );
};

const countAdvancedFilters = (filters: AdvancedFilterDraft) =>
  (filters.area !== 'all' ? 1 : 0) + (filters.pointType !== 'all' ? 1 : 0);

const ServicePointListPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] =
    React.useState<(typeof STATUS_FILTERS)[number]['key']>('all');
  const [advancedFilter, setAdvancedFilter] =
    React.useState<AdvancedFilterDraft>(EMPTY_ADVANCED_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [filterDraft, setFilterDraft] = React.useState<AdvancedFilterDraft>(EMPTY_ADVANCED_FILTER);

  const advancedFilterCount = countAdvancedFilters(advancedFilter);

  const openFilterSheet = () => {
    setFilterDraft(advancedFilter);
    setFilterSheetOpen(true);
  };

  const points = React.useMemo(
    () =>
      MOCK_SERVICE_POINTS.filter((point) => {
        if (statusFilter !== 'all' && point.status !== statusFilter) return false;
        if (advancedFilter.area !== 'all' && point.assignedArea !== advancedFilter.area) {
          return false;
        }
        if (advancedFilter.pointType !== 'all' && point.pointType !== advancedFilter.pointType) {
          return false;
        }
        return true;
      }),
    [statusFilter, advancedFilter],
  );

  const coverageSource = React.useMemo(
    () =>
      MOCK_SERVICE_POINTS.filter((point) => {
        if (advancedFilter.area !== 'all' && point.assignedArea !== advancedFilter.area) {
          return false;
        }
        if (advancedFilter.pointType !== 'all' && point.pointType !== advancedFilter.pointType) {
          return false;
        }
        return true;
      }),
    [advancedFilter],
  );

  const averageCoverage = React.useMemo(
    () => getAverageCoverageSummary(coverageSource),
    [coverageSource],
  );

  return (
    <div className="am-sp">
      <DlsTopNav title="Điểm của tôi" onBack={() => navigate('/service-point')} />

      <div className="am-sp__scroll">
        <div className="dls-chip-row am-sp-filter-bar" role="toolbar" aria-label="Lọc danh sách điểm">
          <button
            type="button"
            className={`dls-chip dls-chip--filter${advancedFilterCount > 0 ? ' dls-chip--filter-active' : ''}`}
            onClick={openFilterSheet}
            aria-label="Mở bộ lọc nâng cao"
          >
            <FilterIcon />
            {advancedFilterCount > 0 && (
              <span className="dls-chip-badge">{advancedFilterCount}</span>
            )}
          </button>

          {STATUS_FILTERS.map((item) => {
            const selected = statusFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`dls-chip am-sp-status-chip${selected ? ' am-sp-status-chip--on' : ''}`}
                onClick={() => setStatusFilter(item.key)}
                aria-pressed={selected}
              >
                {selected && <Check size={14} strokeWidth={3} aria-hidden />}
                {item.label}
              </button>
            );
          })}
        </div>

        {advancedFilterCount > 0 && (
          <div className="am-sp-filter-summary">
            <p>
              Đang lọc:{' '}
              {[
                advancedFilter.area !== 'all'
                  ? AREA_FILTERS.find((item) => item.key === advancedFilter.area)?.label
                  : null,
                advancedFilter.pointType !== 'all'
                  ? POINT_TYPE_FILTERS.find((item) => item.key === advancedFilter.pointType)?.label
                  : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <button
              type="button"
              className="am-sp-filter-summary__clear"
              onClick={() => setAdvancedFilter(EMPTY_ADVANCED_FILTER)}
            >
              Xoá
            </button>
          </div>
        )}

        {averageCoverage ? (
          <section
            className={`am-sp-coverage am-card am-sp-coverage--${averageCoverage.level} am-sp-coverage--compact`}
            aria-label="Độ phủ trung bình"
          >
            <button
              type="button"
              className="am-sp-coverage__nav"
              onClick={() => navigate('/service-point/coverage')}
            >
              <div className="am-sp-coverage__head">
                <span className="am-sp-coverage__icon" aria-hidden>
                  <MapPinned size={20} strokeWidth={2.25} />
                </span>
                <div>
                  <p className="am-sp-coverage__eyebrow">Độ phủ trung bình</p>
                  <h3 className="am-sp-coverage__title">{averageCoverage.levelLabel}</h3>
                </div>
                <span className="am-sp-coverage__score">{averageCoverage.avgScorePercent}%</span>
              </div>
              <div
                className="am-sp-coverage__bar"
                role="progressbar"
                aria-valuenow={averageCoverage.avgScorePercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${averageCoverage.avgScorePercent}%` }} />
              </div>
              <p className="am-sp-coverage__hint">
                {averageCoverage.hint} Xem chi tiết theo tỉnh/thành.
              </p>
              <span className="am-sp-coverage__link">
                Tỷ lệ độ phủ theo tỉnh/thành
                <ChevronRight size={16} aria-hidden />
              </span>
            </button>
          </section>
        ) : (
          <section className="am-sp-coverage am-card am-sp-coverage--empty">
            <p className="am-sp-coverage__hint">
              Cần ít nhất 2 điểm cùng tỉnh/thành và loại khu vực để đánh giá độ phủ trung bình.
            </p>
          </section>
        )}

        {points.length === 0 ? (
          <div className="am-sp-empty am-card">
            <p>Chưa có hồ sơ nào phù hợp bộ lọc hiện tại.</p>
            <button
              type="button"
              className="am-btn-dark dls-btn-full"
              onClick={() => navigate('/service-point/register')}
            >
              Đăng ký điểm mới
            </button>
          </div>
        ) : (
          <ul className="am-sp-point-list">
            {points.map((point) => (
              <li key={point.id}>
                <button
                  type="button"
                  className="am-sp-point-card am-card"
                  onClick={() => navigate(`/service-point/points/${point.id}`)}
                >
                  <div className="am-sp-point-card__head">
                    <div className="am-sp-point-card__badges">
                      <DlsStatusBadge
                        label={STATUS_LABELS[point.status]}
                        variant={STATUS_VARIANT[point.status]}
                      />
                      <span
                        className={`am-sp-point-card__contract${point.contractSigned ? ' am-sp-point-card__contract--signed' : ''}`}
                      >
                        {point.contractSigned ? CONTRACT_LABELS.signed : CONTRACT_LABELS.unsigned}
                      </span>
                    </div>
                    <span className="am-sp-point-card__code">{point.code}</span>
                  </div>
                  <strong className="am-sp-point-card__name">{point.name}</strong>
                  <p className="am-sp-point-card__meta">
                    {POINT_TYPE_LABELS[point.pointType]} · {point.assignedAreaLabel}
                  </p>
                  <p className="am-sp-point-card__addr">{point.address}</p>
                  <div className="am-sp-point-card__foot">
                    <span>Chủ: {point.ownerName}</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AdvancedFilterSheet
        open={filterSheetOpen}
        draft={filterDraft}
        onDraftChange={setFilterDraft}
        onClose={() => setFilterSheetOpen(false)}
        onApply={() => {
          setAdvancedFilter(filterDraft);
          setFilterSheetOpen(false);
        }}
        onClear={() => {
          setFilterDraft(EMPTY_ADVANCED_FILTER);
          setAdvancedFilter(EMPTY_ADVANCED_FILTER);
          setFilterSheetOpen(false);
        }}
      />
    </div>
  );
};

export default ServicePointListPage;
