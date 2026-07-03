import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { DlsChip, DlsStatusBadge, DlsTopNav } from '@dls/components';
import {
  MOCK_SERVICE_POINTS,
  ServicePointStatus,
  STATUS_LABELS,
  STATUS_VARIANT,
} from '../../data/servicePointMock';

const FILTERS: { key: 'all' | ServicePointStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'rejected', label: 'Từ chối' },
  { key: 'activated', label: 'Đã kích hoạt' },
];

const ServicePointListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]['key']>('all');

  const points =
    filter === 'all'
      ? MOCK_SERVICE_POINTS
      : MOCK_SERVICE_POINTS.filter((p) => p.status === filter);

  return (
    <div className="am-sp">
      <DlsTopNav title="Điểm của tôi" onBack={() => navigate('/service-point')} />

      <div className="am-sp__scroll">
        <div className="am-sp-chips" role="tablist" aria-label="Lọc trạng thái">
          {FILTERS.map((f) => (
            <DlsChip
              key={f.key}
              label={f.label}
              selected={filter === f.key}
              brand
              onClick={() => setFilter(f.key)}
            />
          ))}
        </div>

        {points.length === 0 ? (
          <div className="am-sp-empty am-card">
            <p>Chưa có hồ sơ nào ở trạng thái này.</p>
            <button type="button" className="am-btn-dark dls-btn-full" onClick={() => navigate('/service-point/register')}>
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
                    <DlsStatusBadge
                      label={STATUS_LABELS[point.status]}
                      variant={STATUS_VARIANT[point.status]}
                    />
                    <span className="am-sp-point-card__code">{point.code}</span>
                  </div>
                  <strong className="am-sp-point-card__name">{point.name}</strong>
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
    </div>
  );
};

export default ServicePointListPage;
