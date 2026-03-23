import useAuth from "../../hooks/useAuth";
import { Permission } from "../../utils/types";

type CanProps = {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const Can = ({ permission, children, fallback = null }: CanProps) => {
  const { can } = useAuth();

  if (!can(permission)) return <>{fallback}</>;

  return <>{children}</>;
};
