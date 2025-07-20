'use client';
import { useWeatherStore } from '@/stores/weatherState';
import TodayWeatherInfo from '../../home/components/TodayWeatherInfo';
import { useRef, useState } from 'react';
import ImgMore from '@/public/assets/icons/img_more.svg';
import { Button } from '@/app/components/Button';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosInstance';

//write
export default function Write() {
  const router = useRouter();
  const { cityName, feels_like } = useWeatherStore();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isButtonDisabled = !image || content.trim().length === 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      setContent(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image || content.trim().length === 0 || feels_like == null) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('text', content);
    formData.append('feels_like', feels_like?.toString());

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/ootd');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleButtonClick = () => {
    textareaRef.current?.blur();
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="mt-[24px] mb-[20px]">
        <TodayWeatherInfo cityname={cityName} feels_like={feels_like} />
      </div>
      <section className="mx-[20px]">
        <label className="text-black text-[20px] font-medium">사진 첨부</label>
        <p className="text-[#858585] text-[16px] font-normal">
          오늘 날씨에 맞는 코디 사진을 추가해주세요.
        </p>
        <div>
          <div
            className="w-[180px] h-[250px] bg-[#F0EEEE] border border-dashed border-black flex flex-col items-center justify-center rounded-[4px] cursor-pointer mb-[20px] mt-[16px]"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <>
                <ImgMore />
                <span className="text-black text-[14px] font-normal mt-[10px]">{'0 / 1'}</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </section>
      <section className="mx-[20px] mb-[30px]">
        <span className="text-black text-[20px] font-medium">내용</span>
        <textarea
          ref={textareaRef}
          className="w-full h-[120px] bg-[#F0EEEE] rounded-[6px] p-3 mt-[14px] text-black placeholder:text-[#858585] resize-none outline-none"
          placeholder="오늘 날씨에 맞는 코디를 설명해주세요."
          value={content}
          onInput={handleContentChange}
          maxLength={500}
        />
        <div className="text-right text-[#858585] text-sm mt-[2px]">
          {content.length} / 500자 이내
        </div>
      </section>
      <div className="w-full max-w-[430px] mx-auto fixed bottom-0 left-1/2 -translate-x-1/2  flex justify-center z-10 bg-white py-[20px]">
        <Button
          content="등록하기"
          disabled={isButtonDisabled}
          type="button"
          onClick={handleButtonClick}
        />
      </div>
    </form>
  );
}
