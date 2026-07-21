import type { PointLocation } from '../utils/servicePointCoverage';

export type ServicePointStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'activated';

export type ServicePointType = 'new' | 'conversion';

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
    fixed: number;
    turnoverBonus: number;
    transactionBonus: number;
    turnoverProgress: number;
    transactionProgress: number;
    turnoverTarget: number;
    transactionTarget: number;
    paymentStatus: CommissionPaymentStatus;
    payoutDate?: string;
  };
}

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
      fixed: 500_000,
      turnoverBonus: 200_000,
      transactionBonus: 100_000,
      turnoverProgress: 12_400_000,
      transactionProgress: 58,
      turnoverTarget: 10_000_000,
      transactionTarget: 50,
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
    id: 'sp-004',
    code: 'HS-2026-0040',
    name: 'Điểm VETC Cầu Giấy',
    address: '56 Cầu Giấy, P. Quan Hoa',
    district: 'Q. Cầu Giấy, Hà Nội',
    areaSqm: 20,
    ownerName: 'Phạm Văn Đức',
    status: 'approved',
    pointType: 'conversion',
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
];

export const COMMISSION_POLICY = [
  { label: 'Hoa hồng cố định', amount: 500_000, note: 'Khi điểm đã kích hoạt' },
  { label: 'Thưởng doanh thu tháng đầu', amount: 200_000, note: 'Doanh thu > 10.000.000 đ' },
  { label: 'Thưởng giao dịch tháng đầu', amount: 100_000, note: '> 50 giao dịch' },
];
