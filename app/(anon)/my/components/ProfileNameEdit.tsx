import EditPencil from '@/public/assets/icons/edit_pencil.svg';

const ProfileNameEdit = ({ userName }: { userName: string | null }) => {
  return (
    <div className="inline-flex justify-start items-center gap-1 relative">
      <div className="text-center justify-start text-black text-base font-medium font-['Pretendard']">
        {userName}
      </div>
      <EditPencil
        className="w-[9.1px] h-[9.1px] bg-transparent rounded-full cursor-pointer transition-colors"
        onClick={() => {
          console.log('edit');
        }}
      />
    </div>
  );
};

export default ProfileNameEdit;
