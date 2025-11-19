import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Supabase } from './services/supabase';
import { TreeViewer } from './tree-viewer/tree-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TreeViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('feynman-processor');
  constructor(private supabaseService: Supabase) {}
  ngOnInit(): void {
    console.log('App initialized');
    this.testSupabaseConnection();
  }
  async testSupabaseConnection() {
    try {
      const {data, error} = await this.supabaseService.supabase
      .storage
      .listBuckets();
      if (error) {
        console.error('Error connecting to Supabase:', error);
      } else {
        console.log('Supabase connection successful. Buckets:', data);
      }
    } catch (e) {
      console.error('Error testing Supabase connection:', e);
    }
  }
}
