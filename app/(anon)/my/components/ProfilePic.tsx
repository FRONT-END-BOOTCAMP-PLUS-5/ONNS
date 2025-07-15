import Image from 'next/image';

interface ProfilePicProps {
  profilePicture: string | null;
}

const ProfilePic = ({ profilePicture }: ProfilePicProps) => {
  return (
    <div className="relative w-[121px] h-[121px]">
      <Image
        fill
        className="rounded-full object-cover"
        src={profilePicture || ''}
        alt="profile picture"
        sizes="121px"
        priority
      />
    </div>
  );
};

export default ProfilePic;
