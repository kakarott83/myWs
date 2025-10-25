export interface NavItem {
    label: string;
    link?: string;        // optional, wenn klickbar
    children?: NavItem[]; // optional, wenn hat Unterpunkte
    expanded?: boolean;   // Startzustand
  }