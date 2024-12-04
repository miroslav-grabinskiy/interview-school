export function postgresEnumValueToString<T>(value: string): T {
  return value.replace(/[{"}]/g, '') as T;
}

export function stringToPostgresEnum<T>(value: string): T {
  return `{"${value}"}` as T;
}
