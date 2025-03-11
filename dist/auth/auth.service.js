"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { contraseña, ...userData } = registerDto;
        const userExists = await this.usersRepository.findOne({
            where: { correo: userData.correo },
        });
        if (userExists) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(contraseña, salt);
            const user = this.usersRepository.create({
                ...userData,
                contraseña: hashedPassword,
            });
            await this.usersRepository.save(user);
            const token = this.generateToken(user);
            const { contraseña: _, ...result } = user;
            return { token, user: result };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('El correo ya está registrado');
            }
            throw new common_1.InternalServerErrorException('Error al registrar el usuario');
        }
    }
    async login(loginDto) {
        const { correo, contraseña } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { correo },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const token = this.generateToken(user);
        const { contraseña: _, ...result } = user;
        return { token, user: result };
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            correo: user.correo,
            nombre: user.nombre,
            apellidos: user.apellidos,
            rol: user.rol,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map