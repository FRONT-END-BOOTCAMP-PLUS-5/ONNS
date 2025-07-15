'use client';
import Location from '@/public/assets/icons/loaction.svg';
interface TodayWeatherInfoProps {
  cityname: string | null;
  feels_like: number | null;
}
const TodayWeatherInfo = ({ cityname, feels_like }: TodayWeatherInfoProps) => {
  return (
    <>
      <div className="ml-4 mr-4">
        <div
          className={`
        relative
        w-full
        h-[85px]
        pt-[12px]
        px-[16px]
        pb-[10px]
        flex-shrink-0 
        rounded-xl 
        overflow-hidden
        [background:radial-gradient(94.8%_125.03%_at_80%_80%,rgba(106,113,229,0.30)_0%,rgba(106,113,229,0.10)_100%)]
        [box-shadow:-5px_-5px_250px_0px_rgba(255,255,255,0.02)_inset]
        [backdrop-filter:blur(21px)]
      `}
        >
          <div>
            <div className="text-[16px] font-semibold mb-[6px]">오늘의 날씨</div>
            <div className="flex items-center">
              <Location />
              <span className="text-lg text-[12px] font-light text-gray-700">{cityname}</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 text-[32px] font-medium text-black leading-none">
            {feels_like}
            <span className="align-top text-[18px]">℃</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodayWeatherInfo;
