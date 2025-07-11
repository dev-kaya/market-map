// Shared configuration constants
export const PUBLIC_COMPANY_LIMIT = parseInt(process.env.PUBLIC_COMPANY_LIMIT || '4', 10);

export const config = {
  publicCompanyLimit: PUBLIC_COMPANY_LIMIT,
} as const;