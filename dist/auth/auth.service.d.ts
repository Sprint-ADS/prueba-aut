import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: Partial<User>;
    }>;
    private generateToken;
}
