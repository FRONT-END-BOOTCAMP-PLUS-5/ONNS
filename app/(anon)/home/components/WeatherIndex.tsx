'use client';

interface WeatherIndexProps {
  umbrellaIndex: boolean | null;
  dustIndex: boolean | null;
}

const WeatherIndex = ({ umbrellaIndex, dustIndex }: WeatherIndexProps) => {
  if (!umbrellaIndex && !dustIndex) return null;
  const text =
    umbrellaIndex === true
      ? '☔️ 오늘은 비 소식이 있어요. 우산 꼭 챙기시고, 빗길 조심하세요! 오늘도 화이팅 '
      : dustIndex === true
        ? '😷 오늘은 미세먼지가 많아요. 외출 시 마스크 착용을 잊지 마세요!'
        : '';

  return (
    <>
      <div className="w-full h-9 bg-neutral-200/50 flex items-center overflow-hidden mb-[22px]">
        <div
          className="flex whitespace-nowrap text-sm px-2"
          style={{
            animation: 'marquee 18s linear infinite',
          }}
        >
          <span className="text-black mx-6">{text}</span>
          <span className="text-black mx-6">{text}</span>
        </div>
        <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      </div>
    </>
  );
};

export default WeatherIndex;
