import { useMemo } from "react";
import type { MsgStatus } from "./WhatsappPieces";
import type { WhatsappData } from "./whatsappTypes";

type Status = { type: "hidden" } | { type: "online" };

export function WhatsappHeaderUser({
  data,
  status,
}: {
  data: WhatsappData;
  status?: MsgStatus;
}) {
  const headerStatus = useMemo<Status>(() => {
    if (status) {
      return status === "read" ? { type: "online" } : { type: "hidden" };
    }

    return Math.random() < 0.5 ? { type: "online" } : { type: "hidden" };
  }, [data, status]);

  const avatarTheme = useMemo(() => {
    const themes = [
      {
        bg: "#3b261f",
        icon: "#d8a078",
        border: "#4a332b",
        badgeBg: "#202c33",
        badgeIcon: "#aebac1",
        badgeRing: "#111b21",
      },
      {
        bg: "#f1d8c9",
        icon: "#8b5a3c",
        border: "#dfc2b1",
        badgeBg: "#f7f5f3",
        badgeIcon: "#667781",
        badgeRing: "#ffffff",
      },
      {
        bg: "#dfe9e2",
        icon: "#5f7d68",
        border: "#c9d9ce",
        badgeBg: "#f7f5f3",
        badgeIcon: "#667781",
        badgeRing: "#ffffff",
      },
      {
        bg: "#e3d7f0",
        icon: "#705b88",
        border: "#cec0de",
        badgeBg: "#f7f5f3",
        badgeIcon: "#667781",
        badgeRing: "#ffffff",
      },
    ];

    return themes[Math.floor(Math.random() * themes.length)];
  }, [data.nombre]);

  return (
    <div className="w-full bg-white px-3 py-2 border-b border-black/10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar */}
          <div className="relative h-9 w-9 shrink-0">
            <div className="h-9 w-9 rounded-full overflow-hidden">
              <span
                aria-hidden="true"
                data-icon="default-contact-refreshed"
                className="block h-full w-full"
              >
                <svg
                  viewBox="0 0 48 48"
                  height="48"
                  width="48"
                  preserveAspectRatio="xMidYMid meet"
                  className="h-full w-full rounded-full border"
                  style={{
                    backgroundColor: avatarTheme.bg,
                    borderColor: avatarTheme.border,
                  }}
                  fill="none"
                >
                  <title>default-contact-refreshed</title>
                  <path
                    d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322Q28.5 16.643 28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z"
                    fill={avatarTheme.icon}
                  />
                </svg>
              </span>
            </div>

            <span
              aria-hidden="true"
              className="absolute -right-[2px] -bottom-[2px] grid h-[18px] w-[18px] place-items-center rounded-full"
              style={{
                backgroundColor: avatarTheme.badgeRing,
              }}
            >
              <span
                className="grid h-[16px] w-[16px] place-items-center rounded-full overflow-hidden"
                style={{
                  backgroundColor: avatarTheme.badgeBg,
                  color: avatarTheme.badgeIcon,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  height="16"
                  width="16"
                  preserveAspectRatio="xMidYMid meet"
                  fill="currentColor"
                  className="block"
                >
                  <title>wds-ic-disappearing-messages</title>
                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                  <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                  <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                  <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                  <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                  <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                  <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                </svg>
              </span>
            </span>
          </div>

          {/* Name + status */}
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] font-normal text-[#111b21] truncate">
              {data.nombre?.trim() ? data.nombre : "Aracely MD"}
            </div>

            {headerStatus.type !== "hidden" && (
              <div className="text-[9px] truncate text-[#667781] font-medium">
                en linea
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0 text-[#54656f]">
          {/* Video */}
          <span
            aria-hidden="true"
            data-icon="video-call-refreshed"
            className="text-black w-5 h-5"
          >
            <svg viewBox="0 0 24 24" height="20" width="20" fill="none">
              <title>video-call-refreshed</title>
              <path
                d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V10.5L21.15 7.35C21.3167 7.18333 21.5 7.14167 21.7 7.225C21.9 7.30833 22 7.46667 22 7.7V16.3C22 16.5333 21.9 16.6917 21.7 16.775C21.5 16.8583 21.3167 16.8167 21.15 16.65L18 13.5V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H4ZM4 18H16V6H4V18Z"
                fill="currentColor"
              />
            </svg>
          </span>

          {/* Arrow */}
          <span aria-hidden="true" className="text-black">
            <svg viewBox="0 0 24 24" height="16" fill="none">
              <title>ic-arrow-drop-down</title>
              <path
                d="M11.475 14.475L7.85001 10.85C7.80001 10.8 7.76251 10.7458 7.73751 10.6875C7.71251 10.6292 7.70001 10.5667 7.70001 10.5C7.70001 10.3667 7.74585 10.25 7.83751 10.15C7.92918 10.05 8.05001 10 8.20001 10H15.8C15.95 10 16.0708 10.05 16.1625 10.15C16.2542 10.25 16.3 10.3667 16.3 10.5C16.3 10.5333 16.25 10.65 16.15 10.85L12.525 14.475C12.4417 14.5583 12.3583 14.6167 12.275 14.65C12.1917 14.6833 12.1 14.7 12 14.7C11.9 14.7 11.8083 14.6833 11.725 14.65C11.6417 14.6167 11.5583 14.5583 11.475 14.475Z"
                fill="currentColor"
              />
            </svg>
          </span>

          {/* Search */}
          <span
            aria-hidden="true"
            data-icon="search-refreshed"
            className="w-6 h-6 text-black ml-2"
          >
            <svg viewBox="0 0 24 24" height="22" width="22" fill="none">
              <title>search-refreshed</title>
              <path
                d="M9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                fill="currentColor"
              />
            </svg>
          </span>

          {/* Menu */}
          <button
            type="button"
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-black/5 active:bg-black/10 transition text-black"
            aria-label="Menú"
            title="Menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="12" cy="19" r="1.6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}