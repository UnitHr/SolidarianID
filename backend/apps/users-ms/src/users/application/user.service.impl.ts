import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { User } from '../domain';
import { UserService } from './user.service';
import { UserBirthDate } from '../domain/UserBirthDate';
import {
  UserNotFoundError,
  EmailUpdateConflictError,
  EmailAlreadyInUseError,
} from '../exceptions';

@Injectable()
export class UserServiceImpl implements UserService {
  private readonly saltRounds = 10; // Número de rondas para el hashing

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    firstName: string,
    lastName: string,
    birthDate: Date,
    email: string,
    password: string,
    bio: string,
    showAge: boolean,
    showEmail: boolean,
    role: string,
  ): Promise<string> {
    // Check if the email is already in use
    const userWithEmail = await this.userRepository.findByEmail(email);
    if (userWithEmail && userWithEmail.email === email) {
      throw new EmailAlreadyInUseError(email);
    }
    // TODO: VALIDACIÓN DE CONTRASEÑA

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create the new user
    const user = User.create({
      firstName,
      lastName,
      birthDate: UserBirthDate.create(birthDate),
      email,
      password: hashedPassword,
      bio,
      showAge,
      showEmail,
      role,
    });

    // Create the new user and save it
    const savedUser = await this.userRepository.save(user);

    // Return the ID of the newly created user
    return savedUser.id.toString();
  }

  async updateUser(id: string, email: string, bio: string): Promise<void> {
    // Find the existing user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError();
    }

    // Check if the email is different
    if (existingUser.email === email) {
      throw new EmailUpdateConflictError();
    }

    // Check if the email is already in use
    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists && emailExists.email === email) {
      throw new EmailAlreadyInUseError(email);
    }

    // Update the user
    existingUser.updateProfile({ email, bio });
    await this.userRepository.save(existingUser);
  }

  async getUserProfile(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
