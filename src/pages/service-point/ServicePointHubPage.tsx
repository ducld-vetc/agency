import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Calendar,
  ChevronRight,
  Gift,
  LifeBuoy,
  MapPin,
  PackageCheck,
  PlusCircle,
  Truck,
  Wallet,
  Wrench,
} from 'lucide-react';
import { DlsStatusBadge, DlsTopNav } from '@dls/components';
import {
  COMMISSION_POLICY,
  CONVERSION_COMMISSION,
  MOCK_SERVICE_POINTS,
  MONTHLY_CARE_POLICY,
  QS_PSV_INTRO,
  QS_PSV_POLICY,
  STATUS_LABELS,
  STATUS_VARIANT,
  sumCommission,
} from '../../data/servicePointMock';
import { getAverageCoverageSummary } from '../../utils/servicePointCoverage';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const POLICY_ICONS = [BadgeCheck, PackageCheck, LifeBuoy] as const;
const PSV_ICONS = [Wrench, Truck] as const;
const MAX_COMMISSION = COMMISSION_POLICY.reduce((sum, item) => sum + item.amount, 0);

const ServicePointHubPage: React.FC = () => {
  const navigate = useNavigate();

  const pendingCount = MOCK_SERVICE_POINTS.filter((p) => p.status === 'pending').length;
  const activatedCount = MOCK_SERVICE_POINTS.filter((p) => p.status === 'activated').length;
  const commissionTotal = MOCK_SERVICE_POINTS.reduce((sum, p) => {
    if (!p.commission) return sum;
    return sum + sumCommission(p.commission);
  }, 0);
  const averageCoverage = React.useMemo(
    () => getAverageCoverageSummary(MOCK_SERVICE_POINTS),
    [],
  );

  return (
    <div className="am-sp">
      <DlsTopNav title="Mở điểm quickservice" onBack={() => navigate('/')} />

      <div className="am-sp__scroll">
        <section className="am-sp-hero am-card">
          <p className="am-sp-hero__eyebrow">Chính sách phát triển điểm</p>
          <h2 className="am-sp-hero__title">Phát triển mạng lưới điểm dịch vụ VETC</h2>
          <p className="am-sp-hero__desc">
            Đăng ký hồ sơ, theo dõi thẩm định trong 48 giờ làm việc và nhận hoa hồng theo mốc
            mở điểm & vận hành.
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
                {averageCoverage && (
                  <span
                    className={`am-sp-action-row__badge am-sp-action-row__badge--${averageCoverage.level}`}
                  >
                    Phủ {averageCoverage.avgScorePercent}%
                  </span>
                )}
              </span>
              <span>
                Theo dõi trạng thái thẩm định & kích hoạt
                {averageCoverage
                  ? ` · Độ phủ TB ${averageCoverage.avgScorePercent}%`
                  : ''}
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
                Điểm mở tối đa{' '}
                <strong>
                  {formatMoney(MAX_COMMISSION)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
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

          <div className="am-sp-policy-extra">
            <div className="am-sp-policy-extra__row">
              <span>
                <strong>{CONVERSION_COMMISSION.label}</strong>
                <em>{CONVERSION_COMMISSION.note}</em>
              </span>
              <b>
                +{formatMoney(CONVERSION_COMMISSION.amount)}
                <sup className="am-money__unit">đ</sup>
              </b>
            </div>
            {MONTHLY_CARE_POLICY.map((item) => (
              <div key={item.label} className="am-sp-policy-extra__row">
                <span>
                  <strong>{item.label}</strong>
                  <em>{item.note}</em>
                </span>
                {item.amount > 0 ? (
                  <b>
                    +{formatMoney(item.amount)}
                    <sup className="am-money__unit">đ</sup>
                  </b>
                ) : (
                  <b>1–3%</b>
                )}
              </div>
            ))}
          </div>

          <div className="am-sp-policy-payout">
            <Calendar size={16} strokeWidth={2} aria-hidden />
            <span>Chi trả ngày <strong>10</strong> hàng tháng cho kỳ trước</span>
          </div>
        </section>

        <section className="am-sp-policy-card am-sp-policy-card--psv am-card">
          <div className="am-sp-policy-card__hero">
            <span className="am-sp-policy-card__icon am-sp-policy-card__icon--psv" aria-hidden>
              <LifeBuoy size={22} strokeWidth={2} />
            </span>
            <div>
              <h3>Chính sách điểm Quick Service</h3>
              <p className="am-sp-policy-card__psv-intro">{QS_PSV_INTRO}</p>
            </div>
          </div>

          <ul className="am-sp-policy-tiers">
            {QS_PSV_POLICY.map((item, index) => {
              const Icon = PSV_ICONS[index] ?? Wrench;
              return (
                <li key={item.label} className="am-sp-policy-tier">
                  <span className="am-sp-policy-tier__icon" aria-hidden>
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="am-sp-policy-tier__body">
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </span>
                  <span className="am-sp-policy-tier__amount am-sp-policy-tier__amount--stack">
                    <b>+{formatMoney(item.points)}</b>
                    <em>điểm Loyalty</em>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ServicePointHubPage;
