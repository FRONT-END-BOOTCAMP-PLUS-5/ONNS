interface ProfileNameProps {
  userName: string | null;
}

const ProfileName = ({ userName }: ProfileNameProps) => {
  return (
    <div className="inline-flex justify-start items-center gap-1 relative">
      <div className="text-center justify-start text-black text-base font-medium font-['Pretendard']">
        {userName}
      </div>
    </div>
  );
};

export default ProfileName;
