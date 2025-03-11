import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  telefono: string;

  @Column()
  contraseña: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  rol: UserRole;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}