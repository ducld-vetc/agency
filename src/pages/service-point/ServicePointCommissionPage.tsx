import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DlsTopNav } from '@dls/components';
import {
  COMMISSION_POLICY,
  CONVERSION_COMMISSION,
  MOCK_SERVICE_POINTS,
  MONTHLY_CARE_POLICY,
  POINT_TYPE_LABELS,
  pendingCommission,
  sumCommission,
} from '../../data/servicePointMock';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const PAYMENT_LABELS = {
  calculated: 'Đã tính',
  pending_payout: 'Chờ chi trả',
  paid: 'Đã chi trả',
} as const;

const MAX_NEW_POINT = COMMISSION_POLICY.reduce((s, i) => s + i.amount, 0);

const ServicePointCommissionPage: React.FC = () => {
  const navigate = useNavigate();

  const activatedPoints = MOCK_SERVICE_POINTS.filter((p) => p.commission);
  const totalEarned = activatedPoints.reduce((sum, p) => sum + sumCommission(p.commission!), 0);
  const totalPaid = activatedPoints.reduce((sum, p) => sum + p.commission!.paidAmount, 0);
  const totalPending = activatedPoints.reduce(
    (sum, p) => sum + pendingCommission(p.commission!),
    0,
  );

  return (
    <div className="am-sp">
      <DlsTopNav title="Hoa hồng mở điểm" onBack={() => navigate('/service-point')} />

      <div className="am-sp__scroll">
        <section className="am-sp-commission-hero am-card">
          <span>Tổng hoa hồng ghi nhận</span>
          <strong>
            {formatMoney(totalEarned)}
            <sup className="am-money__unit">đ</sup>
          </strong>
          <div className="am-sp-commission-hero__sub">
            <div>
              <em>Đã chi trả</em>
              <b>
                {formatMoney(totalPaid)}
                <sup className="am-money__unit">đ</sup>
              </b>
            </div>
            <div>
              <em>Chờ chi trả</em>
              <b>
                {formatMoney(totalPending)}
                <sup className="am-money__unit">đ</sup>
              </b>
            </div>
          </div>
          <p className="am-sp-commission-hero__note">
            Chi trả ngày 10 hàng tháng cho kỳ trước. Chi tiết theo từng điểm bên dưới.
          </p>
        </section>

        <section className="am-card am-sp-policy am-sp-policy--compact">
          <h3>Quyền lợi điểm mở mới</h3>
          <p className="am-sp-policy__lead">
            Tối đa{' '}
            <strong>
              {formatMoney(MAX_NEW_POINT)}
              <sup className="am-money__unit">đ</sup>
            </strong>
            /điểm khi đủ 3 mốc
          </p>
          <ul>
            {COMMISSION_POLICY.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>
                  +{formatMoney(item.amount)}
                  <sup className="am-money__unit">đ</sup>
                </strong>
                <em>{item.note}</em>
              </li>
            ))}
          </ul>

          <div className="am-sp-policy-benefits">
            <h4>Quyền lợi khác</h4>
            <div className="am-sp-policy-benefits__row">
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
              <div key={item.label} className="am-sp-policy-benefits__row">
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
                  <b>1% / 2% / 3%</b>
                )}
              </div>
            ))}
          </div>
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
              const total = sumCommission(c);
              const pending = pendingCommission(c);
              const isConversion = point.pointType === 'conversion';
              const ordersPct = Math.min(100, (c.ordersProgress / c.ordersTarget) * 100);

              return (
                <li key={point.id} className="am-card am-sp-commission-card">
                  <div className="am-sp-commission-card__head">
                    <strong>{point.name}</strong>
                    <span className={`am-sp-pay-badge am-sp-pay-badge--${c.paymentStatus}`}>
                      {PAYMENT_LABELS[c.paymentStatus]}
                    </span>
                  </div>
                  <p className="am-sp-commission-card__type">
                    {POINT_TYPE_LABELS[point.pointType]}
                  </p>

                  <div className="am-sp-commission-card__rows">
                    {isConversion ? (
                      <div>
                        <span>Hoa hồng chuyển đổi</span>
                        <b>
                          {formatMoney(c.conversionBonus ?? 0)}
                          <sup className="am-money__unit">đ</sup>
                        </b>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span>Hoàn thành mở điểm</span>
                          <b>
                            {formatMoney(c.openingBonus)}
                            <sup className="am-money__unit">đ</sup>
                          </b>
                        </div>
                        <div>
                          <span>≥15 đơn thành công</span>
                          <b>
                            {formatMoney(c.ordersBonus)}
                            <sup className="am-money__unit">đ</sup>
                          </b>
                        </div>
                        <div>
                          <span>Cứu hộ đầu tiên</span>
                          <b>
                            {formatMoney(c.firstRescueBonus)}
                            <sup className="am-money__unit">đ</sup>
                          </b>
                        </div>
                        {(c.monthlyCareBonus ?? 0) > 0 && (
                          <div>
                            <span>Chăm sóc tháng</span>
                            <b>
                              {formatMoney(c.monthlyCareBonus!)}
                              <sup className="am-money__unit">đ</sup>
                            </b>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {!isConversion && (
                    <>
                      <div className="am-sp-progress">
                        <div className="am-sp-progress__label">
                          <span>Đơn thành công</span>
                          <em>
                            {c.ordersProgress} / {c.ordersTarget}
                          </em>
                        </div>
                        <div className="am-sp-progress__bar">
                          <span style={{ width: `${ordersPct}%` }} />
                        </div>
                      </div>

                      <div className="am-sp-progress">
                        <div className="am-sp-progress__label">
                          <span>Cứu hộ đầu tiên</span>
                          <em>{c.firstRescueDone ? 'Đã phát sinh' : 'Chưa phát sinh'}</em>
                        </div>
                        <div className="am-sp-progress__bar">
                          <span style={{ width: c.firstRescueDone ? '100%' : '0%' }} />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="am-sp-commission-card__settle">
                    <div>
                      <span>Tổng ghi nhận</span>
                      <b>
                        {formatMoney(total)}
                        <sup className="am-money__unit">đ</sup>
                      </b>
                    </div>
                    <div>
                      <span>Đã chi trả</span>
                      <b className="am-sp-commission-card__settle--paid">
                        {formatMoney(c.paidAmount)}
                        <sup className="am-money__unit">đ</sup>
                      </b>
                    </div>
                    <div>
                      <span>Chờ chi trả</span>
                      <b className="am-sp-commission-card__settle--pending">
                        {formatMoney(pending)}
                        <sup className="am-money__unit">đ</sup>
                      </b>
                    </div>
                    {c.payoutDate && (
                      <p className="am-sp-commission-card__settle-note">
                        {pending > 0
                          ? `Dự kiến chi trả: ${c.payoutDate}`
                          : `Đã chi trả: ${c.payoutDate}`}
                      </p>
                    )}
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
