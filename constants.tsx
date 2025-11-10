
import type { MockupCategory } from './types';
import { ShirtIcon, BuildingStorefrontIcon, PackageIcon, NewspaperIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, DeviceTabletIcon, TagIcon } from './components/Icons';

export const CATEGORIES: MockupCategory[] = [
  { id: 't-shirt', name: 'Camiseta', icon: ShirtIcon },
  { id: 'storefront', name: 'Fachada', icon: BuildingStorefrontIcon },
  { id: 'packaging', name: 'Embalagem', icon: PackageIcon },
  { id: 'stationery', name: 'Papelaria', icon: NewspaperIcon },
  { id: 'mobile', name: 'Mobile', icon: DevicePhoneMobileIcon },
  { id: 'desktop', name: 'Desktop', icon: ComputerDesktopIcon },
  { id: 'tablet', name: 'Tablet', icon: DeviceTabletIcon },
  { id: 'branding', name: 'Etiqueta', icon: TagIcon },
];
