import { Injectable, OnModuleInit } from '@nestjs/common';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { EventPublisher } from '@nestjs/cqrs';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { envs } from '@users-ms/config';
import { UserRepository } from '../user.repository';
import { User } from '../domain';
import { UserService } from './user.service';
import { UserBirthDate } from '../domain/UserBirthDate';
import {
  EmailUpdateConflictError,
  EmailAlreadyInUseError,
} from '../exceptions';
import { UserPassword } from '../domain/Password';
import { UserEmail } from '../domain/UserEmail';

@Injectable()
export class UserServiceImpl implements UserService, OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async onModuleInit() {
    try {
      await this.createUser(
        'Admin',
        'Admin',
        new Date('1990-01-01'),
        envs.adminEmail,
        envs.adminPassword,
        '',
        false,
        false,
        Role.ADMIN,
      );
    } catch (error) {
      if (!(error instanceof EmailAlreadyInUseError)) {
        throw error;
      }
    }
  }

  async createUser(
    firstName: string,
    lastName: string,
    birthDate: Date,
    email: string,
    password: string,
    bio: string,
    showAge: boolean,
    showEmail: boolean,
    githubId?: string,
    role = Role.USER,
  ): Promise<string> {
    // Check if the email is already in use
    try {
      await this.userRepository.findByEmail(email);
      // If the email is found, then it is already in use
      throw new EmailAlreadyInUseError(email);
    } catch (error) {
      // If the error is not an EntityNotFoundError, then throw it
      if (!(error instanceof EntityNotFoundError)) {
        throw error;
      }
    }

    // Create the new user
    const user = this.eventPublisher.mergeObjectContext(
      User.create({
        firstName,
        lastName,
        birthDate: UserBirthDate.create(birthDate),
        email: UserEmail.create(email),
        password: await UserPassword.create(password),
        bio,
        showAge,
        showEmail,
        role,
        githubId,
      }),
    );

    // Create the new user and save it
    const savedUser = await this.userRepository.save(user);

    user.commit();
    // Return the ID of the newly created user
    return savedUser.id.toString();
  }

  async updateUser(id: string, email: string, bio: string): Promise<void> {
    // Find the existing user
    const existingUser = await this.userRepository.findById(id);
    // Check if the email is different
    if (existingUser.email === email) {
      throw new EmailUpdateConflictError();
    }

    // Check if the email is already in use
    try {
      await this.userRepository.findByEmail(email);
      // If the email is found, then it is already in use
      throw new EmailAlreadyInUseError(email);
    } catch (error) {
      // If the error is not an EntityNotFoundError, then throw it
      if (!(error instanceof EntityNotFoundError)) {
        throw error;
      }
    }

    // Update the user
    existingUser.updateProfile({ email, bio });
    await this.userRepository.save(existingUser);
  }

  async getUserProfile(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async findByGithubId(githubId: string): Promise<User> {
    return this.userRepository.findByGithubId(githubId);
  }
}
