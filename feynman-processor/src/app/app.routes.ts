import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    // Ruta por defecto (Home)
  // NOTA: Más tarde protegeremos esta ruta con un Guard
  { path: '', 
    component: Home,
    canActivate: [authGuard]
  }, 
  
  // Ruta de Login
  { path: 'login', component: Login },
  
  // Redirección por defecto
  { path: '**', redirectTo: '' }
];
