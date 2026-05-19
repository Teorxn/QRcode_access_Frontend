export const endpoints = {
  authLogin: "/auth/login",
  authLogout: "/auth/logout",
  employees: "/empleados",
  areas: "/areas",
  accessHistory: "/accesos",
  scanValidate: "/qr/validar",
  qrGenerate: "/qr/generar",
  qr: "/qr",
  dashboardStats: "/dashboard/stats",
  dashboardTrend: "/dashboard/trend",
  reportsAccessPdf: "/reportes/accesos/pdf",
  reportsAccessExcel: "/reportes/accesos/excel",
} as const;

