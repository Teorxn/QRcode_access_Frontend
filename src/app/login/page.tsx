"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      router.replace("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
          setError("Credenciales inválidas. Verifique su usuario y contraseña.");
        } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setError("No se pudo conectar con el servidor. Verifique que el backend esté activo.");
        } else {
          setError(err.message || "Ocurrió un error inesperado.");
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1729]">
        <div className="w-10 h-10 border-4 border-[#4318ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans" id="login-page">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#1b2e6e] via-[#2b4592] to-[#3754ab] flex-col justify-between p-12">
        {/* Decorative shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-2xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full" />

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M9 8h1" />
              <path d="M9 12h1" />
              <path d="M9 16h1" />
              <path d="M14 8h1" />
              <path d="M14 12h1" />
              <path d="M14 16h1" />
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">Control Acceso</span>
            <span className="text-white/60 text-sm">I.U. Pascual Bravo</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
            </div>
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight">
            Sistema de Control<br />de Acceso QR
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            Gestione los accesos de empleados en tiempo real mediante códigos QR. 
            Monitoree entradas, salidas y genere reportes de forma segura.
          </p>
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">24/7</span>
              <span className="text-white/50 text-xs">Monitoreo</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">QR</span>
              <span className="text-white/50 text-xs">Validación</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">PDF</span>
              <span className="text-white/50 text-xs">Reportes</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} I.U. Pascual Bravo — Tradición, transformación e innovación
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-[#0f1729] px-6 py-12 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(67,24,255,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,_rgba(43,69,146,0.1)_0%,_transparent_50%)]" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="bg-[#2b4592] rounded-xl p-3 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M9 8h1" />
                <path d="M9 12h1" />
                <path d="M9 16h1" />
                <path d="M14 8h1" />
                <path d="M14 12h1" />
                <path d="M14 16h1" />
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">Control Acceso</span>
              <span className="text-white/50 text-sm">I.U. Pascual Bravo</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">Iniciar Sesión</h2>
            <p className="text-white/50 text-sm">Ingrese sus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="login-form">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2" id="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Username field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="login-username" className="text-white/70 text-sm font-medium">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/30 rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#4318ff] focus:bg-white/[0.08] focus:ring-1 focus:ring-[#4318ff]/50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-white/70 text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/30 rounded-xl py-3.5 pl-12 pr-12 text-sm outline-none transition-all focus:border-[#4318ff] focus:bg-white/[0.08] focus:ring-1 focus:ring-[#4318ff]/50 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="login-submit"
              className="w-full bg-gradient-to-r from-[#4318ff] to-[#6b47ff] text-white font-semibold py-3.5 rounded-xl text-sm transition-all hover:shadow-[0_8px_30px_rgba(67,24,255,0.35)] hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p className="text-white/30 text-xs text-center mt-8">
            Acceso exclusivo para personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
