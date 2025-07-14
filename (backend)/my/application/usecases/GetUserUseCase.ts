import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number | undefined): Promise<User | null> {
    if (!userId) return null;
    try {
      const user = await this.userRepository.getUserById(userId);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
}
