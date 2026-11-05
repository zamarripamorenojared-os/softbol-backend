import { Express, Router } from 'express';
import { RoleRoutes } from '../components/roles/roles_routes';
import { UserRoutes } from '../components/users/users_routes';
import { ProjectRoutes } from '../components/projects/projects_routes';
import { TaskRoutes } from '../components/tasks/tasks_routes';
import { CommentRoutes } from '../components/comments/comments_routes';
import { RoomRoutes } from '../components/rooms/rooms_routes';
import { BookingRoutes } from '../components/bookings/bookings_routes';
import { GuestRoutes } from '../components/guests/guests_routes';
import { HealthRoutes } from './health.routes';
import { SoftbolAuthRoutes } from './softbol_auth.routes';
import { SoftbolDomainRoutes } from './softbol_domain.routes';

export class Routes {
  public router!: Router;

  constructor(app: Express) {
    // API v1 Router para SoftbolApp y Endpoints oficiales
    const v1Router = Router();
    new HealthRoutes(v1Router);
    new SoftbolAuthRoutes(v1Router);
    new SoftbolDomainRoutes(v1Router);
    app.use('/api/v1', v1Router);

    const routeClasses = [
      RoleRoutes,
      UserRoutes,
      ProjectRoutes,
      TaskRoutes,
      CommentRoutes,
      RoomRoutes,
      BookingRoutes,
      GuestRoutes
    ];

    for (const RouteClass of routeClasses) {
      try {
        new RouteClass(app);
        console.log(`Router : ${RouteClass.name} - Connected`);
      } catch (error) {
        console.log(`Router : ${RouteClass.name} - Failed`);
      }
    }
  }
}
