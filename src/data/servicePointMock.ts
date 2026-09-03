import type { PointLocation } from '../utils/servicePointCoverage';

export type ServicePointStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'activated';

export type ServicePointType = 'new' | 'conversion';

/** Phân loại hình điểm (xưởng / cửa hàng / lưu động) — khác với hình thức đăng ký new/conversion. */
export type ServicePointCategory = 'WORKSHOP' | 'STORE' | 'MOBILE';

export type CommissionPaymentStatus = 'calculated' | 'pending_payout' | 'paid';

export interface ServicePointRecord {
  id: string;
  code: string;
  name: string;
  address: string;
  district: string;
  areaSqm: number;
  ownerName: string;
  status: ServicePointStatus;
  pointType: ServicePointType;
  pointCategory: ServicePointCategory;
  contractSigned: boolean;
  assignedArea: string;
  assignedAreaLabel: string;
  location?: PointLocation;
  submittedAt?: string;
  reviewedAt?: string;
  activatedAt?: string;
  rejectReason?: string;
  timeline: { label: string; at?: string; done: boolean }[];
  commission?: {
    /** Mốc 1 — hoàn thành mở điểm QS + được duyệt (điểm mở mới) */
    openingBonus: number;
    /** Mốc 2 — ≥ 15 đơn thành công */
    ordersBonus: number;
    /** Mốc 3 — hoạt động cứu hộ đầu tiên */
    firstRescueBonus: number;
    /** Hoa hồng điểm chuyển đổi (nếu pointType = conversion) */
    conversionBonus?: number;
    /** Chăm sóc tháng — ≥ 30 đơn thành công/tháng */
    monthlyCareBonus?: number;
    ordersProgress: number;
    ordersTarget: number;
    firstRescueDone: boolean;
    /** Số tiền đã chi trả thực tế (≤ tổng ghi nhận) */
    paidAmount: number;
    paymentStatus: CommissionPaymentStatus;
    payoutDate?: string;
  };
}

/** Tổng hoa hồng đã ghi nhận trên 1 điểm */
export const sumCommission = (c: NonNullable<ServicePointRecord['commission']>) =>
  c.openingBonus +
  c.ordersBonus +
  c.firstRescueBonus +
  (c.conversionBonus ?? 0) +
  (c.monthlyCareBonus ?? 0);

/** Số tiền còn chờ chi trả */
export const pendingCommission = (c: NonNullable<ServicePointRecord['commission']>) =>
  Math.max(0, sumCommission(c) - c.paidAmount);

export const STATUS_LABELS: Record<ServicePointStatus, string> = {
  draft: 'Nháp',
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  activated: 'Đã kích hoạt',
};

export const STATUS_VARIANT: Record<
  ServicePointStatus,
  'warning' | 'success' | 'info' | 'neutral' | 'danger'
> = {
  draft: 'neutral',
  pending: 'warning',
  approved: 'info',
  rejected: 'danger',
  activated: 'success',
};

export const POINT_TYPE_LABELS: Record<ServicePointType, string> = {
  new: 'Điểm mở mới',
  conversion: 'Điểm chuyển đổi',
};

export const POINT_CATEGORY_LABELS: Record<ServicePointCategory, string> = {
  WORKSHOP: 'Xưởng dịch vụ',
  STORE: 'Cửa hàng',
  MOBILE: 'Điểm lưu động',
};

export const POINT_CATEGORY_OPTIONS: { value: ServicePointCategory; label: string }[] = [
  { value: 'WORKSHOP', label: POINT_CATEGORY_LABELS.WORKSHOP },
  { value: 'STORE', label: POINT_CATEGORY_LABELS.STORE },
  { value: 'MOBILE', label: POINT_CATEGORY_LABELS.MOBILE },
];

export const CONTRACT_LABELS = {
  signed: 'Đã ký hợp đồng',
  unsigned: 'Chưa ký HĐ',
} as const;

export const ASSIGNED_AREAS = [
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
  { value: 'hn', label: 'Hà Nội' },
] as const;

export const MOCK_SERVICE_POINTS: ServicePointRecord[] = [
  {
    id: 'sp-001',
    code: 'HS-2026-0042',
    name: 'Điểm VETC Nguyễn Văn Cừ',
    address: '245 Nguyễn Văn Cừ, P.4, Q.5',
    district: 'Quận 5, TP.HCM',
    areaSqm: 18,
    ownerName: 'Nguyễn Minh Tuấn',
    status: 'pending',
    pointType: 'new',
    pointCategory: 'STORE',
    contractSigned: false,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 10.7545, lng: 106.663, zoneType: 'urban' },
    submittedAt: '01/07/2026 09:15',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '01/07/2026 09:15', done: true },
      { label: 'Chờ thẩm định (≤ 48h làm việc)', done: true },
      { label: 'Đã duyệt', done: false },
      { label: 'Thiết lập & kích hoạt', done: false },
    ],
  },
  {
    id: 'sp-002',
    code: 'HS-2026-0031',
    name: 'Điểm VETC Lê Văn Việt',
    address: '12 Lê Văn Việt, P. Hiệp Phú',
    district: 'TP. Thủ Đức, TP.HCM',
    areaSqm: 25,
    ownerName: 'Trần Thị Hương',
    status: 'activated',
    pointType: 'conversion',
    pointCategory: 'WORKSHOP',
    contractSigned: true,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 10.8411, lng: 106.7725, zoneType: 'urban' },
    submittedAt: '15/05/2026 14:20',
    reviewedAt: '17/05/2026 10:00',
    activatedAt: '22/05/2026 16:45',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '15/05/2026 14:20', done: true },
      { label: 'Chờ thẩm định', at: '15/05/2026 14:20', done: true },
      { label: 'Đã duyệt', at: '17/05/2026 10:00', done: true },
      { label: 'Đã kích hoạt (GD đầu tiên)', at: '22/05/2026 16:45', done: true },
    ],
    commission: {
      openingBonus: 0,
      ordersBonus: 0,
      firstRescueBonus: 0,
      conversionBonus: 500_000,
      ordersProgress: 0,
      ordersTarget: 15,
      firstRescueDone: false,
      paidAmount: 500_000,
      paymentStatus: 'paid',
      payoutDate: '10/06/2026',
    },
  },
  {
    id: 'sp-003',
    code: 'HS-2026-0038',
    name: 'Điểm VETC Trường Chinh',
    address: '88 Trường Chinh, P. Tây Thạnh',
    district: 'Q. Tân Bình, TP.HCM',
    areaSqm: 12,
    ownerName: 'Lê Hoàng Nam',
    status: 'rejected',
    pointType: 'new',
    pointCategory: 'MOBILE',
    contractSigned: false,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 10.8012, lng: 106.6524, zoneType: 'urban' },
    submittedAt: '20/06/2026 11:30',
    reviewedAt: '22/06/2026 15:00',
    rejectReason: 'Diện tích thực tế chưa đạt tối thiểu 10m² theo ảnh hiện trạng.',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '20/06/2026 11:30', done: true },
      { label: 'Chờ thẩm định', at: '20/06/2026 11:30', done: true },
      { label: 'Từ chối', at: '22/06/2026 15:00', done: true },
    ],
  },
  {
    id: 'sp-005',
    code: 'HS-2026-0045',
    name: 'Điểm VETC Cao tốc Long Thành',
    address: 'Km 18+200, Cao tốc HCM–Long Thành–Dầu Giây',
    district: 'H. Long Thành, Đồng Nai (địa bàn HCM)',
    areaSqm: 30,
    ownerName: 'Võ Quốc Bảo',
    status: 'activated',
    pointType: 'new',
    pointCategory: 'STORE',
    contractSigned: true,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 10.795, lng: 106.92, zoneType: 'highway' },
    submittedAt: '05/06/2026 10:00',
    reviewedAt: '07/06/2026 09:00',
    activatedAt: '12/06/2026 14:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '05/06/2026 10:00', done: true },
      { label: 'Chờ thẩm định', at: '05/06/2026 10:00', done: true },
      { label: 'Đã duyệt', at: '07/06/2026 09:00', done: true },
      { label: 'Đã kích hoạt', at: '12/06/2026 14:00', done: true },
    ],
    commission: {
      openingBonus: 500_000,
      ordersBonus: 500_000,
      firstRescueBonus: 0,
      monthlyCareBonus: 200_000,
      ordersProgress: 18,
      ordersTarget: 15,
      firstRescueDone: false,
      paidAmount: 500_000,
      paymentStatus: 'pending_payout',
      payoutDate: '10/07/2026',
    },
  },
  {
    id: 'sp-006',
    code: 'HS-2026-0046',
    name: 'Điểm VETC Cao tốc Trung Lương',
    address: 'Km 42, Cao tốc HCM–Trung Lương',
    district: 'H. Bến Lức, Long An (địa bàn HCM)',
    areaSqm: 28,
    ownerName: 'Phan Thị Mai',
    status: 'approved',
    pointType: 'conversion',
    pointCategory: 'WORKSHOP',
    contractSigned: true,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 10.68, lng: 106.52, zoneType: 'highway' },
    submittedAt: '10/06/2026 11:00',
    reviewedAt: '12/06/2026 15:30',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '10/06/2026 11:00', done: true },
      { label: 'Chờ thẩm định', at: '10/06/2026 11:00', done: true },
      { label: 'Đã duyệt', at: '12/06/2026 15:30', done: true },
      { label: 'Chờ giao dịch đầu tiên để kích hoạt', done: true },
    ],
  },
  {
    id: 'sp-007',
    code: 'HS-2026-0047',
    name: 'Điểm VETC Củ Chi núi',
    address: 'Ấp Phú Hòa Đông, X. Phú Hòa Đông',
    district: 'H. Củ Chi, TP.HCM',
    areaSqm: 22,
    ownerName: 'Đặng Văn Khoa',
    status: 'activated',
    pointType: 'new',
    pointCategory: 'MOBILE',
    contractSigned: false,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 11.02, lng: 106.52, zoneType: 'mountain' },
    submittedAt: '01/05/2026 08:30',
    reviewedAt: '03/05/2026 10:00',
    activatedAt: '08/05/2026 16:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '01/05/2026 08:30', done: true },
      { label: 'Chờ thẩm định', at: '01/05/2026 08:30', done: true },
      { label: 'Đã duyệt', at: '03/05/2026 10:00', done: true },
      { label: 'Đã kích hoạt', at: '08/05/2026 16:00', done: true },
    ],
  },
  {
    id: 'sp-008',
    code: 'HS-2026-0048',
    name: 'Điểm VETC Cần Giờ',
    address: 'Đường Rừng Sác, H. Cần Giờ',
    district: 'H. Cần Giờ, TP.HCM',
    areaSqm: 20,
    ownerName: 'Lý Minh Châu',
    status: 'pending',
    pointType: 'new',
    pointCategory: 'STORE',
    contractSigned: false,
    assignedArea: 'hcm',
    assignedAreaLabel: 'TP. Hồ Chí Minh',
    location: { lat: 10.41, lng: 106.96, zoneType: 'mountain' },
    submittedAt: '18/06/2026 13:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '18/06/2026 13:00', done: true },
      { label: 'Chờ thẩm định (≤ 48h làm việc)', done: true },
      { label: 'Đã duyệt', done: false },
      { label: 'Thiết lập & kích hoạt', done: false },
    ],
  },
  {
    id: 'sp-004',
    code: 'HS-2026-0040',
    name: 'Điểm VETC Cầu Giấy',
    address: '56 Cầu Giấy, P. Quan Hoa',
    district: 'Q. Cầu Giấy, Hà Nội',
    areaSqm: 20,
    ownerName: 'Phạm Văn Đức',
    status: 'approved',
    pointType: 'conversion',
    pointCategory: 'WORKSHOP',
    contractSigned: true,
    assignedArea: 'hn',
    assignedAreaLabel: 'Hà Nội',
    location: { lat: 21.0332, lng: 105.7945, zoneType: 'urban' },
    submittedAt: '28/06/2026 08:00',
    reviewedAt: '30/06/2026 09:30',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '28/06/2026 08:00', done: true },
      { label: 'Chờ thẩm định', at: '28/06/2026 08:00', done: true },
      { label: 'Đã duyệt', at: '30/06/2026 09:30', done: true },
      { label: 'Chờ giao dịch đầu tiên để kích hoạt', done: true },
    ],
  },
  {
    id: 'sp-009',
    code: 'HS-2026-0049',
    name: 'Điểm VETC Hai Bà Trưng',
    address: '120 Bà Triệu, P. Lê Đại Hành',
    district: 'Q. Hai Bà Trưng, Hà Nội',
    areaSqm: 16,
    ownerName: 'Nguyễn Thu Hà',
    status: 'activated',
    pointType: 'conversion',
    pointCategory: 'STORE',
    contractSigned: true,
    assignedArea: 'hn',
    assignedAreaLabel: 'Hà Nội',
    location: { lat: 21.0115, lng: 105.849, zoneType: 'urban' },
    submittedAt: '02/06/2026 09:00',
    reviewedAt: '04/06/2026 11:00',
    activatedAt: '09/06/2026 15:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '02/06/2026 09:00', done: true },
      { label: 'Chờ thẩm định', at: '02/06/2026 09:00', done: true },
      { label: 'Đã duyệt', at: '04/06/2026 11:00', done: true },
      { label: 'Đã kích hoạt', at: '09/06/2026 15:00', done: true },
    ],
  },
  {
    id: 'sp-010',
    code: 'HS-2026-0050',
    name: 'Điểm VETC Cao tốc Pháp Vân',
    address: 'Km 5, Cao tốc Pháp Vân – Cầu Giẽ',
    district: 'H. Thanh Trì, Hà Nội',
    areaSqm: 32,
    ownerName: 'Hoàng Anh Tuấn',
    status: 'activated',
    pointType: 'new',
    pointCategory: 'MOBILE',
    contractSigned: true,
    assignedArea: 'hn',
    assignedAreaLabel: 'Hà Nội',
    location: { lat: 20.95, lng: 105.86, zoneType: 'highway' },
    submittedAt: '12/05/2026 10:30',
    reviewedAt: '14/05/2026 09:00',
    activatedAt: '20/05/2026 11:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '12/05/2026 10:30', done: true },
      { label: 'Chờ thẩm định', at: '12/05/2026 10:30', done: true },
      { label: 'Đã duyệt', at: '14/05/2026 09:00', done: true },
      { label: 'Đã kích hoạt', at: '20/05/2026 11:00', done: true },
    ],
  },
  {
    id: 'sp-011',
    code: 'HS-2026-0051',
    name: 'Điểm VETC Cao tốc Hà Nội – Hải Phòng',
    address: 'Km 22, Cao tốc HN–HP',
    district: 'H. Đông Anh, Hà Nội',
    areaSqm: 26,
    ownerName: 'Trịnh Quốc Huy',
    status: 'pending',
    pointType: 'new',
    pointCategory: 'WORKSHOP',
    contractSigned: false,
    assignedArea: 'hn',
    assignedAreaLabel: 'Hà Nội',
    location: { lat: 21.12, lng: 105.98, zoneType: 'highway' },
    submittedAt: '25/06/2026 14:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '25/06/2026 14:00', done: true },
      { label: 'Chờ thẩm định (≤ 48h làm việc)', done: true },
      { label: 'Đã duyệt', done: false },
      { label: 'Thiết lập & kích hoạt', done: false },
    ],
  },
  {
    id: 'sp-012',
    code: 'HS-2026-0052',
    name: 'Điểm VETC Ba Vì',
    address: 'Thôn Yên Bài, X. Yên Bài',
    district: 'H. Ba Vì, Hà Nội',
    areaSqm: 24,
    ownerName: 'Bùi Thanh Sơn',
    status: 'approved',
    pointType: 'conversion',
    pointCategory: 'STORE',
    contractSigned: true,
    assignedArea: 'hn',
    assignedAreaLabel: 'Hà Nội',
    location: { lat: 21.1, lng: 105.4, zoneType: 'mountain' },
    submittedAt: '08/06/2026 08:00',
    reviewedAt: '10/06/2026 16:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '08/06/2026 08:00', done: true },
      { label: 'Chờ thẩm định', at: '08/06/2026 08:00', done: true },
      { label: 'Đã duyệt', at: '10/06/2026 16:00', done: true },
      { label: 'Chờ giao dịch đầu tiên để kích hoạt', done: true },
    ],
  },
  {
    id: 'sp-013',
    code: 'HS-2026-0053',
    name: 'Điểm VETC Sóc Sơn',
    address: 'Xã Minh Phú, H. Sóc Sơn',
    district: 'H. Sóc Sơn, Hà Nội',
    areaSqm: 18,
    ownerName: 'Ngô Thị Lan',
    status: 'activated',
    pointType: 'new',
    pointCategory: 'MOBILE',
    contractSigned: false,
    assignedArea: 'hn',
    assignedAreaLabel: 'Hà Nội',
    location: { lat: 21.28, lng: 105.82, zoneType: 'mountain' },
    submittedAt: '20/05/2026 09:30',
    reviewedAt: '22/05/2026 10:00',
    activatedAt: '28/05/2026 13:00',
    timeline: [
      { label: 'Đăng ký hồ sơ', at: '20/05/2026 09:30', done: true },
      { label: 'Chờ thẩm định', at: '20/05/2026 09:30', done: true },
      { label: 'Đã duyệt', at: '22/05/2026 10:00', done: true },
      { label: 'Đã kích hoạt', at: '28/05/2026 13:00', done: true },
    ],
  },
];

/** Chính sách hoa hồng điểm mở mới — tối đa 1.500.000đ/điểm */
export const COMMISSION_POLICY = [
  {
    label: 'Hoàn thành mở điểm',
    amount: 500_000,
    note: 'Mở điểm Quick Service và được duyệt',
  },
  {
    label: '≥15 đơn thành công',
    amount: 500_000,
    note: 'Phát sinh tối thiểu 15 đơn thành công',
  },
  {
    label: 'Cứu hộ đầu tiên',
    amount: 500_000,
    note: 'Phát sinh hoạt động cứu hộ đầu tiên',
  },
];

/** Hoa hồng điểm chuyển đổi (điểm BH Tasco đang liên kết) */
export const CONVERSION_COMMISSION = {
  label: 'Điểm chuyển đổi',
  amount: 500_000,
  note: 'Hoàn thành chuyển đổi, tải app VETC Provider & Agency, xác nhận hoạt động',
};

/** Chăm sóc / hoa hồng hàng tháng */
export const MONTHLY_CARE_POLICY = [
  {
    label: 'Chăm sóc theo đơn',
    amount: 200_000,
    note: '≥ 30 đơn thành công/tháng (điểm mở mới)',
  },
  {
    label: 'Hoa hồng doanh thu bán hàng',
    amount: 0,
    note: '1% / 2% / 3% khi DT tháng > 10 / 15 / 30 triệu (chưa VAT)',
  },
];

/** Chính sách phí sẵn sàng vận hành (PSV) cho điểm Quick Service */
export const QS_PSV_INTRO = 'Hỗ trợ chi phí sẵn sàng vận hành theo đơn';

export const QS_PSV_POLICY = [
  {
    label: 'Xử lý tại chỗ',
    points: 50_000,
    note: 'Kích bình, Thay lốp, Tiếp nhiên liệu',
  },
  {
    label: 'Cẩu kéo',
    points: 100_000,
    note: 'Đâm, Lật, Tại nạn',
  },
];
