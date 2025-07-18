import { SupabaseClient } from '@supabase/supabase-js';
import {
  IUserRepository,
  PaginationParams,
  PaginatedResponse,
  PostWithPhotos,
} from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class SbUserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUserById(id: number): Promise<User | null> {
    const { data, error } = await this.supabase.from('user').select('*').eq('id', id).single();

    if (error || !data) return null;
    return data;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('user')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return data;
  }

  async getUserLikes(
    userId: number,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<PostWithPhotos>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    // Get posts that user has liked with full details including photos
    const { data: likes, error } = await this.supabase
      .from('likes')
      .select(
        `
        post_id,
        post (
          id,
          date_created,
          photos:photo (
            id,
            img_url
          )
        )
      `,
      )
      .eq('user_id', userId)
      .order('post(date_created)', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !likes) {
      console.error('Error fetching user likes:', error);
      return { data: [], hasMore: false };
    }

    // Transform the data to match the expected format
    const posts = likes.map((item) => item.post).filter(Boolean) as unknown as PostWithPhotos[];

    return {
      data: posts,
      hasMore: likes.length === limit,
    };
  }

  async getUserPosts(
    userId: number,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<PostWithPhotos>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    // Get user's posts with full details including photos
    const { data: posts, error } = await this.supabase
      .from('post')
      .select(
        `
        id,
        date_created,
        photos:photo (
          id,
          img_url
        )
      `,
      )
      .eq('user_id', userId)
      .order('date_created', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !posts) {
      console.error('Error fetching user posts:', error);
      return { data: [], hasMore: false };
    }

    return {
      data: posts as unknown as PostWithPhotos[],
      hasMore: posts.length === limit,
    };
  }

  async uploadProfileImage(
    userId: number,
    file: File,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Only image files are allowed',
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'File size must be less than 5MB',
        };
      }

      // Get current user to find existing profile image
      const currentUser = await this.getUserById(userId);
      if (currentUser?.profile_img) {
        // Delete old profile image
        await this.deleteProfileImage(userId, currentUser.profile_img);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // Don't add subfolder since bucket is already for profile images

      console.log('Uploading file with path:', filePath); // Debug log

      // Upload file to Supabase storage
      const { error } = await this.supabase.storage.from('profile-img').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting existing files for the same user
      });

      if (error) {
        console.error('Upload error:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      // Get signed URL (correct format for Supabase storage)
      const { data: signedUrlData, error: signedUrlError } = await this.supabase.storage
        .from('profile-img')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 99); // 99 year expiry

      if (signedUrlError) {
        console.error('Signed URL error:', signedUrlError);
        return {
          success: false,
          error: 'Failed to generate image URL',
        };
      }

      const signedUrl = signedUrlData.signedUrl;
      console.log('Generated signed URL:', signedUrl); // Debug log
      console.log('File path used:', filePath); // Debug log

      return {
        success: true,
        url: signedUrl,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: 'Upload failed',
      };
    }
  }

  async deleteProfileImage(userId: number, imageUrl: string): Promise<boolean> {
    try {
      console.log('Attempting to delete image URL:', imageUrl); // Debug log

      // Handle different URL formats
      let fileName: string;

      if (imageUrl.includes('storage/v1/object/sign/')) {
        // Signed URL format: https://.../storage/v1/object/sign/profile-img/filename.png?token=...
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');

        // Find the filename after 'profile-img' in the path
        const profileImgIndex = pathParts.findIndex((part) => part === 'profile-img');
        if (profileImgIndex === -1 || profileImgIndex === pathParts.length - 1) {
          console.error('Invalid signed URL format - cannot find filename');
          return false;
        }

        fileName = pathParts[profileImgIndex + 1];
      } else if (imageUrl.includes('profile-img/')) {
        // Direct storage URL format: https://.../storage/v1/object/public/profile-img/filename.png
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const profileImgIndex = pathParts.findIndex((part) => part === 'profile-img');
        if (profileImgIndex === -1 || profileImgIndex === pathParts.length - 1) {
          console.error('Invalid storage URL format - cannot find filename');
          return false;
        }
        fileName = pathParts[profileImgIndex + 1];
      } else {
        // Assume it's just a filename
        fileName = imageUrl.split('/').pop() || imageUrl;
      }

      console.log('Extracted filename:', fileName); // Debug log

      // Try to delete the file directly without checking existence first
      const { error } = await this.supabase.storage.from('profile-img').remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        // If the error indicates the file doesn't exist, consider it a success
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          console.log('File does not exist, considering deletion successful:', fileName);
          return true;
        }

        return false;
      }

      console.log('Successfully deleted file:', fileName); // Debug log
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }
}
