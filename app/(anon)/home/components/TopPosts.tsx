'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
interface Posts {
  id: number;
  img: string;
}
interface TopPostsProps {
  posts: Posts[];
}
const TopPosts = ({ posts }: TopPostsProps) => {
  const router = useRouter();
  // 최대 8개만 보여줌
  const top8 = posts.slice(0, 8);

  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-x-[16px] gap-y-4">
        {top8.map((post) => (
          <div
            key={post.id}
            className="w-full h-[250px] relative overflow-hidden"
            onClick={() => router.push(`/ootd/${post.id}`)}
          >
            <Image
              src={post.img}
              alt={`post-${post.id}`}
              fill
              className="object-cover"
              sizes="50vw, 25vw"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPosts;
