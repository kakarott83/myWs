import { NavItem } from '../models/navitem.model';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Wir', link: 'wir' },
    {
      label: 'Philosophie',
      expanded: true,
      children: [
        { label: 'Warum es funktioniert', link: '/philosophie/warum-es-funktioniert' },
        { label: 'Steine und Bedeutung', link: '/philosophie/steine-und-bedeutung' },
        { label: 'Räucheranleitung', link: '/philosophie/raeucheranleitung' },
        { label: 'Mondkraft nutzen', link: '/philosophie/mondkraft-und-nutzen' },
      ]
    },
    {
      label: 'Shop',
      expanded: true,
      children: [
        {
          label: 'Alles',
          link: '/shop'
        },
        {
          label: 'Armbänder',
          expanded: true,
          children: [
            { label: 'Liebe', link: '/shop/armreif-liebe' },
            { label: 'Schutz', link: '/shop/armreif-sicherheit' },
          ]
        },
        { label: 'Räucherwerk', link: '/shop/raeucherwerk' },
        {
          label: 'Sets',
          expanded: true,
          children: [
            { label: 'Neubeginn', link: '/shop/sets/neubeginn' },
            { label: 'Selfcare', link: '/shop/sets/selfcare' },
            { label: 'Schutzraum', link: '/shop/sets/schutzraum' },
          ]
        }
      ]
    }
  ];