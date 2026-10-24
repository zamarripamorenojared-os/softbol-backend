import { UsersService } from '../components/users/users_service';
import { CacheUtil } from './cache_util';
import { Users } from '../components/users/users_entity';

export class UsersUtil {
  /**
   * Obtiene un usuario por nombre de usuario
   */
  public static async getUserFromUsername(username: string): Promise<Users | null> {
    const service = new UsersService();
    const result = await service.findAll({ username });
    if (result.statusCode === 200 && Array.isArray(result.data) && result.data.length > 0) {
      return result.data[0] as Users;
    }
    return null;
  }

  /**
   * Obtiene un usuario por correo electrónico
   */
  public static async getUserByEmail(email: string): Promise<Users | null> {
    const service = new UsersService();
    const result = await service.findAll({ email });
    if (result.statusCode === 200 && Array.isArray(result.data) && result.data.length > 0) {
      return result.data[0] as Users;
    }
    return null;
  }

  /**
   * Precarga masiva de usuarios en la caché de Redis al arrancar el servidor
   */
  public static async putAllUsersInCache(): Promise<void> {
    try {
      const userService = new UsersService();
      const result = await userService.findAll({});
      if (result.statusCode === 200 && Array.isArray(result.data)) {
        const users = result.data as any[];
        for (const user of users) {
          const userCopy = { ...user };
          delete userCopy.password;
          await CacheUtil.set('User', userCopy.user_id, userCopy);
        }
        console.log('Todos los usuarios han sido cargados exitosamente en la caché');
      } else {
        console.error(`Error al ejecutar putAllUsersInCache: ${result.message}`);
      }
    } catch (error) {
      console.error('Error durante cache warm-up de usuarios:', error);
    }
  }
}
