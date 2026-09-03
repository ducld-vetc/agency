import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronDown, Eye, EyeOff, X, Check, Filter, Bell, Settings, Lock, LogOut, ChevronRight, Navigation, Clock } from 'lucide-react';
import { getDlsOverlayRoot } from './portal';

/* ——— Typography helpers ——— */
export const DlsLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="dls-label">
    {children}
    {required && <span className="dls-required">*</span>}
  </label>
);

/* ——— Text field (DLS Text field) ——— */
export const DlsTextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'password';
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
}> = ({ label, value, onChange, placeholder, type = 'text', required, error, multiline, rows = 4 }) => {
  const [show, setShow] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className="dls-field">
      <DlsLabel required={required}>{label}</DlsLabel>
      <div
        className={`dls-input-wrap${error ? ' dls-input-wrap--error' : ''}${multiline ? ' dls-input-wrap--textarea' : ''}`}
      >
        {multiline ? (
          <textarea
            className="dls-input dls-input--textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={error ? true : undefined}
          />
        ) : (
          <input
            className="dls-input"
            type={isPassword && !show ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
          />
        )}
        {isPassword && !multiline && (
          <button type="button" className="dls-input-icon" onClick={() => setShow(!show)} aria-label="Hiện mật khẩu">
            {show ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
          </button>
        )}
      </div>
      {error && <p className="dls-field-error" role="alert">{error}</p>}
    </div>
  );
};

export type DlsOptionGroup = {
  label: string;
  options: { value: string; label: string }[];
};

const findOptionLabel = (groups: DlsOptionGroup[], value: string) => {
  for (const group of groups) {
    const match = group.options.find((opt) => opt.value === value);
    if (match) return match.label;
  }
  return value;
};

/* ——— Select / droplist (DLS Select — sheet, không dùng native <select>) ——— */
export const DlsSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  sheetTitle?: string;
}> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Chọn',
  required,
  error,
  sheetTitle,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const closeSheet = () => setOpen(false);

  return (
    <>
      <div className="dls-field">
        <DlsLabel required={required}>{label}</DlsLabel>
        <button
          type="button"
          className={`dls-select-trigger${error ? ' dls-select-trigger--error' : ''}${
            value ? '' : ' dls-select-trigger--placeholder'
          }`}
          onClick={() => setOpen(true)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
        >
          <span>{selectedLabel || placeholder}</span>
          <ChevronDown size={18} strokeWidth={2} aria-hidden />
        </button>
        {error && <p className="dls-field-error" role="alert">{error}</p>}
      </div>

      {open &&
        createPortal(
          <div
            className="dls-sheet-overlay"
            role="dialog"
            aria-modal
            aria-label={sheetTitle ?? label}
            onClick={closeSheet}
          >
            <div className="dls-sheet" onClick={(e) => e.stopPropagation()}>
              <DlsSheetHeader title={sheetTitle ?? label} onClose={closeSheet} />
              <div className="dls-sheet-body dls-sheet-body--form">
                <div className="dls-reason-list" role="listbox" aria-label={label}>
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={value === opt.value}
                      className={`dls-reason-item${value === opt.value ? ' dls-reason-item--on' : ''}`}
                      onClick={() => {
                        onChange(opt.value);
                        closeSheet();
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <DlsHomeIndicator />
            </div>
          </div>,
          getDlsOverlayRoot(),
        )}
    </>
  );
};

export const DlsSelectGroup: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  groups: { label: string; options: { value: string; label: string }[] }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  sheetTitle?: string;
}> = ({
  label,
  value,
  onChange,
  groups,
  placeholder = 'Chọn',
  required,
  error,
  sheetTitle,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = findOptionLabel(groups, value);
  const hasValue = Boolean(value && groups.some((g) => g.options.some((o) => o.value === value)));

  const closeSheet = () => setOpen(false);

  return (
    <>
      <div className="dls-field">
        <DlsLabel required={required}>{label}</DlsLabel>
        <button
          type="button"
          className={`dls-select-trigger${error ? ' dls-select-trigger--error' : ''}${
            hasValue ? '' : ' dls-select-trigger--placeholder'
          }`}
          onClick={() => setOpen(true)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
        >
          <span>{hasValue ? selectedLabel : placeholder}</span>
          <ChevronDown size={18} strokeWidth={2} aria-hidden />
        </button>
        {error && <p className="dls-field-error" role="alert">{error}</p>}
      </div>

      {open &&
        createPortal(
          <div
            className="dls-sheet-overlay"
            role="dialog"
            aria-modal
            aria-label={sheetTitle ?? label}
            onClick={closeSheet}
          >
            <div className="dls-sheet" onClick={(e) => e.stopPropagation()}>
              <DlsSheetHeader title={sheetTitle ?? label} onClose={closeSheet} />
              <div className="dls-sheet-body dls-sheet-body--form">
                <div className="dls-reason-list" role="listbox" aria-label={label}>
                  {groups.map((group) => (
                    <div key={group.label} className="dls-multi-select-group">
                      <p className="dls-multi-select-group__title">{group.label}</p>
                      <div className="dls-multi-select-group__list">
                        {group.options.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={value === opt.value}
                            className={`dls-reason-item${
                              value === opt.value ? ' dls-reason-item--on' : ''
                            }`}
                            onClick={() => {
                              onChange(opt.value);
                              closeSheet();
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <DlsHomeIndicator />
            </div>
          </div>,
          getDlsOverlayRoot(),
        )}
    </>
  );
};

/* ——— Multi-select field (custom sheet, không dùng native picker) ——— */
export const DlsMultiSelectField: React.FC<{
  label: string;
  value: string[];
  onChange?: (values: string[]) => void;
  groups: DlsOptionGroup[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  sheetTitle?: string;
  minSelected?: number;
  onConfirm?: (draft: string[]) => void;
}> = ({
  label,
  value,
  onChange,
  groups,
  placeholder = 'Chọn',
  required,
  error,
  sheetTitle,
  minSelected = 0,
  onConfirm,
}) => {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string[]>([]);

  const openSheet = () => {
    setDraft([...value]);
    setOpen(true);
  };

  const closeSheet = () => setOpen(false);

  const toggleDraft = (optionValue: string) => {
    setDraft((prev) =>
      prev.includes(optionValue)
        ? prev.filter((item) => item !== optionValue)
        : [...prev, optionValue],
    );
  };

  const handleConfirm = () => {
    if (draft.length < minSelected) return;
    closeSheet();
    if (onConfirm) {
      onConfirm(draft);
      return;
    }
    onChange?.(draft);
  };

  const summary =
    value.length === 0
      ? placeholder
      : value.map((item) => findOptionLabel(groups, item)).join(', ');

  return (
    <>
      <div className="dls-field">
        <DlsLabel required={required}>{label}</DlsLabel>
        <button
          type="button"
          className={`dls-multi-select-trigger${error ? ' dls-multi-select-trigger--error' : ''}`}
          onClick={openSheet}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span
            className={
              value.length > 0
                ? 'dls-multi-select-trigger__value'
                : 'dls-multi-select-trigger__placeholder'
            }
          >
            {summary}
          </span>
          <ChevronDown size={16} strokeWidth={2.25} className="dls-multi-select-trigger__chev" aria-hidden />
        </button>
        {value.length > 0 && (
          <div className="dls-multi-select-chips" aria-label="Dịch vụ đã chọn">
            {value.map((item) => (
              <span key={item} className="dls-multi-select-chip">
                {findOptionLabel(groups, item)}
              </span>
            ))}
          </div>
        )}
        {error && <p className="dls-field-error" role="alert">{error}</p>}
      </div>

      {open &&
        createPortal(
          <div
            className="dls-sheet-overlay"
            role="dialog"
            aria-modal
            aria-label={sheetTitle ?? label}
            onClick={closeSheet}
          >
            <div className="dls-sheet dls-multi-select-sheet" onClick={(e) => e.stopPropagation()}>
              <DlsSheetHeader title={sheetTitle ?? label} onClose={closeSheet} />
              <div className="dls-sheet-body dls-multi-select-sheet__body">
                {groups.map((group) => (
                  <div key={group.label} className="dls-multi-select-group">
                    <p className="dls-multi-select-group__title">{group.label}</p>
                    <div className="dls-multi-select-group__list">
                      {group.options.map((opt) => {
                        const selected = draft.includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className={`dls-multi-select-item${selected ? ' dls-multi-select-item--on' : ''}`}
                            onClick={() => toggleDraft(opt.value)}
                            aria-pressed={selected}
                          >
                            <span
                              className={`dls-checkbox dls-multi-select-item__check${selected ? ' dls-checkbox--on' : ''}`}
                              aria-hidden
                            >
                              {selected && <Check size={14} strokeWidth={3} />}
                            </span>
                            <span className="dls-multi-select-item__label">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="dls-sheet-footer dls-sheet-footer--single">
                <DlsBrandButton onClick={handleConfirm} disabled={draft.length < minSelected}>
                  Xác nhận{draft.length > 0 ? ` (${draft.length})` : ''}
                </DlsBrandButton>
              </div>
            </div>
          </div>,
          getDlsOverlayRoot(),
        )}
    </>
  );
};

/* ——— Brand button (DLS Brand button Large/Filled) ——— */
export const DlsBrandButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'lg' | 'sm';
}> = ({ children, onClick, disabled, fullWidth = true, size = 'lg' }) => (
  <button
    type="button"
    className={`dls-btn-brand ${size === 'sm' ? 'dls-btn-sm' : ''} ${fullWidth ? 'dls-btn-full' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

/* ——— Neutral button ——— */
export const DlsNeutralButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: 'lg' | 'sm';
  fullWidth?: boolean;
}> = ({ children, onClick, disabled, icon, size = 'lg', fullWidth = true }) => (
  <button
    type="button"
    className={`dls-btn-neutral ${size === 'sm' ? 'dls-btn-sm' : ''} ${fullWidth ? 'dls-btn-full' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <span className="dls-btn-icon">{icon}</span>}
    {children}
  </button>
);

/* ——— Brand checkbox ——— */
export const DlsCheckbox: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="dls-checkbox-row">
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={`dls-checkbox ${checked ? 'dls-checkbox--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </button>
    <span>{label}</span>
  </label>
);

/* ——— Status badge (DLS Status badge) ——— */
export type DlsStatusVariant = 'warning' | 'success' | 'info' | 'neutral' | 'danger';

export const DlsStatusBadge: React.FC<{
  label: string;
  variant?: DlsStatusVariant;
  dotColor?: string;
  showDot?: boolean;
}> = ({ label, variant = 'warning', dotColor, showDot = true }) => (
  <span
    className={`dls-status-badge dls-status-badge--${variant}${showDot ? '' : ' dls-status-badge--no-dot'}`}
  >
    {showDot && (
      <span
        className="dls-status-dot"
        style={dotColor ? { background: dotColor } : undefined}
      />
    )}
    {label}
  </span>
);

/* ——— Selection chip ——— */
export const DlsChip: React.FC<{
  label: string;
  selected?: boolean;
  brand?: boolean;
  badge?: number;
  onClick?: () => void;
  icon?: React.ReactNode;
}> = ({ label, selected, brand, badge, onClick, icon }) => (
  <button
    type="button"
    className={`dls-chip ${selected ? (brand ? 'dls-chip--brand' : 'dls-chip--selected') : ''}`}
    onClick={onClick}
  >
    {icon}
    {label}
    {badge != null && badge > 0 && <span className="dls-chip-badge">{badge}</span>}
  </button>
);

/* ——— Top nav — Native app ——— */
export const DlsTopNav: React.FC<{
  title: string;
  variant?: 'brand' | 'default';
  titleAlign?: 'center' | 'start';
  onBack?: () => void;
  actions?: React.ReactNode;
}> = ({ title, variant = 'brand', titleAlign = 'center', onBack, actions }) => (
  <header className={`dls-topnav ${variant === 'brand' ? 'dls-topnav--brand' : ''}`}>
    {onBack ? (
      <button type="button" className="dls-topnav-back" onClick={onBack} aria-label="Quay lại">
        <ChevronLeft size={20} />
      </button>
    ) : (
      <div className="dls-topnav-spacer" />
    )}
    <h1 className={`dls-topnav-title ${titleAlign === 'start' ? 'dls-topnav-title--start' : ''}`}>{title}</h1>
    <div className="dls-topnav-actions">{actions ?? <div className="dls-topnav-spacer" />}</div>
  </header>
);

export const DlsNavIconButton: React.FC<{
  icon: 'bell' | 'settings';
  badge?: number;
  onClick?: () => void;
  overlay?: boolean;
}> = ({ icon, badge, onClick, overlay }) => (
  <button
    type="button"
    className={`dls-nav-icon-btn ${overlay ? 'dls-nav-icon-btn--overlay' : ''}`}
    onClick={onClick}
    aria-label={icon === 'bell' ? 'Thông báo' : 'Cài đặt'}
  >
    {icon === 'bell' ? <Bell size={20} /> : <Settings size={20} />}
    {badge != null && badge > 0 && <span className="dls-nav-badge">{badge}</span>}
  </button>
);

/* ——— Toggle (Settings — Sẵn sàng cứu hộ) ——— */
export const DlsToggle: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    className={`dls-toggle ${on ? 'dls-toggle--on' : ''}`}
    onClick={() => onChange(!on)}
  >
    <span className="dls-toggle-handle" />
  </button>
);

/* ——— Sheet header ——— */
export const DlsSheetHandle: React.FC = () => (
  <div className="dls-sheet-handle-wrap">
    <div className="dls-sheet-handle" />
  </div>
);

export const DlsSheetHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="dls-sheet-header">
    <DlsSheetHandle />
    <div className="dls-sheet-header-row">
      <h2 className="dls-sheet-title">{title}</h2>
      <button type="button" className="dls-sheet-close" onClick={onClose} aria-label="Đóng">
        <X size={20} />
      </button>
    </div>
  </div>
);

/* ——— Detail / order ——— */
export const DlsDetailSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="dls-detail-section">
    <h3 className="dls-section-title">{title}</h3>
    {children}
  </section>
);

export const DlsDetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  last?: boolean;
  multiline?: boolean;
}> = ({ label, value, last, multiline }) => (
  <div
    className={`dls-detail-row ${last ? 'dls-detail-row--last' : ''} ${multiline ? 'dls-detail-row--multi' : ''}`}
  >
    <span className="dls-detail-row__label">{label}</span>
    <span className="dls-detail-row__value">{value}</span>
  </div>
);

export const DlsTextLink: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}> = ({ children, onClick, href, className = '' }) => {
  if (href) {
    return (
      <a className={`dls-text-link ${className}`} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={`dls-text-link ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export const DlsLocationRow: React.FC<{
  label: string;
  address: string;
  variant?: 'pickup' | 'tow';
  onNavigate?: () => void;
  trailing?: React.ReactNode;
}> = ({ label, address, variant = 'pickup', onNavigate, trailing }) => (
  <div className="dls-location-row">
    <div className="dls-location-row__head">
      <div className="dls-location-row__label-wrap">
        <span className={`dls-location-row__dot dls-location-row__dot--${variant}`} aria-hidden />
        <span className="dls-location-row__label">{label}</span>
      </div>
      <div className="dls-location-row__actions">
        {trailing}
        {onNavigate && address.trim() && (
          <button
            type="button"
            className="dls-location-nav-btn"
            onClick={onNavigate}
            aria-label={`Chỉ đường — ${label}`}
          >
            <Navigation size={14} strokeWidth={2.25} aria-hidden />
            Chỉ đường
          </button>
        )}
      </div>
    </div>
    <p className="dls-location-row__addr">{address}</p>
  </div>
);

export const DlsEtaCard: React.FC<{
  minutes?: number;
  distanceKm?: number;
  etaTime?: string;
}> = ({ minutes, distanceKm, etaTime }) => {
  const primary =
    minutes != null ? `${minutes} phút` : etaTime ? `ETA ${etaTime}` : null;
  if (!primary) return null;

  return (
    <div className="dls-eta-card" role="status">
      <div className="dls-eta-card__icon" aria-hidden>
        <Clock size={22} strokeWidth={2} />
      </div>
      <div>
        <p className="dls-eta-card__label">Thời gian dự kiến</p>
        <p className="dls-eta-card__value">{primary}</p>
        {distanceKm != null && <p className="dls-eta-card__meta">Khoảng {distanceKm} km</p>}
      </div>
    </div>
  );
};

/* ——— Settings list row ——— */
export const DlsListRow: React.FC<{
  icon?: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, label, trailing, onClick, danger }) => {
  const className = `dls-list-row ${danger ? 'dls-list-row--danger' : ''}`;
  const inner = (
    <>
      {icon && <span className="dls-list-row__icon">{icon}</span>}
      <span className="dls-list-row__label">{label}</span>
      {trailing ?? (onClick ? <ChevronRight size={18} className="dls-list-row__chevron" /> : null)}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
};

/* ——— Home indicator ——— */
export const DlsHomeIndicator: React.FC = () => (
  <div className="dls-home-indicator">
    <div className="dls-home-bar" />
  </div>
);

/* ——— Icons for settings ——— */
export const LockIcon = () => <Lock size={20} strokeWidth={1.75} />;
export const LogOutIcon = () => <LogOut size={20} strokeWidth={1.75} />;
export const FilterIcon = () => <Filter size={18} strokeWidth={2} />;
