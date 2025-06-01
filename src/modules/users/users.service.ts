import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async createProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.userProfileRepository.create({
      ...profileData,
      userId,
    });
    return this.userProfileRepository.save(profile);
  }

  async updateProfile(userId: string, profileDto: UpdateUserProfileDto): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert date string to Date object if provided
    const profileData: Partial<UserProfile> = {
      ...profileDto,
      dateOfBirth: profileDto.dateOfBirth ? new Date(profileDto.dateOfBirth) : undefined,
    };

    if (user.profile) {
      Object.assign(user.profile, profileData);
      return this.userProfileRepository.save(user.profile);
    } else {
      return this.createProfile(userId, profileData);
    }
  }
}