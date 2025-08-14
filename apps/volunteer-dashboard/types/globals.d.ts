export type Roles = 'Volunteer' | 'Administrator';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}