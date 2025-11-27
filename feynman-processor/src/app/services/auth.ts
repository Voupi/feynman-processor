import { Injectable, signal } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  // Signal para saber quién es el usuario actual (null = nadie)
  currentUser = signal<User | null>(null);
  constructor(private supabaseService: SupabaseService, private router: Router){
    this.supabase = this.supabaseService.supabase;
    // Al iniciar, verificamos si ya había una sesión guardada (recargar página)
    this.supabase.auth.getUser().then(({data}) => {
      this.currentUser.set(data.user);
    });
    // Escuchar los cambios, si se loguea o desloguea en otra pestaña
    this.supabase.auth.onAuthStateChange ((event, session) => {
      console.log("Evento Auth", event);
      this.currentUser.set(session?.user || null);
  
      if (event === 'SIGNED_OUT') {
        this.router.navigate(['/login']);
      }
    });
  }
  // 1. REGISTRARSE
  async signUp (email: string, password: string){
    const {data, error} = await this.supabase.auth.signUp(
      {
        email,
        password
      }
    );
    return {data, error};
  }
  // 2. INICIAR SESIÓN
  async signIn(email: string, password: string){
    const {data, error} = await this.supabase.auth.signInWithPassword({
      email, password
    });
    if (data.user){
      this.currentUser.set(data.user);
      this.router.navigate(["/"]);
    }
    return {data, error};
  }
  // 3. CERRAR SESIÓN
  async signOut(){
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.router.navigate(['/login'])
  }
}
