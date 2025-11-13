import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root',
})
export class Supabase{
  public supabase: SupabaseClient;
  constructor() {  
    this.supabase = createClient('https://wdancutzioliwrbdyxzb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYW5jdXR6aW9saXdyYmR5eHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDQ0ODcsImV4cCI6MjA3ODYyMDQ4N30.qI8LI1Gg5ddHY0NEICvRh9Pr0uiWErjWdFAxFvG2xbU')
  }
}
