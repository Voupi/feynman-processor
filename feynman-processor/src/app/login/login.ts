import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  constructor(private authService: AuthService, private router: Router){}
  async onLogin(){
    if (!this.email || !this.password) return;
    this.loading = true;
    try {
      const {error} = await this.authService.signIn(this.email, this.password);
      if (error) throw error;
    } catch (error: any) {
      alert("Error al iniciar sesión: "+ error.message)
    } finally {
      this.loading = false;
    }
  }
  async onRegister(){
    if (!this.email || !this.password) return;
    this.loading = true;
    try {
      const {error} = await this.authService.signUp(this.email, this.password);
      if (error) throw error;
      alert('¡Registro Exitoso!, revisa tu bandeja para comprobar la creación de la cuenta')
    } catch (error: any) {
      alert('Error al registrarse: '+error.message);
    } finally {
      this.loading= false;
    }
  }
}
