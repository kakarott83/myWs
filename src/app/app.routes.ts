import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing.page/landing.page.component').then(m => m.LandingPageComponent) },
    { path: 'catalog', loadComponent: () => import('./features/catalog/catalog/catalog.page.component').then(m => m.CatalogPageComponent) },
    { path: 'wir', loadComponent: () => import('./features/we/we.component').then(m => m.WeComponent) },
    { path: 'philosophie/warum-es-funktioniert', loadComponent: () => import('./features/why-ithappen/why-ithappen.component').then(m => m.WhyIthappenComponent) },
    { path: 'philosophie/raeucheranleitung', loadComponent: () => import('./features/smok/smok.component').then(m => m.SmokComponent) },
    { path: 'philosophie/mondkraft-und-nutzen', loadComponent: () => import('./features/moon/moon.component').then(m => m.MoonComponent) },
    { path: 'philosophie/steine-und-bedeutung', loadComponent: () => import('./features/stone/stone.component').then(m => m.StoneComponent) },
    { path: 'shop', loadComponent: () => import('./features/catalog/catalog/catalog.page.component').then(m => m.CatalogPageComponent) },
    { path: 'shop/:slug', loadComponent: () => import('./features/catalog/catalog/catalog.page.component').then(m => m.CatalogPageComponent) },
    { path: 'shop/detail/:id', loadComponent: () => import('./features/catalog/product/product.page.component').then(m => m.ProductPageComponent) },
    { path: 'cart', loadComponent: () => import('./features/cart/cart.page.component').then(m => m.CartPageComponent) },
    { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.page/checkout.page.component').then(m => m.CheckoutPageComponent) },
    { path: 'kontakt', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
    { path: '**', redirectTo: '' }
];
