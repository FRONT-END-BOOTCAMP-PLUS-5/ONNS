import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

interface UploadProfileImageUseCaseResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export class UploadProfileImageUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number, file: File): Promise<UploadProfileImageUseCaseResponse> {
    try {
      // Upload image to storage
      const uploadResult = await this.userRepository.uploadProfileImage(userId, file);

      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || 'Upload failed',
        };
      }

      // Update user profile in database
      const updatedUser = await this.userRepository.updateUser(userId, {
        profile_img: uploadResult.url!,
      });

      if (!updatedUser) {
        return {
          success: false,
          error: 'Failed to update user profile',
        };
      }

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return {
        success: false,
        error: 'Server error',
      };
    }
  }
}
