import { QueryCtx, MutationCtx } from "./_generated/server";

export interface UserAuthDetails {
  userId: string | null;
  email?: string;
  role?: string;
  permissions?: string[];
}

/**
 * Retrieves the Clerk user identity details from Convex ctx.auth.
 * The role and permissions are stored in Private Metadata on Clerk,
 * which are passed to Convex via Clerk JWT Custom Claims.
 */
export async function getViewerAuthDetails(
  ctx: { auth: QueryCtx["auth"] | MutationCtx["auth"] }
): Promise<UserAuthDetails> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return { userId: null, permissions: [] };
  }

  // Retrieve role and permissions from JWT custom claims or top-level properties
  const customClaims = (identity.customClaims || {}) as any;
  const role = (customClaims.role || (identity as any).role) as string | undefined;
  
  let permissions: string[] = [];
  const rawPermissions = customClaims.permissions || (identity as any).permissions;
  if (Array.isArray(rawPermissions)) {
    permissions = rawPermissions;
  } else if (typeof rawPermissions === "string") {
    try {
      permissions = JSON.parse(rawPermissions);
    } catch {
      permissions = [rawPermissions];
    }
  }

  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
  if (bootstrapEmail && identity.email === bootstrapEmail) {
    return {
      userId: identity.subject,
      email: identity.email,
      role: "admin",
      permissions: ["dashboard", "products", "categories", "orders", "users", "inventory", "coupons", "ai_generation", "cloudinary", "upload", "settings", "reports"],
    };
  }

  return {
    userId: identity.subject,
    email: identity.email,
    role,
    permissions,
  };
}

/**
 * Enforces that the current viewer is an admin.
 */
export async function requireAdmin(
  ctx: { auth: QueryCtx["auth"] | MutationCtx["auth"] }
): Promise<UserAuthDetails> {
  const authDetails = await getViewerAuthDetails(ctx);
  if (!authDetails.userId) {
    throw new Error("Unauthenticated");
  }
  if (authDetails.role !== "admin") {
    throw new Error("Unauthorized: Admin role required");
  }
  return authDetails;
}

/**
 * Enforces that the current viewer is an admin and has the specified permission.
 */
export async function requirePermission(
  ctx: { auth: QueryCtx["auth"] | MutationCtx["auth"] },
  permission: string
): Promise<UserAuthDetails> {
  const authDetails = await requireAdmin(ctx);
  if (!authDetails.permissions?.includes(permission)) {
    throw new Error(`Unauthorized: Missing permission "${permission}"`);
  }
  return authDetails;
}
