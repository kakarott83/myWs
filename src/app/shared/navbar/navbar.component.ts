import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterLinkActive  } from '@angular/router';
import { NgIf, NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { inject } from '@angular/core';
import { NAV_ITEMS } from './nav.data';
import { NavItem } from '../models/navitem.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, NgTemplateOutlet, RouterLinkActive ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private _items = signal<NavItem[]>(NAV_ITEMS);
  items = this._items;

  isExpanded(node: NavItem) {
    return node.expanded !== false;
  }
  toggle(node: NavItem) {
    node.expanded = !this.isExpanded(node);
    // trigger change for signals by reassigning shallow copy
    this._items.set([...this._items()]);
  }

}
