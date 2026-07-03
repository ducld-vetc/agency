import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DlsTopNav } from '@dls/components';
import { COMMISSION_POLICY, MOCK_SERVICE_POINTS } from '../../data/servicePointMock';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const PAYMENT_LABELS = {
  calculated: 'Đã tính',
  pending_payout: 'Chờ chi trả',
  paid: 'Đã chi trả',
} as const;

const ServicePointCommissionPage: React.FC = () => {
  const navigate = useNavigate();

  const activatedPoints = MOCK_SERVICE_POINTS.filter((p) => p.commission);
  const totalEarned = activatedPoints.reduce((sum, p) => {
    const c = p.commission!;
    return sum + c.fixed + c.turnoverBonus + c.transactionBonus;
  }, 0);
  const pendingPayout = activatedPoints
    .filter((p) => p.commission?.paymentStatus === 'pending_payout')
    .reduce((sum, p) => {
      const c = p.commission!;
      return sum + c.fixed + c.turnoverBonus + c.transactionBonus;
    }, 0);

  return (
    <div className="am-sp">
      <DlsTopNav title="Hoa hồng mở điểm" onBack={() => navigate('/service-point')} />

      <div className="am-sp__scroll">
        <section className="am-sp-commission-hero am-card">
          <span>Tổng hoa hồng đã kiếm</span>
          <strong>
            {formatMoney(totalEarned)}
            <sup className="am-money__unit">đ</sup>
          </strong>
          <div className="am-sp-commission-hero__sub">
            <div>
              <em>Chờ chi trả</em>
              <b>
                {formatMoney(pendingPayout)}
                <sup className="am-money__unit">đ</sup>
              </b>
            </div>
            <div>
              <em>Đã chi trả</em>
              <b>
                {formatMoney(totalEarned - pendingPayout)}
                <sup className="am-money__unit">đ</sup>
              </b>
            </div>
          </div>
          <p className="am-sp-commission-hero__note">Chi trả ngày 10 hàng tháng cho kỳ trước.</p>
        </section>

        <section className="am-card am-sp-policy am-sp-policy--compact">
          <h3>Cơ cấu hoa hồng</h3>
          <ul>
            {COMMISSION_POLICY.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>
                  +{formatMoney(item.amount)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="am-sp-section-head am-sp-section-head--pad">
          <h3>Chi tiết theo điểm</h3>
        </section>

        {activatedPoints.length === 0 ? (
          <div className="am-sp-empty am-card">
            <p>Chưa có điểm nào kích hoạt để nhận hoa hồng.</p>
          </div>
        ) : (
          <ul className="am-sp-commission-list">
            {activatedPoints.map((point) => {
              const c = point.commission!;
              const total = c.fixed + c.turnoverBonus + c.transactionBonus;
              const turnoverPct = Math.min(100, (c.turnoverProgress / c.turnoverTarget) * 100);
              const txnPct = Math.min(100, (c.transactionProgress / c.transactionTarget) * 100);

              return (
                <li key={point.id} className="am-card am-sp-commission-card">
                  <div className="am-sp-commission-card__head">
                    <strong>{point.name}</strong>
                    <span className={`am-sp-pay-badge am-sp-pay-badge--${c.paymentStatus}`}>
                      {PAYMENT_LABELS[c.paymentStatus]}
                    </span>
                  </div>

                  <div className="am-sp-commission-card__rows">
                    <div>
                      <span>Hoa hồng cố định</span>
                      <b>
                        {formatMoney(c.fixed)}
                        <sup className="am-money__unit">đ</sup>
                      </b>
                    </div>
                    <div>
                      <span>Thưởng doanh thu</span>
                      <b>
                        {formatMoney(c.turnoverBonus)}
                        <sup className="am-money__unit">đ</sup>
                      </b>
                    </div>
                    <div>
                      <span>Thưởng giao dịch</span>
                      <b>
                        {formatMoney(c.transactionBonus)}
                        <sup className="am-money__unit">đ</sup>
                      </b>
                    </div>
                  </div>

                  <div className="am-sp-progress">
                    <div className="am-sp-progress__label">
                      <span>Doanh thu tháng đầu</span>
                      <em>
                        {formatMoney(c.turnoverProgress)} / {formatMoney(c.turnoverTarget)} đ
                      </em>
                    </div>
                    <div className="am-sp-progress__bar">
                      <span style={{ width: `${turnoverPct}%` }} />
                    </div>
                  </div>

                  <div className="am-sp-progress">
                    <div className="am-sp-progress__label">
                      <span>Số giao dịch tháng đầu</span>
                      <em>
                        {c.transactionProgress} / {c.transactionTarget}
                      </em>
                    </div>
                    <div className="am-sp-progress__bar">
                      <span style={{ width: `${txnPct}%` }} />
                    </div>
                  </div>

                  <div className="am-sp-commission-card__foot">
                    <span>
                      Tổng: {formatMoney(total)}
                      <sup className="am-money__unit">đ</sup>
                    </span>
                    {c.payoutDate && <span>Chi trả: {c.payoutDate}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServicePointCommissionPage;
