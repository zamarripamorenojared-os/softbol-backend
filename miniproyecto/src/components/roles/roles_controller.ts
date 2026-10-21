import { Request, Response } from 'express';
import { RolesService } from './roles_service';
import { Rights } from '../../utils/common';
import { In } from 'typeorm';

export class RolesUtil {
  public static getAllPermissionsFromRights(): string[] {
    const permissions: string[] = [];
    const extract = (obj: any) => {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
          obj[key].split(',').forEach((p: string) => {
            const trimmed = p.trim();
            if (trimmed && !permissions.includes(trimmed)) {
              permissions.push(trimmed);
            }
          });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          extract(obj[key]);
        }
      }
    };
    extract(Rights);
    return permissions;
  }

  public static async getAllRightsFromRoles(roleIds: string[] | string): Promise<string[]> {
    if (!roleIds) return [];
    const ids = Array.isArray(roleIds) ? roleIds : [roleIds];
    if (ids.length === 0) return [];

    try {
      const service = new RolesService();
      const response = await service.findAll();
      const allRoles: any[] = Array.isArray(response.data) ? response.data : [];
      const matchingRoles = allRoles.filter(r => ids.includes(r.role_id));

      const rightsSet = new Set<string>();
      matchingRoles.forEach(role => {
        if (role.rights) {
          role.rights.split(',').forEach((right: string) => rightsSet.add(right.trim()));
        }
      });
      return Array.from(rightsSet);
    } catch {
      return [];
    }
  }
}

export class RoleController {
  private service: RolesService;

  constructor() {
    this.service = new RolesService();
  }

  public addHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.create(req.body);
    res.status(result.statusCode).json(result);
  };

  public getAllHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.findAll(req.query);
    res.status(result.statusCode).json(result);
  };

  public getOneHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.findOne(req.params.id);
    res.status(result.statusCode).json(result);
  };

  public getDetailsHandler = async (req: Request, res: Response): Promise<void> => {
    return this.getOneHandler(req, res);
  };

  public updateHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.update(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  };

  public deleteHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.delete(req.params.id);
    res.status(result.statusCode).json(result);
  };
}
