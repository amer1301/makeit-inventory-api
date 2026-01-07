import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

async register(email: string, password: string) {
  const existing = await this.prisma.user.findUnique({ where: { email } });
  if (existing) throw new BadRequestException('Email already in use');

  const hashed = await bcrypt.hash(password, 10);

  const user = await this.prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true, role: true },
  });

  return this.signToken(user.id, user.email, user.role);
}

async login(email: string, password: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, role: true },
  });

  if (!user) throw new UnauthorizedException('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new UnauthorizedException('Invalid credentials');

  return this.signToken(user.id, user.email, user.role);
}

private async signToken(userId: number, email: string, role: string) {
  const payload = { sub: userId, email, role };
  return { access_token: await this.jwtService.signAsync(payload) };
}
}
