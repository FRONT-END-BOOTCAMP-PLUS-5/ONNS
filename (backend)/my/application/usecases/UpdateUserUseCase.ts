import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: number,
    updateData: { name?: string; profile_img?: string },
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.updateUser(userId, updateData);
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
