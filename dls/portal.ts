/** Overlay root — ưu tiên khung preview thiết bị, fallback body. */
export function getDlsOverlayRoot(): HTMLElement {
  if (typeof document === 'undefined') {
    return null as unknown as HTMLElement;
  }
  return (
    document.querySelector('.am-device__app') ??
    document.querySelector('.dm-device__app') ??
    document.body
  );
}
