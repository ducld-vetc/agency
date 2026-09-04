import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, MapPin, LocateFixed, X, ChevronRight, Plus, Pencil, Trash2, Truck } from 'lucide-react';
import {
  DlsBrandButton,
  DlsCheckbox,
  DlsMultiSelectField,
  DlsNeutralButton,
  DlsSelect,
  DlsSheetHandle,
  DlsTextField,
  DlsTopNav,
} from '@dls/components';
import { getDlsOverlayRoot } from '@dls/portal';
import { createPortal } from 'react-dom';
import { PointZoneType, ZONE_SPACING_KM } from '../../utils/servicePointCoverage';
import {
  POINT_CATEGORY_OPTIONS,
  type ServicePointCategory,
} from '../../data/servicePointMock';

type RescueVehicle = {
  id: string;
  vehicleType: string;
  capacity: string;
  licensePlate: string;
};

const emptyVehicleDraft = (): Omit<RescueVehicle, 'id'> => ({
  vehicleType: '',
  capacity: '',
  licensePlate: '',
});

const isVehicleComplete = (v: Pick<RescueVehicle, 'vehicleType' | 'capacity' | 'licensePlate'>) =>
  Boolean(v.vehicleType.trim() && v.capacity.trim() && v.licensePlate.trim());

const formatCapacity = (capacity: string) => {
  const value = capacity.trim();
  return /ton/i.test(value) ? value : `${value} ton`;
};

const formatVehicleLine = (v: Pick<RescueVehicle, 'vehicleType' | 'capacity' | 'licensePlate'>) =>
  `${v.licensePlate} · ${formatCapacity(v.capacity)} · ${v.vehicleType}`;

const STEPS = [
  'Loại đăng ký',
  'Địa điểm',
  'Chủ điểm',
  'Pháp lý & CSVC',
  'Ảnh hiện trạng',
  'Xác nhận',
] as const;

const POINT_TYPES = [
  {
    value: 'new',
    label: 'Điểm mở mới',
    description: 'Đăng ký điểm dịch vụ mới, chưa từng ký hợp đồng hợp tác với đơn vị trong tập đoàn Tasco.',
  },
  {
    value: 'conversion',
    label: 'Điểm chuyển đổi',
    description: 'Chuyển đổi/Bổ sung dịch vụ cung cấp cho điểm đã ký hợp đồng hợp tác với đơn vị trong tập đoàn Tasco.',
  },
] as const;

const ZONE_TYPES: {
  value: PointZoneType;
  label: string;
  range: string;
}[] = [
  {
    value: 'highway',
    label: ZONE_SPACING_KM.highway.label,
    range: `${ZONE_SPACING_KM.highway.min}–${ZONE_SPACING_KM.highway.max} km`,
  },
  {
    value: 'urban',
    label: ZONE_SPACING_KM.urban.label,
    range: `${ZONE_SPACING_KM.urban.min}–${ZONE_SPACING_KM.urban.max} km`,
  },
  {
    value: 'mountain',
    label: ZONE_SPACING_KM.mountain.label,
    range: `${ZONE_SPACING_KM.mountain.min}–${ZONE_SPACING_KM.mountain.max} km`,
  },
];

const PROVINCES: { value: string; label: string; wards: { value: string; label: string }[] }[] = [
  {
    value: 'hcm',
    label: 'TP. Hồ Chí Minh',
    wards: [
      { value: 'ben-thanh', label: 'Phường Bến Thành' },
      { value: 'sai-gon', label: 'Phường Sài Gòn' },
      { value: 'cho-lon', label: 'Phường Chợ Lớn' },
      { value: 'an-khanh', label: 'Phường An Khánh' },
      { value: 'thu-duc', label: 'Phường Thủ Đức' },
    ],
  },
  {
    value: 'hn',
    label: 'TP. Hà Nội',
    wards: [
      { value: 'hoan-kiem', label: 'Phường Hoàn Kiếm' },
      { value: 'ba-dinh', label: 'Phường Ba Đình' },
      { value: 'cau-giay', label: 'Phường Cầu Giấy' },
      { value: 'dong-da', label: 'Phường Đống Đa' },
      { value: 'ha-dong', label: 'Phường Hà Đông' },
    ],
  },
  {
    value: 'dn',
    label: 'TP. Đà Nẵng',
    wards: [
      { value: 'hai-chau', label: 'Phường Hải Châu' },
      { value: 'thanh-khe', label: 'Phường Thanh Khê' },
      { value: 'son-tra', label: 'Phường Sơn Trà' },
      { value: 'ngu-hanh-son', label: 'Phường Ngũ Hành Sơn' },
    ],
  },
  {
    value: 'dong-nai',
    label: 'Tỉnh Đồng Nai',
    wards: [
      { value: 'bien-hoa', label: 'Phường Biên Hòa' },
      { value: 'trang-bom', label: 'Xã Trảng Bom' },
      { value: 'long-thanh', label: 'Xã Long Thành' },
    ],
  },
];

const SUPPORT_SERVICE_GROUPS = [
  {
    label: 'Bán hàng',
    options: [
      { value: 'insurance', label: 'Bảo hiểm TNDS Tasco' },
      { value: 'rescue-package', label: 'Gói cứu hộ VETC' },
    ],
  },
  {
    label: 'Cẩu kéo',
    options: [{ value: 'towing', label: 'Xe gặp sự cố' }],
  },
  {
    label: 'Xử lý tại chỗ',
    options: [
      { value: 'battery', label: 'Kích bình ắc quy' },
      { value: 'tire', label: 'Xử lý lốp' },
      { value: 'fuel', label: 'Tiếp nhiên liệu' },
    ],
  },
] as const;

const RESCUE_VEHICLE_TYPES = [
  { value: 'Xe kéo cẩu', label: 'Xe kéo cẩu' },
  { value: 'Xe sàn trượt', label: 'Xe sàn trượt' },
  { value: 'Xe cẩu quay', label: 'Xe cẩu quay' },
  { value: '<= 2.5 tấn', label: '<= 2.5 tấn' },
  { value: '<= 1.4 tấn', label: '<= 1.4 tấn' },
] as const;

const getSupportServiceLabel = (value: string) => {
  for (const group of SUPPORT_SERVICE_GROUPS) {
    const match = group.options.find((opt) => opt.value === value);
    if (match) return match.label;
  }
  return '—';
};

const getSupportServicesLabel = (values: string[]) =>
  values.length ? values.map((value) => getSupportServiceLabel(value)).join(', ') : '—';

const getPointTypeLabel = (value: string) =>
  POINT_TYPES.find((item) => item.value === value)?.label ?? '—';

const getPointCategoryLabel = (value: string) =>
  POINT_CATEGORY_OPTIONS.find((item) => item.value === value)?.label ?? '—';

const getZoneTypeLabel = (value: string) =>
  ZONE_TYPES.find((item) => item.value === value)?.label ?? '—';

const FACILITY_CHECKS = [
  'Biển hiệu đúng mẫu công ty',
  'Bàn ghế phục vụ khách hàng',
  'Kết nối internet ổn định',
] as const;

const PHOTO_SLOTS = [
  'Mặt tiền điểm',
  'Không gian trong',
  'Biển hiệu',
  'Công cụ dụng cụ',
] as const;

/* Ảnh mẫu (demo) cho trạng thái đã chọn ảnh — SVG mô phỏng mặt tiền cửa hàng. */
const DEMO_PHOTO = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120'>
    <defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#8ec5e6'/><stop offset='1' stop-color='#e6f2ea'/>
    </linearGradient></defs>
    <rect width='160' height='120' fill='url(#sky)'/>
    <circle cx='130' cy='26' r='13' fill='#ffd54a'/>
    <rect x='0' y='96' width='160' height='24' fill='#c9d6cd'/>
    <rect x='28' y='50' width='104' height='50' fill='#ffffff'/>
    <rect x='24' y='40' width='112' height='14' rx='2' fill='#25a55e'/>
    <rect x='44' y='66' width='22' height='34' fill='#2f6b4a'/>
    <rect x='84' y='64' width='40' height='24' fill='#bfe3cd'/>
    <rect x='84' y='64' width='40' height='24' fill='none' stroke='#25a55e' stroke-width='2'/>
  </svg>`,
)}`;

const MAP_BASE_LAT = 10.762622;
const MAP_BASE_LNG = 106.660172;
const MAP_SPAN = 0.02;

const ServicePointRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [pin, setPin] = React.useState<{ x: number; y: number } | null>(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const [draftPin, setDraftPin] = React.useState<{ x: number; y: number } | null>(null);
  const [draftLatLng, setDraftLatLng] = React.useState('');
  const [vehicleSheetOpen, setVehicleSheetOpen] = React.useState(false);
  const [editingVehicleId, setEditingVehicleId] = React.useState<string | null>(null);
  const [vehicleDraft, setVehicleDraft] = React.useState(emptyVehicleDraft);

  const [form, setForm] = React.useState({
    pointType: '',
    zoneType: '' as PointZoneType | '',
    pointCategory: '' as ServicePointCategory | '',
    pointName: '',
    address: '',
    province: '',
    ward: '',
    area: '',
    latLng: '',
    supportServices: [] as string[],
    rescueVehicles: [] as RescueVehicle[],
    locationNote: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerId: '',
    businessLicense: '',
    taxCode: '',
    bankName: '',
    bankAccount: '',
    bankHolder: '',
    facilities: [] as string[],
    photos: { 'Mặt tiền điểm': DEMO_PHOTO } as Record<string, string>,
    agree: false,
  });

  const update = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const needsRescueVehicles = form.supportServices.includes('towing');

  const handleServicesConfirm = (draft: string[]) => {
    update({
      supportServices: draft,
      ...(draft.includes('towing') ? {} : { rescueVehicles: [] }),
    });
  };

  const openAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleDraft(emptyVehicleDraft());
    setVehicleSheetOpen(true);
  };

  const openEditVehicle = (vehicle: RescueVehicle) => {
    setEditingVehicleId(vehicle.id);
    setVehicleDraft({
      vehicleType: vehicle.vehicleType,
      capacity: vehicle.capacity,
      licensePlate: vehicle.licensePlate,
    });
    setVehicleSheetOpen(true);
  };

  const closeVehicleSheet = () => {
    setVehicleSheetOpen(false);
    setEditingVehicleId(null);
    setVehicleDraft(emptyVehicleDraft());
  };

  const saveVehicleDraft = (andContinue: boolean) => {
    if (!isVehicleComplete(vehicleDraft)) return;

    const nextVehicle: RescueVehicle = {
      id: editingVehicleId ?? `rv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      vehicleType: vehicleDraft.vehicleType,
      capacity: vehicleDraft.capacity.trim(),
      licensePlate: vehicleDraft.licensePlate.trim().toUpperCase(),
    };

    setForm((prev) => ({
      ...prev,
      rescueVehicles: editingVehicleId
        ? prev.rescueVehicles.map((item) => (item.id === editingVehicleId ? nextVehicle : item))
        : [...prev.rescueVehicles, nextVehicle],
    }));

    if (andContinue && !editingVehicleId) {
      setEditingVehicleId(null);
      setVehicleDraft(emptyVehicleDraft());
      return;
    }

    closeVehicleSheet();
  };

  const removeVehicle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      rescueVehicles: prev.rescueVehicles.filter((item) => item.id !== id),
    }));
  };

  const vehicleDraftValid = isVehicleComplete(vehicleDraft);

  const formatCoords = (lat: number, lng: number) => `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  const openMapPicker = () => {
    setDraftPin(pin);
    setDraftLatLng(form.latLng);
    setMapOpen(true);
  };

  const handleDraftPick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const ry = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    setDraftPin({ x: rx * 100, y: ry * 100 });
    const lat = MAP_BASE_LAT + (0.5 - ry) * MAP_SPAN;
    const lng = MAP_BASE_LNG + (rx - 0.5) * MAP_SPAN;
    setDraftLatLng(formatCoords(lat, lng));
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setDraftPin({ x: 50, y: 50 });
      setDraftLatLng(formatCoords(MAP_BASE_LAT, MAP_BASE_LNG));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDraftPin({ x: 50, y: 50 });
        setDraftLatLng(formatCoords(latitude, longitude));
      },
      () => {
        setDraftPin({ x: 50, y: 50 });
        setDraftLatLng(formatCoords(MAP_BASE_LAT, MAP_BASE_LNG));
      },
      { enableHighAccuracy: true },
    );
  };

  const confirmMapPicker = () => {
    setPin(draftPin);
    update({ latLng: draftLatLng });
    setMapOpen(false);
  };

  const toggleFacility = (label: string) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(label)
        ? prev.facilities.filter((f) => f !== label)
        : [...prev.facilities, label],
    }));
  };

  const handlePhoto = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photos: { ...prev.photos, [label]: url } }));
    e.target.value = '';
  };

  const removePhoto = (label: string) => {
    setForm((prev) => {
      const next = { ...prev.photos };
      delete next[label];
      return { ...prev, photos: next };
    });
  };

  const renderUploadSlot = (label: string) => {
    const url = form.photos[label];
    return (
      <label
        key={label}
        className={`am-sp-upload-slot ${url ? 'am-sp-upload-slot--on' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          className="am-sp-upload-input"
          onChange={(e) => handlePhoto(label, e)}
        />
        {url ? (
          <>
            <img src={url} alt={label} className="am-sp-upload-slot__img" />
            <span className="am-sp-upload-slot__caption">{label}</span>
            <span className="am-sp-upload-slot__check" aria-hidden>
              <Check size={13} strokeWidth={3} />
            </span>
            <span
              className="am-sp-upload-slot__remove"
              role="button"
              aria-label={`Xoá ảnh ${label}`}
              onClick={(e) => {
                e.preventDefault();
                removePhoto(label);
              }}
            >
              <X size={12} strokeWidth={2.5} />
            </span>
          </>
        ) : (
          <>
            <Camera size={22} />
            <span>{label}</span>
          </>
        )}
      </label>
    );
  };

  const canNext = () => {
    if (step === 0) return Boolean(form.pointType && form.zoneType);
    if (step === 1) {
      const vehiclesOk = !needsRescueVehicles || form.rescueVehicles.length > 0;
      return (
        form.pointCategory &&
        form.pointName.trim() &&
        form.latLng.trim() &&
        form.province.trim() &&
        form.ward.trim() &&
        Number(form.area) >= 10 &&
        vehiclesOk
      );
    }
    if (step === 2) return form.ownerName.trim() && form.ownerPhone.trim() && form.ownerId.trim();
    if (step === 3) return form.facilities.length === FACILITY_CHECKS.length;
    if (step === 4) return PHOTO_SLOTS.filter((l) => form.photos[l]).length >= 3;
    if (step === 5) return form.agree;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="am-sp">
        <DlsTopNav title="Đăng ký điểm mới" onBack={() => navigate('/service-point')} />
        <div className="am-sp__scroll am-sp__scroll--center">
          <div className="am-sp-success am-card">
            <span className="am-sp-success__icon">
              <Check size={32} strokeWidth={2.5} />
            </span>
            <h2>Đã gửi hồ sơ thành công</h2>
            <p>
              Mã hồ sơ <strong>HS-2026-0043</strong>. Thẩm định trong tối đa 48 giờ làm việc.
            </p>
            <DlsBrandButton onClick={() => navigate('/service-point/points')}>
              Xem danh sách hồ sơ
            </DlsBrandButton>
            <DlsNeutralButton onClick={() => navigate('/service-point')}>
              Về trang chính
            </DlsNeutralButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="am-sp">
      <DlsTopNav title="Đăng ký điểm mới" onBack={() => navigate('/service-point')} />

      <div className="am-sp-stepper" aria-label="Tiến trình đăng ký">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`am-sp-stepper__item ${i === step ? 'am-sp-stepper__item--on' : ''} ${i < step ? 'am-sp-stepper__item--done' : ''}`}
          >
            <span>{i < step ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
            <em>{label}</em>
          </div>
        ))}
      </div>

      <div className="am-sp__scroll">
        {step === 0 && (
          <section className="am-card am-sp-form">
            <h3>Loại đăng ký</h3>
            <p className="am-sp-form__hint">Chọn loại hình đăng ký phù hợp với điểm dịch vụ của bạn.</p>
            <div className="am-sp-point-type" role="radiogroup" aria-label="Loại đăng ký">
              {POINT_TYPES.map((item) => {
                const selected = form.pointType === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`am-sp-point-type__item${selected ? ' am-sp-point-type__item--on' : ''}`}
                    onClick={() => update({ pointType: item.value })}
                  >
                    <span className="am-sp-point-type__radio" aria-hidden>
                      {selected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="am-sp-point-type__body">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="am-sp-zone-field">
              <p className="am-sp-form__hint am-sp-zone-field__hint">
                Loại khu vực điểm <span className="dls-required">*</span>
              </p>
              <div className="am-sp-zone-type" role="radiogroup" aria-label="Loại khu vực điểm">
                {ZONE_TYPES.map((item) => {
                  const selected = form.zoneType === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`am-sp-zone-type__item${selected ? ' am-sp-zone-type__item--on' : ''}`}
                      onClick={() => update({ zoneType: item.value })}
                    >
                      {selected && (
                        <span className="am-sp-zone-type__check" aria-hidden>
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                      <strong>{item.label}</strong>
                      <small>{item.range}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="am-card am-sp-form">
            <h3>Thông tin địa điểm</h3>
            <DlsSelect
              label="Phân loại điểm"
              required
              value={form.pointCategory}
              onChange={(v) => update({ pointCategory: v as ServicePointCategory })}
              options={POINT_CATEGORY_OPTIONS}
              placeholder="Chọn phân loại điểm"
            />
            <DlsTextField
              label="Tên điểm"
              required
              value={form.pointName}
              onChange={(v) => update({ pointName: v })}
              placeholder="VD: Điểm VETC Nguyễn Văn Cừ"
            />
            <div className="dls-field">
              <label className="dls-label">
                Vị trí trên bản đồ<span className="dls-required">*</span>
              </label>
              <button type="button" className="am-sp-map-trigger" onClick={openMapPicker}>
                <span
                  className={`am-sp-map-trigger__icon${form.latLng ? ' am-sp-map-trigger__icon--on' : ''}`}
                  aria-hidden
                >
                  <MapPin size={20} strokeWidth={2.25} />
                </span>
                <span className="am-sp-map-trigger__body">
                  {form.latLng ? (
                    <>
                      <strong>Đã ghim vị trí</strong>
                      <small>{form.latLng}</small>
                    </>
                  ) : (
                    <>
                      <strong>Chọn vị trí trên bản đồ</strong>
                      <small>Mở bản đồ toàn màn hình để ghim chính xác</small>
                    </>
                  )}
                </span>
                <ChevronRight size={18} className="am-sp-map-trigger__chev" aria-hidden />
              </button>
            </div>
            <DlsTextField
              label="Địa chỉ chi tiết (số nhà, tên đường)"
              value={form.address}
              onChange={(v) => update({ address: v })}
              placeholder="Bổ sung số nhà, tên đường cho tài xế dễ tìm"
            />
            <DlsSelect
              label="Tỉnh / Thành phố"
              required
              value={form.province}
              onChange={(v) => update({ province: v, ward: '' })}
              options={PROVINCES.map((p) => ({ value: p.value, label: p.label }))}
              placeholder="Chọn Tỉnh / TP"
            />
            <DlsSelect
              label="Xã / Phường"
              required
              value={form.ward}
              onChange={(v) => update({ ward: v })}
              options={
                PROVINCES.find((p) => p.value === form.province)?.wards ?? []
              }
              placeholder={form.province ? 'Chọn Xã / Phường' : 'Chọn Tỉnh / TP trước'}
            />
            <DlsTextField
              label="Diện tích (m²)"
              required
              value={form.area}
              onChange={(v) => update({ area: v.replace(/\D/g, '') })}
              placeholder="Tối thiểu 10 m²"
            />
            <DlsMultiSelectField
              label="Dịch vụ hỗ trợ"
              value={form.supportServices}
              onConfirm={handleServicesConfirm}
              groups={SUPPORT_SERVICE_GROUPS.map((group) => ({
                label: group.label,
                options: group.options.map((opt) => ({ value: opt.value, label: opt.label })),
              }))}
              placeholder="Chọn dịch vụ hỗ trợ"
              sheetTitle="Dịch vụ hỗ trợ"
            />
            {needsRescueVehicles && (
              <div className="dls-field am-sp-vehicle-field">
                <div className="am-sp-vehicle-field__head">
                  <label className="dls-label am-sp-vehicle-field__label">
                    Xe cứu hộ<span className="dls-required">*</span>
                  </label>
                  {form.rescueVehicles.length > 0 && (
                    <span className="am-sp-vehicle-field__badge">
                      {form.rescueVehicles.length} xe
                    </span>
                  )}
                </div>

                {form.rescueVehicles.length === 0 ? (
                  <div className="am-sp-vehicle-empty">
                    <span className="am-sp-vehicle-empty__icon" aria-hidden>
                      <Truck size={22} strokeWidth={2} />
                    </span>
                    <p>Đã chọn Cẩu kéo — thêm ít nhất 1 xe cứu hộ. Có thể thêm nhiều xe.</p>
                    <button type="button" className="am-sp-vehicle-add" onClick={openAddVehicle}>
                      <Plus size={16} strokeWidth={2.5} />
                      Thêm xe cứu hộ
                    </button>
                  </div>
                ) : (
                  <>
                    <ul className="am-sp-vehicle-list">
                      {form.rescueVehicles.map((vehicle, index) => (
                        <li key={vehicle.id} className="am-sp-vehicle-list__item">
                          <span className="am-sp-vehicle-list__icon" aria-hidden>
                            {index + 1}
                          </span>
                          <div className="am-sp-vehicle-list__body">
                            <div className="am-sp-vehicle-list__title">
                              <strong>{vehicle.licensePlate}</strong>
                            </div>
                            <div className="am-sp-vehicle-list__meta">
                              <span className="am-sp-vehicle-list__chip">
                                {formatCapacity(vehicle.capacity)}
                              </span>
                              <span className="am-sp-vehicle-list__chip">
                                {vehicle.vehicleType}
                              </span>
                            </div>
                          </div>
                          <div className="am-sp-vehicle-list__actions">
                            <button
                              type="button"
                              className="am-sp-vehicle-list__icon-btn"
                              aria-label={`Sửa xe ${vehicle.licensePlate || index + 1}`}
                              onClick={() => openEditVehicle(vehicle)}
                            >
                              <Pencil size={15} strokeWidth={2.25} />
                            </button>
                            <button
                              type="button"
                              className="am-sp-vehicle-list__icon-btn am-sp-vehicle-list__icon-btn--danger"
                              aria-label={`Xóa xe ${vehicle.licensePlate || index + 1}`}
                              onClick={() => removeVehicle(vehicle.id)}
                            >
                              <Trash2 size={15} strokeWidth={2.25} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className="am-sp-vehicle-add" onClick={openAddVehicle}>
                      <Plus size={16} strokeWidth={2.5} />
                      Thêm xe khác
                    </button>
                  </>
                )}
              </div>
            )}
            <DlsTextField
              label="Mô tả vị trí"
              multiline
              rows={4}
              value={form.locationNote}
              onChange={(v) => update({ locationNote: v })}
              placeholder="Gần đường lớn, khu dân cư đông, gần ngã tư, thuận tiện xe cứu hộ ra vào..."
            />
          </section>
        )}

        {step === 2 && (
          <section className="am-card am-sp-form">
            <h3>Thông tin chủ điểm</h3>
            <DlsTextField
              label="Họ và tên"
              required
              value={form.ownerName}
              onChange={(v) => update({ ownerName: v })}
            />
            <DlsTextField
              label="Số điện thoại"
              required
              value={form.ownerPhone}
              onChange={(v) => update({ ownerPhone: v })}
              placeholder="09xxxxxxxx"
            />
            <DlsTextField
              label="Email"
              value={form.ownerEmail}
              onChange={(v) => update({ ownerEmail: v })}
              placeholder="ten@email.com"
            />
            <DlsTextField
              label="Số CCCD"
              required
              value={form.ownerId}
              onChange={(v) => update({ ownerId: v })}
              placeholder="12 số"
            />
            <div className="am-sp-upload-grid">
              {renderUploadSlot('CCCD mặt trước')}
              {renderUploadSlot('CCCD mặt sau')}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="am-card am-sp-form">
            <h3>Pháp lý & cơ sở vật chất</h3>
            <DlsTextField
              label="Giấy phép kinh doanh (nếu có)"
              value={form.businessLicense}
              onChange={(v) => update({ businessLicense: v })}
              placeholder="Số GPKD"
            />
            <DlsTextField
              label="Mã số thuế (MST)"
              value={form.taxCode}
              onChange={(v) => update({ taxCode: v.replace(/[^\d-]/g, '') })}
              placeholder="10 hoặc 13 số"
            />
            <p className="am-sp-form__hint">Thông tin ngân hàng nhận thanh toán:</p>
            <DlsTextField
              label="Ngân hàng"
              value={form.bankName}
              onChange={(v) => update({ bankName: v })}
              placeholder="VD: Vietcombank"
            />
            <DlsTextField
              label="Số tài khoản"
              value={form.bankAccount}
              onChange={(v) => update({ bankAccount: v.replace(/\D/g, '') })}
              placeholder="Số tài khoản ngân hàng"
            />
            <DlsTextField
              label="Chủ tài khoản"
              value={form.bankHolder}
              onChange={(v) => update({ bankHolder: v })}
              placeholder="Tên chủ tài khoản"
            />
            <p className="am-sp-form__hint">Ảnh giấy phép kinh doanh:</p>
            <div className="am-sp-upload-grid am-sp-upload-grid--2col">
              {renderUploadSlot('Giấy phép mặt trước')}
              {renderUploadSlot('Giấy phép mặt sau')}
            </div>
            <p className="am-sp-form__hint">Xác nhận điểm đáp ứng các điều kiện sau:</p>
            {FACILITY_CHECKS.map((label) => (
              <DlsCheckbox
                key={label}
                label={label}
                checked={form.facilities.includes(label)}
                onChange={() => toggleFacility(label)}
              />
            ))}
          </section>
        )}

        {step === 4 && (
          <section className="am-card am-sp-form">
            <h3>Ảnh hiện trạng</h3>
            <p className="am-sp-form__hint">Tải ảnh thực tế của điểm (tối thiểu 3 ảnh).</p>
            <div className="am-sp-upload-grid am-sp-upload-grid--2col">
              {PHOTO_SLOTS.map((label) => renderUploadSlot(label))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="am-card am-sp-form">
            <h3>Xem lại & gửi hồ sơ</h3>
            <dl className="am-sp-review">
              <div>
                <dt>Loại đăng ký</dt>
                <dd>{getPointTypeLabel(form.pointType)}</dd>
              </div>
              <div>
                <dt>Loại khu vực</dt>
                <dd>{getZoneTypeLabel(form.zoneType)}</dd>
              </div>
              <div>
                <dt>Phân loại điểm</dt>
                <dd>{getPointCategoryLabel(form.pointCategory)}</dd>
              </div>
              <div>
                <dt>Tên điểm</dt>
                <dd>{form.pointName || '—'}</dd>
              </div>
              <div>
                <dt>Dịch vụ hỗ trợ</dt>
                <dd>{getSupportServicesLabel(form.supportServices)}</dd>
              </div>
              {needsRescueVehicles && (
                <div>
                  <dt>Xe cứu hộ</dt>
                  <dd>
                    {form.rescueVehicles.length
                      ? form.rescueVehicles.map((v) => (
                          <React.Fragment key={v.id}>
                            {formatVehicleLine(v)}
                            <br />
                          </React.Fragment>
                        ))
                      : '—'}
                  </dd>
                </div>
              )}
              <div>
                <dt>Toạ độ (bản đồ)</dt>
                <dd>{form.latLng || '—'}</dd>
              </div>
              <div>
                <dt>Địa chỉ chi tiết</dt>
                <dd>{form.address || '—'}</dd>
              </div>
              <div>
                <dt>Khu vực</dt>
                <dd>
                  {(() => {
                    const p = PROVINCES.find((x) => x.value === form.province);
                    const w = p?.wards.find((x) => x.value === form.ward);
                    if (!p) return '—';
                    return w ? `${w.label}, ${p.label}` : p.label;
                  })()}
                </dd>
              </div>
              <div>
                <dt>Diện tích</dt>
                <dd>{form.area ? `${form.area} m²` : '—'}</dd>
              </div>
              <div>
                <dt>Chủ điểm</dt>
                <dd>{form.ownerName || '—'}</dd>
              </div>
              <div>
                <dt>Số ảnh đính kèm</dt>
                <dd>{Object.keys(form.photos).length} ảnh</dd>
              </div>
            </dl>
            <DlsCheckbox
              label="Tôi xác nhận thông tin chính xác và đồng ý chính sách phát triển điểm dịch vụ"
              checked={form.agree}
              onChange={(v) => update({ agree: v })}
            />
          </section>
        )}

        <div className="am-sp-form-actions">
          {step > 0 && (
            <DlsNeutralButton size="sm" fullWidth={false} onClick={() => setStep((s) => s - 1)}>
              Quay lại
            </DlsNeutralButton>
          )}
          {step < STEPS.length - 1 ? (
            <DlsBrandButton disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
              Tiếp tục
            </DlsBrandButton>
          ) : (
            <DlsBrandButton disabled={!canNext()} onClick={handleSubmit}>
              Gửi hồ sơ
            </DlsBrandButton>
          )}
        </div>
      </div>

      {vehicleSheetOpen &&
        createPortal(
          <div
            className="dls-sheet-overlay"
            role="dialog"
            aria-modal
            aria-label={editingVehicleId ? 'Sửa xe cứu hộ' : 'Thêm xe cứu hộ'}
            onClick={closeVehicleSheet}
          >
            <div
              className="dls-sheet am-sp-towing-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <DlsSheetHandle />
              <div className="dls-sheet-header">
                <div className="dls-sheet-header-row">
                  <h2 className="dls-sheet-title">
                    {editingVehicleId ? 'Sửa xe cứu hộ' : 'Thêm xe cứu hộ'}
                  </h2>
                  <button
                    type="button"
                    className="dls-sheet-close"
                    onClick={closeVehicleSheet}
                    aria-label="Đóng"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="dls-sheet-body dls-sheet-body--form">
                {!editingVehicleId && form.rescueVehicles.length > 0 && (
                  <p className="am-sp-form__hint">
                    Đã có {form.rescueVehicles.length} xe. Điền thông tin để thêm xe tiếp theo.
                  </p>
                )}
                <DlsSelect
                  label="Loại xe cứu hộ"
                  required
                  value={vehicleDraft.vehicleType}
                  onChange={(v) => setVehicleDraft((prev) => ({ ...prev, vehicleType: v }))}
                  options={RESCUE_VEHICLE_TYPES.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  placeholder="Chọn loại xe cứu hộ"
                />
                <DlsTextField
                  label="Trọng tải kéo xe"
                  required
                  value={vehicleDraft.capacity}
                  onChange={(v) => setVehicleDraft((prev) => ({ ...prev, capacity: v }))}
                  placeholder="VD: 2.5 tấn"
                />
                <DlsTextField
                  label="Biển số xe"
                  required
                  value={vehicleDraft.licensePlate}
                  onChange={(v) => setVehicleDraft((prev) => ({ ...prev, licensePlate: v }))}
                  placeholder="VD: 51A-123.45"
                />
              </div>
              <div className="dls-sheet-footer am-sp-vehicle-sheet__footer">
                {editingVehicleId ? (
                  <DlsBrandButton disabled={!vehicleDraftValid} onClick={() => saveVehicleDraft(false)}>
                    Lưu thay đổi
                  </DlsBrandButton>
                ) : (
                  <>
                    <DlsBrandButton disabled={!vehicleDraftValid} onClick={() => saveVehicleDraft(true)}>
                      Thêm & nhập xe khác
                    </DlsBrandButton>
                    <DlsNeutralButton disabled={!vehicleDraftValid} onClick={() => saveVehicleDraft(false)}>
                      Thêm & đóng
                    </DlsNeutralButton>
                  </>
                )}
              </div>
            </div>
          </div>,
          getDlsOverlayRoot(),
        )}

      {mapOpen && (
        <div className="am-sp-map-fs" role="dialog" aria-label="Chọn vị trí trên bản đồ">
          <header className="am-sp-map-fs__head">
            <button
              type="button"
              className="am-sp-map-fs__icon-btn"
              onClick={() => setMapOpen(false)}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <h2 className="am-sp-map-fs__title">Chọn vị trí</h2>
            <button
              type="button"
              className="am-sp-map-fs__icon-btn"
              onClick={handleUseCurrentLocation}
              aria-label="Dùng vị trí hiện tại"
            >
              <LocateFixed size={20} />
            </button>
          </header>

          <button
            type="button"
            className="am-sp-map-fs__canvas"
            onClick={handleDraftPick}
            aria-label="Chạm để ghim vị trí"
          >
            <span className="am-sp-map__grid" aria-hidden />
            {draftPin ? (
              <span
                className="am-sp-map__pin"
                style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%` }}
                aria-hidden
              >
                <MapPin size={40} strokeWidth={2.5} />
              </span>
            ) : (
              <span className="am-sp-map__hint">Chạm vào bản đồ để ghim vị trí chính xác</span>
            )}
          </button>

          <div className="am-sp-map-fs__footer">
            {draftLatLng ? (
              <p className="am-sp-map-fs__coord">
                <MapPin size={14} strokeWidth={2.25} /> {draftLatLng}
              </p>
            ) : (
              <p className="am-sp-map-fs__coord am-sp-map-fs__coord--empty">Chưa ghim vị trí nào</p>
            )}
            <DlsBrandButton disabled={!draftLatLng} onClick={confirmMapPicker}>
              Xác nhận vị trí
            </DlsBrandButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePointRegisterPage;
