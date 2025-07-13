import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { JWTPayload } from '../../domain/entities/JWTPayload';
import { supabase } from '@/utils/supabase/supabaseClient';
import jwt from 'jsonwebtoken';
import { Tokens } from '@/types/auth';

// 메모리 기반 블랙리스트 (서버 재시작 시 초기화됨)
const tokenBlacklist = new Set<string>();

export class SbAuthRepository implements IAuthRepository {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly REFRESH_SECRET = process.env.REFRESH_SECRET!;

  async upsertUser(user: User): Promise<User> {
    const { data, error } = await supabase
      .from('user')
      .upsert({
        id: user.id,
        name: user.name,
        profile_img: user.profileImg,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user: ${error.message}`);
    }

    return data;
  }

  generateJWT(user: User): Tokens {
    const now = Math.floor(Date.now() / 1000);

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        profile_img: user.profileImg,
        type: 'access',
        jti: crypto.randomUUID(),
      },
      this.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '15m',
        notBefore: now,
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        type: 'refresh',
        jti: crypto.randomUUID(),
      },
      this.REFRESH_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '7d',
        notBefore: now,
      },
    );

    return { accessToken, refreshToken };
  }

  async findUserByToken(token: string): Promise<User | null> {
    try {
      // 메모리 블랙리스트 확인
      if (tokenBlacklist.has(token)) {
        return null;
      }

      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;

      // 사용자 정보 조회
      const { data: user, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        profileImg: user.profile_img,
      };
    } catch (error) {
      throw new Error(`Failed to find user by token: ${error}`);
    }
  }

  async deleteUser(user: User): Promise<User> {
    try {
      //알림림
      const { error: receivedNotificationsError } = await supabase
        .from('notification')
        .delete()
        .eq('user_id', user.id);

      if (receivedNotificationsError) {
        throw new Error(
          `Failed to delete received notifications: ${receivedNotificationsError.message}`,
        );
      }
      //받은 알림림
      const { error: sentNotificationsError } = await supabase
        .from('notification')
        .delete()
        .eq('actor_id', user.id);

      if (sentNotificationsError) {
        throw new Error(`Failed to delete sent notifications: ${sentNotificationsError.message}`);
      }
      //댓글글
      const { error: commentsError } = await supabase
        .from('comment')
        .delete()
        .eq('user_id', user.id);

      if (commentsError) {
        throw new Error(`Failed to delete user comments: ${commentsError.message}`);
      }
      //좋아요
      const { error: likesError } = await supabase.from('likes').delete().eq('user_id', user.id);

      if (likesError) {
        throw new Error(`Failed to delete user likes: ${likesError.message}`);
      }
      //게시물
      const { data: userPosts, error: postsQueryError } = await supabase
        .from('post')
        .select('id')
        .eq('user_id', user.id);

      if (postsQueryError) {
        throw new Error(`Failed to query user posts: ${postsQueryError.message}`);
      }

      if (userPosts && userPosts.length > 0) {
        const postIds = userPosts.map((post) => post.id);
        const { error: photosError } = await supabase.from('photo').delete().in('post_id', postIds);

        if (photosError) {
          throw new Error(`Failed to delete user photos: ${photosError.message}`);
        }
      }

      const { error: postsError } = await supabase.from('post').delete().eq('user_id', user.id);

      if (postsError) {
        throw new Error(`Failed to delete user posts: ${postsError.message}`);
      }

      const { data, error } = await supabase
        .from('user')
        .delete()
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(
        `Failed to delete user and all related data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async invalidateToken(token: string): Promise<void> {
    // 메모리 블랙리스트에 토큰 추가
    tokenBlacklist.add(token);

    // 메모리 관리를 위해 만료된 토큰 정리
    this.cleanupExpiredTokens();
  }

  // 만료된 토큰 정리 (메모리 관리용)
  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const token of tokenBlacklist) {
      try {
        const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
        if (decoded.exp && decoded.exp * 1000 < now) {
          tokenBlacklist.delete(token);
        }
      } catch {
        // 토큰이 유효하지 않으면 블랙리스트에서 제거
        tokenBlacklist.delete(token);
      }
    }
  }
}
