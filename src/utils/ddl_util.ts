import { RolesService } from '../components/roles/roles_service';
import { UsersService } from '../components/users/users_service';
import { Rights, encryptString } from './common';
import { DatabaseUtil } from './db';

export class DDLUtil {
  public static async init(): Promise<void> {
    console.log(`Proceso Maestro PID: ${process.pid}`);
    console.log('Conectado a la base de datos PostgreSQL exitosamente');

    new DatabaseUtil();
    const rolesService = new RolesService();
    const usersService = new UsersService();

    // 1. Crear o verificar Rol SuperAdmin
    const allPermissions = [
      Rights.ROLES.ALL,
      Rights.USERS.ALL,
      Rights.PROJECTS.ALL,
      Rights.TASKS.ALL,
      Rights.COMMENTS.ALL
    ].join(',');

    let superAdminRole: any = null;
    const existingRoles = await rolesService.findAll({ name: 'SuperAdmin' });
    if (existingRoles.statusCode === 200 && Array.isArray(existingRoles.data) && existingRoles.data.length > 0) {
      superAdminRole = existingRoles.data[0];
      console.log('Rol SuperAdmin existente encontrado.');
    } else {
      const roleResult = await rolesService.create({
        name: 'SuperAdmin',
        description: 'Acceso total con todos los derechos del sistema',
        rights: allPermissions
      });
      console.log('Resultado de Agregar Rol por Defecto:');
      console.log(JSON.stringify(roleResult, null, 2));
      superAdminRole = roleResult.data;
    }

    // 2. Crear o verificar Usuario SuperAdmin
    const existingUsers = await usersService.findAll({ username: 'superadmin' });
    if (existingUsers.statusCode === 200 && Array.isArray(existingUsers.data) && existingUsers.data.length > 0) {
      console.log('Usuario superadmin ya existe.');
    } else {
      const hashedPassword = await encryptString('Admin@123');
      const userResult = await usersService.create({
        fullname: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@pms.com',
        password: hashedPassword,
        role_id: superAdminRole?.role_id,
        role_ids: superAdminRole?.role_id ? [superAdminRole.role_id] : []
      });
      console.log('Resultado de Agregar Usuario por Defecto:');
      console.log(JSON.stringify(userResult, null, 2));
    }
  }
}
