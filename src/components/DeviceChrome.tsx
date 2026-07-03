import React from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';

const DeviceChrome: React.FC = () => (
  <div className="am-device-chrome" aria-hidden="true">
    <div className="am-status-bar">
      <span className="am-status-bar__time">9:41</span>
      <div className="am-status-bar__island" />
      <div className="am-status-bar__icons">
        <Signal size={15} strokeWidth={2.25} />
        <Wifi size={15} strokeWidth={2.25} />
        <BatteryFull size={20} strokeWidth={1.75} />
      </div>
    </div>
    <div className="am-home-indicator-chrome">
      <div className="am-home-indicator-chrome__bar" />
    </div>
  </div>
);

export default DeviceChrome;
