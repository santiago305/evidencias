import { useEffect, useMemo, useState } from 'react';
import { AlarmClock, Battery, Signal, Wifi } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { SiFacebook, SiGmail, SiInstagram } from 'react-icons/si';

import type { PreviewThemeMode } from '../../../../types';

export function Mobile1PreviewHeader({ themeMode }: { themeMode: PreviewThemeMode }) {
  const isDark = themeMode === 'dark';
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString('es-PE', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();

    const interval = window.setInterval(updateTime, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const notifications = useMemo(() => {
    const icons = [
      { id: 'gmail', Icon: SiGmail },
      { id: 'linkedin', Icon: FaLinkedinIn },
      { id: 'instagram', Icon: SiInstagram },
      { id: 'facebook', Icon: SiFacebook },
    ];

    const shuffled = [...icons].sort(() => Math.random() - 0.5);
    const amount = Math.floor(Math.random() * icons.length) + 1;

    return shuffled.slice(0, amount);
  }, []);

  return (
    <div
      className={[
        'shrink-0 px-5 py-1',
        isDark ? 'bg-[#070c0f] text-white' : 'bg-white text-[#5f6368]',
      ].join(' ')}
    >
      <div
        className="flex h-5 items-center justify-between"
        style={{
          fontFamily:
            'Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className={[
              'text-[15px] font-normal leading-none tracking-[-0.01em]',
              isDark ? 'text-white' : 'text-[#5f6368]',
            ].join(' ')}
          >
            {time}
          </span>

          <div className="flex items-center gap-2">
            {notifications.map(({ id, Icon }) => (
              <Icon
                key={id}
                className="h-[12px] w-[12px] text-current"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-current">
          <AlarmClock className="h-[13px] w-[13px]" strokeWidth={2.1} />

          <span className="text-[7px] font-bold leading-[0.75] tracking-[-0.04em]">
            Vo
            <br />
            LTE
          </span>

          <Wifi className="h-[14px] w-[14px]" strokeWidth={2.2} />
          <Signal className="h-[14px] w-[14px]" strokeWidth={2.2} />

          <Battery className="h-[15px] w-[15px]" strokeWidth={2.3} />
        </div>
      </div>
    </div>
  );
}
