import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(username: string, password: string) {
    if (username !== 'gaoyu' || password !== 'gjy321456') {
      throw new UnauthorizedException('账号或密码错误');
    }
    return { accessToken: await this.jwt.signAsync({ sub: username, username }), username };
  }
}
