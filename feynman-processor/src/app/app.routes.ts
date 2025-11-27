import { Routes } from '@angular/router';
import { Login } from './login/login';
import { App } from './app';
import { Home } from './home/home';
export const routes: Routes = [
    // Ruta por defecto (Home)
  // NOTA: Más tarde protegeremos esta ruta con un Guard
  { path: '', component: Home }, 
  
  // Ruta de Login
  { path: 'login', component: Login },
  
  // Redirección por defecto
  { path: '**', redirectTo: '' }
];
