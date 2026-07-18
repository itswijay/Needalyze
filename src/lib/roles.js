// Single source of truth for role UUIDs.
// Falls back to the known database values so existing environments keep
// working without extra configuration, but can be overridden per-environment
// via env vars if the database role IDs ever change.
export const ROLE_IDS = {
  USER:
    process.env.NEXT_PUBLIC_ROLE_USER_ID ||
    '31181c75-79f9-4fee-8629-e706ce8c905b',
  ADMIN:
    process.env.NEXT_PUBLIC_ROLE_ADMIN_ID ||
    'fe33d24b-ed16-4cbb-a236-c642eff30320',
}
