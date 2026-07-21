import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronRight,
  Gift,
  MapPin,
  PlusCircle,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { DlsStatusBadge, DlsTopNav } from '@dls/components';
import {
  COMMISSION_POLICY,
  MOCK_SERVICE_POINTS,
  STATUS_LABELS,
  STATUS_VARIANT,
} from '../../data/servicePointMock';
import { getPrimaryCoverageInsight } from '../../utils/servicePointCoverage';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const POLICY_ICONS = [Gift, TrendingUp, Receipt] as const;
const MAX_COMMISSION = COMMISSION_POLICY.reduce((sum, item) => sum + item.amount, 0);

const ServicePointHubPage: React.FC = () => {
  const navigate = useNavigate();

  const pendingCount = MOCK_SERVICE_POINTS.filter((p) => p.status === 'pending').length;
  const activatedCount = MOCK_SERVICE_POINTS.filter((p) => p.status === 'activated').length;
  const commissionTotal = MOCK_SERVICE_POINTS.reduce((sum, p) => {
    if (!p.commission) return sum;
    return sum + p.commission.fixed + p.commission.turnoverBonus + p.commission.transactionBonus;
  }, 0);
  const primaryCoverage = React.useMemo(
    () => getPrimaryCoverageInsight(MOCK_SERVICE_POINTS),
    [],
  );

  return (
    <div className="am-sp">
      <DlsTopNav title="Mở điểm dịch vụ VETC" onBack={() => navigate('/')} />

      <div className="am-sp__scroll">
        <section className="am-sp-hero am-card">
          <p className="am-sp-hero__eyebrow">Chính sách phát triển điểm</p>
          <h2 className="am-sp-hero__title">Phát triển mạng lưới điểm dịch vụ VETC</h2>
          <p className="am-sp-hero__desc">
            Đăng ký hồ sơ, theo dõi thẩm định trong 48 giờ làm việc và nhận hoa hồng khi điểm
            kích hoạt.
          </p>
        </section>

        <section className="am-sp-stats">
          <div className="am-sp-stat am-card">
            <span className="am-sp-stat__label">Tổng hồ sơ</span>
            <strong>{MOCK_SERVICE_POINTS.length}</strong>
          </div>
          <div className="am-sp-stat am-card">
            <span className="am-sp-stat__label">Chờ duyệt</span>
            <strong className="am-sp-stat__warn">{pendingCount}</strong>
          </div>
          <div className="am-sp-stat am-card">
            <span className="am-sp-stat__label">Đã kích hoạt</span>
            <strong className="am-sp-stat__ok">{activatedCount}</strong>
          </div>
        </section>

        <section className="am-card am-sp-actions">
          <button
            type="button"
            className="am-sp-action-row am-sp-action-row--primary"
            onClick={() => navigate('/service-point/register')}
          >
            <span className="am-sp-action-row__icon am-sp-action-row__icon--brand">
              <PlusCircle size={22} strokeWidth={2} />
            </span>
            <span className="am-sp-action-row__body">
              <strong>Đăng ký điểm mới</strong>
              <span>Tạo hồ sơ địa điểm, chủ điểm và ảnh hiện trạng</span>
            </span>
            <ChevronRight size={18} className="am-sp-action-row__chev" />
          </button>

          <button
            type="button"
            className="am-sp-action-row"
            onClick={() => navigate('/service-point/points')}
          >
            <span className="am-sp-action-row__icon">
              <MapPin size={22} strokeWidth={2} />
            </span>
            <span className="am-sp-action-row__body">
              <span className="am-sp-action-row__title-line">
                <strong>Điểm của tôi</strong>
                {primaryCoverage && (
                  <span
                    className={`am-sp-action-row__badge am-sp-action-row__badge--${primaryCoverage.level}`}
                  >
                    Phủ {primaryCoverage.scorePercent}%
                  </span>
                )}
              </span>
              <span>
                Theo dõi trạng thái thẩm định & kích hoạt
                {primaryCoverage ? ` · ${primaryCoverage.coverageTitle}` : ''}
              </span>
            </span>
            <ChevronRight size={18} className="am-sp-action-row__chev" />
          </button>

          <button
            type="button"
            className="am-sp-action-row"
            onClick={() => navigate('/service-point/commission')}
          >
            <span className="am-sp-action-row__icon">
              <Wallet size={22} strokeWidth={2} />
            </span>
            <span className="am-sp-action-row__body">
              <strong>Hoa hồng mở điểm</strong>
              <span>
                Đã kiếm {formatMoney(commissionTotal)}
                <sup className="am-money__unit">đ</sup>
              </span>
            </span>
            <ChevronRight size={18} className="am-sp-action-row__chev" />
          </button>
        </section>

        <section className="am-sp-recent-block">
          <div className="am-sp-section-head am-sp-section-head--pad">
            <h3>Hồ sơ gần đây</h3>
            <button type="button" onClick={() => navigate('/service-point/points')}>
              Xem tất cả
            </button>
          </div>

          <ul className="am-sp-recent-list">
            {MOCK_SERVICE_POINTS.slice(0, 3).map((point) => (
              <li key={point.id}>
                <button
                  type="button"
                  className={`am-sp-recent-row am-card am-sp-recent-row--${point.status}`}
                  onClick={() => navigate(`/service-point/points/${point.id}`)}
                >
                  <span className="am-sp-recent-row__icon" aria-hidden>
                    <MapPin size={20} strokeWidth={2} />
                  </span>
                  <span className="am-sp-recent-row__body">
                    <span className="am-sp-recent-row__top">
                      <strong>{point.name}</strong>
                      <DlsStatusBadge
                        label={STATUS_LABELS[point.status]}
                        variant={STATUS_VARIANT[point.status]}
                      />
                    </span>
                    <span className="am-sp-recent-row__addr">{point.address}</span>
                    <span className="am-sp-recent-row__meta">
                      <em>{point.code}</em>
                      {point.submittedAt && <em>Gửi {point.submittedAt}</em>}
                    </span>
                  </span>
                  <ChevronRight size={18} className="am-sp-recent-row__chev" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="am-sp-policy-card am-card">
          <div className="am-sp-policy-card__hero">
            <span className="am-sp-policy-card__icon" aria-hidden>
              <Gift size={22} strokeWidth={2} />
            </span>
            <div>
              <h3>Chính sách hoa hồng</h3>
              <p>
                Tối đa{' '}
                <strong>
                  {formatMoney(MAX_COMMISSION)}
                  <sup className="am-money__unit">đ</sup>
                </strong>{' '}
                / điểm kích hoạt
              </p>
            </div>
          </div>

          <ul className="am-sp-policy-tiers">
            {COMMISSION_POLICY.map((item, index) => {
              const Icon = POLICY_ICONS[index] ?? Gift;
              return (
                <li key={item.label} className="am-sp-policy-tier">
                  <span className="am-sp-policy-tier__icon" aria-hidden>
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="am-sp-policy-tier__body">
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </span>
                  <span className="am-sp-policy-tier__amount">
                    +{formatMoney(item.amount)}
                    <sup className="am-money__unit">đ</sup>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="am-sp-policy-payout">
            <Calendar size={16} strokeWidth={2} aria-hidden />
            <span>Chi trả ngày <strong>10</strong> hàng tháng cho kỳ trước</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicePointHubPage;
