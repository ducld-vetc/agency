# Agency app v3.0 — Mobile đại lý

App preview mobile cho **đại lý VETC**, repo độc lập.

- **Figma:** [Mobile Agency app v3.0 — Home](https://www.figma.com/design/8N8i14aF2bJpldV9RZXa4e/-Mobile--Agency-app-v3.0?node-id=11001-50900)
- **DLS:** `../Test/tasco-dls-v1.2.json` → `dls/` (tokens + components)
- **Stack:** React, TypeScript, Vite, lucide-react

## Chạy local

```bash
cd rsa-agency-mobile
npm install
npm run dev
```

Mở http://127.0.0.1:5191/

## Cấu trúc

```
rsa-agency-mobile/
  dls/                    # Tasco DLS v1.2 (từ tasco-dls-v1.2.json)
  src/
    pages/HomePage.tsx    # Trang chủ Agency
    components/           # DonutChart, DeviceChrome
    home.css              # Layout màn Home
    app.css               # Preview frame
```

## Màn Home

- Banner quảng cáo + top bar (menu, logo, tìm kiếm, thông báo)
- Card doanh thu tháng + hoa hồng tích lũy
- Tra cứu kích hoạt (DLS Text field + nút Tra cứu)
- Lưới shortcut (rút tiền, ví VETC, hồ sơ, loyalty…)
- Tab dịch vụ ETC / RSA / Tab + danh sách sản phẩm
- Biểu đồ donut hoa hồng & doanh thu + thống kê 3 cột
- Chính sách sản phẩm và hoa hồng
