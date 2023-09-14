import { ADMIN, USER } from "../constants/index";

const ROLES = {
  User: USER,
  Admin: ADMIN,
};

const checkRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user && !req.roles) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const rolesArray = [...allowedRoles];

    const roleFound = req.roles
      .map((role: string) => rolesArray.includes(role))
      .find((val: boolean) => val === true);
    if (!roleFound) {
      res.status(403);
      throw new Error("Forbidden");
    }
    next();
  };
};

const role = { ROLES, checkRole };

export default role;
