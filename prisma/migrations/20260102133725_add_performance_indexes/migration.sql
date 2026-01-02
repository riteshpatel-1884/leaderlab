-- This is an empty migration.
-- Add indexes for frequently queried fields
   CREATE INDEX IF NOT EXISTS idx_user_username ON "User"(username);
   CREATE INDEX IF NOT EXISTS idx_user_clerk_id ON "User"("clerkId");
   CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
   
   -- Make username case-insensitive index
   CREATE INDEX IF NOT EXISTS idx_user_username_lower ON "User"(LOWER(username));
   
   -- Index for roles lookup
   CREATE INDEX IF NOT EXISTS idx_user_role_user_id ON "UserRole"("userId");