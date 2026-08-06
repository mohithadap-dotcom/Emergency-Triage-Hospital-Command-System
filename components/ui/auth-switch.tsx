import { cn } from '@/lib/utils';
import { Building2, LucideIcon, Radio } from 'lucide-react';
import { useState } from 'react';

type AuthPortal = 'HOSPITAL' | 'AMBULANCE';

interface AuthSwitchProps {
  activePortal?: AuthPortal;
  className?: string;
  onPortalChange?: (portal: AuthPortal) => void;
}

const portalOptions: Array<{
  id: AuthPortal;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: 'HOSPITAL',
    title: 'Hospital Operational Authentication',
    description: 'Hospital admin and ER resource access',
    icon: Building2,
  },
  {
    id: 'AMBULANCE',
    title: 'EMS Operational Login',
    description: '108 fleet, driver, and paramedic access',
    icon: Radio,
  },
];

function AuthSwitch({ activePortal, className, onPortalChange }: AuthSwitchProps) {
  const [localPortal, setLocalPortal] = useState<AuthPortal>(activePortal ?? 'HOSPITAL');
  const currentPortal = activePortal ?? localPortal;
  const currentOption = portalOptions.find((option) => option.id === currentPortal) ?? portalOptions[0];

  const handlePortalChange = (portal: AuthPortal) => {
    setLocalPortal(portal);
    onPortalChange?.(portal);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-stone-200 bg-white/90 p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
          <currentOption.icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-stone-950">
            {currentOption.title}
          </h1>
          <h2 className="mt-1 text-sm font-semibold leading-snug text-stone-500">
            {currentOption.description}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {portalOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentPortal === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePortalChange(option.id)}
              aria-pressed={isActive}
              className={cn(
                'flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors duration-200',
                isActive
                  ? 'border-cyan-700 bg-cyan-700 text-white'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const Component = AuthSwitch;
export default AuthSwitch;
