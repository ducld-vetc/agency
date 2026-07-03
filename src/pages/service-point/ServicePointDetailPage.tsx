import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import {
  DlsBrandButton,
  DlsDetailRow,
  DlsStatusBadge,
  DlsTopNav,
} from '@dls/components';
import {
  MOCK_SERVICE_POINTS,
  STATUS_LABELS,
  STATUS_VARIANT,
} from '../../data/servicePointMock';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const ServicePointDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const point = MOCK_SERVICE_POINTS.find((p) => p.id === id);

  if (!point) {
    return (
      <div className="am-sp">
        <DlsTopNav title="Chi tiết hồ sơ" onBack={() => navigate('/service-point/points')} />
        <div className="am-sp__scroll">
          <div className="am-sp-empty am-card">
            <p>Không tìm thấy hồ sơ.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalCommission = point.commission
    ? point.commission.fixed +
      point.commission.turnoverBonus +
      point.commission.transactionBonus
    : 0;

  return (
    <div className="am-sp">
      <DlsTopNav title="Chi tiết hồ sơ" onBack={() => navigate('/service-point/points')} />

      <div className="am-sp__scroll">
        <section className="am-card am-sp-detail-hero">
          <DlsStatusBadge
            label={STATUS_LABELS[point.status]}
            variant={STATUS_VARIANT[point.status]}
          />
          <h2>{point.name}</h2>
          <p>{point.address}</p>
          <span className="am-sp-detail-hero__code">{point.code}</span>
        </section>

        {point.status === 'pending' && (
          <div className="am-sp-sla am-card">
            <strong>Thẩm định trong 48 giờ làm việc</strong>
            <p>Hồ sơ đang được xem xét. Bạn sẽ nhận thông báo khi có kết quả.</p>
          </div>
        )}

        {point.status === 'rejected' && point.rejectReason && (
          <div className="am-sp-alert am-card">
            <AlertCircle size={20} />
            <div>
              <strong>Lý do từ chối</strong>
              <p>{point.rejectReason}</p>
            </div>
          </div>
        )}

        <section className="am-card am-sp-timeline">
          <h3>Tiến trình hồ sơ</h3>
          <ol>
            {point.timeline.map((step) => (
              <li key={step.label} className={step.done ? 'am-sp-timeline__done' : ''}>
                <span className="am-sp-timeline__icon" aria-hidden>
                  {step.done ? (
                    <CheckCircle2 size={18} strokeWidth={2.25} />
                  ) : (
                    <Circle size={18} strokeWidth={2} />
                  )}
                </span>
                <div>
                  <strong>{step.label}</strong>
                  {step.at && <span>{step.at}</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="am-sp-info-section">
          <h3 className="am-sp-info-section__title">Thông tin địa điểm</h3>
          <div className="am-card am-sp-info-card">
            <DlsDetailRow label="Địa chỉ" value={point.address} multiline />
            <DlsDetailRow label="Khu vực" value={point.district} />
            <DlsDetailRow label="Diện tích" value={`${point.areaSqm} m²`} last />
          </div>
        </section>

        <section className="am-sp-info-section">
          <h3 className="am-sp-info-section__title">Chủ điểm</h3>
          <div className="am-card am-sp-info-card">
            <DlsDetailRow label="Họ tên" value={point.ownerName} last />
          </div>
        </section>

        {point.commission && (
          <section className="am-sp-info-section">
            <h3 className="am-sp-info-section__title">Hoa hồng điểm này</h3>
            <div className="am-card am-sp-commission-mini">
              <div className="am-sp-commission-mini__row">
                <span>Hoa hồng cố định</span>
                <strong>
                  {formatMoney(point.commission.fixed)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
              </div>
              <div className="am-sp-commission-mini__row">
                <span>Thưởng doanh thu tháng đầu</span>
                <strong>
                  {formatMoney(point.commission.turnoverBonus)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
              </div>
              <div className="am-sp-commission-mini__row">
                <span>Thưởng giao dịch tháng đầu</span>
                <strong>
                  {formatMoney(point.commission.transactionBonus)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
              </div>
              <div className="am-sp-commission-mini__total">
                <span>Tổng</span>
                <strong>
                  {formatMoney(totalCommission)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
              </div>
              <button
                type="button"
                className="am-sp-link-btn"
                onClick={() => navigate('/service-point/commission')}
              >
                Xem chi tiết hoa hồng
              </button>
            </div>
          </section>
        )}

        {point.status === 'rejected' && (
          <div className="am-sp-sticky-foot">
            <DlsBrandButton onClick={() => navigate('/service-point/register')}>
              Chỉnh sửa & gửi lại
            </DlsBrandButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePointDetailPage;
