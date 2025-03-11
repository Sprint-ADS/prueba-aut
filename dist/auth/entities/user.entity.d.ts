export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    contraseña: string;
    rol: UserRole;
    fechaCreacion: Date;
}
