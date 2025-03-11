import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ token: string; user: Partial<User> }> {
    const { contraseña, ...userData } = registerDto;

    // Check if user already exists
    const userExists = await this.usersRepository.findOne({
      where: { correo: userData.correo },
    });

    if (userExists) {
      throw new ConflictException('El correo ya está registrado');
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(contraseña, salt);

      // Create new user
      const user = this.usersRepository.create({
        ...userData,
        contraseña: hashedPassword,
      });

      await this.usersRepository.save(user);

      // Generate JWT
      const token = this.generateToken(user);

      // Return user without password
      const { contraseña: _, ...result } = user;
      return { token, user: result };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El correo ya está registrado');
      }
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const { correo, contraseña } = loginDto;

    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { correo },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generate JWT
    const token = this.generateToken(user);

    // Return user without password
    const { contraseña: _, ...result } = user;
    return { token, user: result };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      correo: user.correo,
      nombre: user.nombre,
      apellidos: user.apellidos,
      rol: user.rol,
    };
    return this.jwtService.sign(payload);
  }
}