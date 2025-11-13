import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environments.development';
import { Product } from '../../shared/models/product.model';


@Injectable({
  providedIn: 'root'
})

export class SupabaseService {

  private supabase!: SupabaseClient;

  constructor() {
      this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase getProducts error', error);
      throw error;
    }

    return data as Product[];
  }

    // Unscharfe Suche in Titel + Beschreibung
  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('Supabase searchProducts error', error);
      throw error;
    }

    return data as Product[];
  }

    // Nach Kategorie filtern
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error('Supabase getProductsByCategory error', error);
      throw error;
    }

    return data as Product[];
  }

  async getProductsBySlug(slug: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('slug', slug);

    if (error) {
      console.error('Supabase getProductsBySlug error', error);
      throw error;
    }

    return data as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    console.log('[getProductById] Param id =', JSON.stringify(id));

    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // genau ein Produkt erwartet

    console.log('[getProductById] data =', data);
    console.log('[getProductById] error =', error);

    
    if (error) {
      console.error('Supabase getProductById error', error);
      throw error;
    }

    return data as Product | null;
  }










}
