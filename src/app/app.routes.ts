import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing.page/landing.page.component').then(m => m.LandingPageComponent) },
    { path: 'catalog', loadComponent: () => import('./features/catalog/catalog/catalog.page.component').then(m => m.CatalogPageComponent) },
    { path: 'product/:id', loadComponent: () => import('./features/catalog/product/product.page.component').then(m => m.ProductPageComponent) },
    { path: 'cart', loadComponent: () => import('./features/cart/cart.page.component').then(m => m.CartPageComponent) },
    { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.page/checkout.page.component').then(m => m.CheckoutPageComponent) },
    { path: '**', redirectTo: '' }
];
