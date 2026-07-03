import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  Menu,
  Search,
} from 'lucide-react';
import { DlsLabel } from '@dls/components';
import DonutChart from '../components/DonutChart';
import RevenueBillIcon from '../components/RevenueBillIcon';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const MoneyValue: React.FC<{ amount: number; className?: string; showUnit?: boolean }> = ({
  amount,
  className,
  showUnit = true,
}) => (
  <span className={className}>
    {formatMoney(amount)}
    {showUnit && <sup className="am-money__unit">đ</sup>}
  </span>
);

type QuickAction = {
  label: string;
  lines: string[];
  icon: string;
  badge?: string;
  to?: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Rút tiền tài khoản',
    lines: ['Rút tiền', 'tài khoản'],
    icon: '/assets/action-icons/withdraw.png',
  },
  {
    label: 'Đăng ký ví VETC',
    lines: ['Đăng ký ví', 'VETC'],
    icon: '/assets/action-icons/wallet-vetc.png',
  },
  {
    label: 'Mở điểm dịch vụ VETC',
    lines: ['Mở điểm', 'dịch vụ VETC'],
    icon: '/assets/action-icons/open-vetc-service-point.png',
    badge: '/assets/action-icons/badge-moi.png',
    to: '/service-point',
  },
  {
    label: 'Quản lý Hồ sơ',
    lines: ['Quản lý', 'Hồ sơ'],
    icon: '/assets/action-icons/briefcase.png',
  },
  {
    label: 'My Loyalty',
    lines: ['My Loyalty'],
    icon: '/assets/action-icons/loyalty.png',
  },
  {
    label: 'Kho thẻ',
    lines: ['Kho thẻ'],
    icon: '/assets/action-icons/card-store.png',
  },
  {
    label: 'Biểu mẫu',
    lines: ['Biểu mẫu'],
    icon: '/assets/action-icons/forms.png',
  },
  {
    label: 'Đăng ký ví TKGT',
    lines: ['Đăng ký ví', 'TKGT'],
    icon: '/assets/action-icons/wallet-tkgt.png',
  },
];

const SERVICE_TABS = ['ETC', 'RSA', 'Tab'] as const;

const ETC_SERVICES = [
  { name: 'Dịch vụ ETC', price: '118.000 VND', commission: '+ 35%' },
  { name: 'Gói cứu hộ 24/7', price: '200.000 VND', commission: '+ 35%' },
];

const CHART_SEGMENTS = [
  { label: 'ETC', value: 9_000_000, color: '#3b82f6', callout: '9,000,000 đ' },
  { label: 'RSA', value: 1_000_000, color: '#ff8c2f', callout: '1,000,000 đ' },
  { label: 'TKNH', value: 10_000_000, color: '#25a55e', callout: '10,000,000 đ' },
  { label: 'Bảo hiểm', value: 2_000_000, color: '#8b5cf6', callout: '2,000,000 đ' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<(typeof SERVICE_TABS)[number]>('ETC');
  const [lookup, setLookup] = React.useState('');
  const [activeStat, setActiveStat] = React.useState(0);

  const statColumns = [
    { label: 'Doanh thu tích lũy', value: 22_000_000 },
    { label: 'Hoa hồng tích lũy', value: 22_000_000 },
    { label: 'Hoa hồng khả dụng', value: 22_000_000 },
  ];

  return (
    <div className="am-home">
      <div className="am-home__scroll">
        <section className="am-home__banner">
          <div className="am-home__banner-bg" aria-hidden />

          <header className="am-home__topbar">
            <button type="button" className="am-home__icon-btn" aria-label="Menu">
              <Menu size={20} strokeWidth={2} />
            </button>
            <div className="am-home__topbar-spacer" aria-hidden />
            <div className="am-home__topbar-actions">
              <button type="button" className="am-home__icon-btn" aria-label="Tìm kiếm">
                <Search size={20} strokeWidth={2} />
              </button>
              <button type="button" className="am-home__icon-btn" aria-label="Thông báo">
                <Bell size={20} strokeWidth={2} />
                <span className="am-home__badge">1</span>
              </button>
            </div>
          </header>
        </section>

        <div className="am-home__content">
          <section className="am-card am-revenue-card">
            <div className="am-revenue-card__primary">
              <span className="am-revenue-card__label">Doanh thu tháng này</span>
              <MoneyValue amount={22_000_000} className="am-revenue-card__value" />
            </div>

            <div className="am-revenue-card__split">
              <div className="am-revenue-card__divider" />
              <button
                type="button"
                className="am-revenue-card__more"
                aria-label="Xem chi tiết doanh thu"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="am-revenue-card__secondary">
              <RevenueBillIcon />
              <span className="am-revenue-card__commission-label">Hoa hồng tích lũy</span>
              <MoneyValue amount={2_000_000} className="am-revenue-card__commission-value" />
            </div>
          </section>

          <section className="am-card am-lookup-card">
            <DlsLabel>Tra cứu kích hoạt</DlsLabel>
            <div className="dls-input-wrap am-lookup-card__field">
              <span className="am-lookup-card__search-icon">
                <Search size={18} strokeWidth={2} />
              </span>
              <input
                className="dls-input am-lookup-card__input"
                placeholder="Nhập TKGT, Số giấy tờ, biển số,..."
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
              />
            </div>
            <button type="button" className="am-btn-dark dls-btn-full">
              Tra cứu
            </button>
          </section>

          <section className="am-card am-actions-card">
            <div className="am-actions-grid">
              {QUICK_ACTIONS.map(({ label, lines, icon, badge, to }) => (
                <button
                  key={label}
                  type="button"
                  className="am-action-item"
                  onClick={to ? () => navigate(to) : undefined}
                >
                  <span className="am-action-item__icon-wrap">
                    <img
                      className="am-action-item__icon"
                      src={icon}
                      width={40}
                      height={40}
                      alt=""
                      aria-hidden
                    />
                    {badge && (
                      <img
                        className="am-action-item__badge"
                        src={badge}
                        width={28}
                        height={14}
                        alt="Mới"
                      />
                    )}
                  </span>
                  <span className="am-action-item__label">
                    {lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="am-card am-services-card">
            <div className="am-service-tabs" role="tablist" aria-label="Dịch vụ">
              {SERVICE_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`am-service-tab ${activeTab === tab ? 'am-service-tab--on' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="am-service-list">
              {(activeTab === 'ETC' ? ETC_SERVICES : ETC_SERVICES).map((svc) => (
                <button key={svc.name} type="button" className="am-service-row">
                  <span className="am-service-row__logo">V</span>
                  <span className="am-service-row__body">
                    <strong>{svc.name}</strong>
                    <span>Giá từ: {svc.price}</span>
                  </span>
                  <span className="am-service-row__badge">{svc.commission}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="am-card am-chart-card">
            <div className="am-chart-card__head">
              <h2>Hoa hồng và doanh thu</h2>
              <p>Cập nhật từ 01/10/2025 - 01/10/2025</p>
            </div>

            <DonutChart
              segments={CHART_SEGMENTS}
              centerLabel="Doanh thu tích lũy"
              centerValue="22,000,000 đ"
            />

            <ul className="am-chart-legend">
              {CHART_SEGMENTS.map((seg) => (
                <li key={seg.label}>
                  <span style={{ background: seg.color }} />
                  {seg.label}
                </li>
              ))}
            </ul>

            <div className="am-chart-stats">
              {statColumns.map((col, i) => (
                <button
                  key={col.label}
                  type="button"
                  className={`am-chart-stat ${activeStat === i ? 'am-chart-stat--on' : ''}`}
                  onClick={() => setActiveStat(i)}
                >
                  <span>{col.label}</span>
                  <strong>{formatMoney(col.value)}đ</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="am-policy">
            <h2>Chính sách sản phẩm và hoa hồng</h2>
            <button type="button">Xem thêm</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
