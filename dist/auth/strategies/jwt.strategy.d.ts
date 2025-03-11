import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    private configService;
    constructor(usersRepository: Repository<User>, configService: ConfigService);
    validate(payload: any): Promise<{
        id: string;
        nombre: string;
        apellidos: string;
        correo: string;
        telefono: string;
        rol: import("../entities/user.entity").UserRole;
        fechaCreacion: Date;
    }>;
}
export {};
