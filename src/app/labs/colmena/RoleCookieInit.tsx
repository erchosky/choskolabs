"use client";

import { useEffect } from "react";

/**
 * Siembra las cookies del laboratorio en el navegador (rol e idioma) si no
 * existen, con Path=/labs/colmena para que solo vivan dentro del lab.
 * El jugador podrá verlas y editarlas en DevTools → Application → Cookies.
 */
export function RoleCookieInit() {
  useEffect(() => {
    const has = (name: string) => document.cookie.split("; ").some((c) => c.startsWith(`${name}=`));
    const base = "; Path=/labs/colmena; SameSite=Lax; Max-Age=86400";
    if (!has("colmena_role")) document.cookie = `colmena_role=member${base}`;
    if (!has("colmena_lang")) document.cookie = `colmena_lang=es${base}`;
    if (!has("colmena_member")) document.cookie = `colmena_member=m-3309${base}`;
  }, []);
  return null;
}
