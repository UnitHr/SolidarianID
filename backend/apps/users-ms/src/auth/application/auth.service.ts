import { Injectable } from '@nestjs/common';

export abstract class AuthService {
  abstract signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }>;

  abstract signOauth2(email: string): Promise<{ access_token: string }>;
}
