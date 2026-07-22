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
    id: 'sp-005',
    code: 'HS-2026-0045',
    name: 'Điểm VETC Cao tốc Long Thành',
    address: 'Km 18+200, Cao tốc HCM–Long Thành–Dầu Giây',
    district: 'H. Long Thành, Đồng Nai (địa bàn HCM)',
    areaSqm: 30,
    ownerName: 'Võ Quốc Bảo',
    status: 'activated',
    pointType: 'new',
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

export const COMMISSION_POLICY = [
  { label: 'Hoa hồng cố định', amount: 500_000, note: 'Khi điểm đã kích hoạt' },
  { label: 'Thưởng doanh thu tháng đầu', amount: 200_000, note: 'Doanh thu > 10.000.000 đ' },
  { label: 'Thưởng giao dịch tháng đầu', amount: 100_000, note: '> 50 giao dịch' },
];
