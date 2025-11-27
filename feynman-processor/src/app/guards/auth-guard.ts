import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  //1. Se inyectan las dependencias como si fuera un contructor
  const supabase = inject(SupabaseService).supabase;
  const router = inject(Router);
  // 2. Preguntamos a Supabase si hay una sesión activa
  // getSession es mejor que getUser para verificaciones rápidas de token local
  const {data} = await supabase.auth.getSession();
  if (data.session) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
