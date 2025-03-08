import Link from 'next/link';

interface NavItemProps {
  href: string;
  label: string;
  icon?: string;
}

export default function NavItem({ href, label, icon }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-1 text-gray-200 hover:text-white transition-colors"
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
