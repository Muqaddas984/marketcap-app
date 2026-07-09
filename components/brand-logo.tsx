const APPLE_PATH =
  "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z";

const TWITTER_PATH =
  "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";

const SPOTIFY_PATH =
  "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z";

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function BrandLogo({ ticker, size = 40 }: { ticker: string; size?: number }) {
  const base = "flex shrink-0 items-center justify-center rounded-full";
  const style = { width: size, height: size };

  switch (ticker) {
    case "AAPL":
      return (
        <div className={`${base} bg-black dark:bg-white`} style={style}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white dark:fill-black">
            <path d={APPLE_PATH} />
          </svg>
        </div>
      );
    case "GOOGL":
      return (
        <div className={`${base} border border-line bg-white`} style={style}>
          <GoogleG />
        </div>
      );
    case "SPOT":
      return (
        <div className={`${base} bg-[#1ED760]`} style={style}>
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
            <path d={SPOTIFY_PATH} />
          </svg>
        </div>
      );
    case "TWTR":
      return (
        <div className={`${base} bg-[#1D9BF0]`} style={style}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
            <path d={TWITTER_PATH} />
          </svg>
        </div>
      );
    case "MSFT":
      return (
        <div className={`${base} border border-line bg-white`} style={style}>
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
            <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
            <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
            <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
          </svg>
        </div>
      );
    case "NVDA":
      return (
        <div className={`${base} bg-[#76B900] text-sm font-bold text-white`} style={style}>
          NV
        </div>
      );
    default:
      return (
        <div className={`${base} bg-accent-soft text-sm font-bold text-accent`} style={style}>
          {ticker.slice(0, 2)}
        </div>
      );
  }
}
