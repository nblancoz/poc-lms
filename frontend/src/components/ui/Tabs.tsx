export interface TabItem<T extends string> {
  key: T;
  label: string;
}

export interface TabsProps<T extends string> {
  items: Array<TabItem<T>>;
  activeTab: T;
  onChange: (tab: T) => void;
  variant?: 'underline' | 'segmented';
  className?: string;
  'aria-label'?: string;
}

export function Tabs<T extends string>({
  items,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
  'aria-label': ariaLabel,
}: TabsProps<T>) {
  const variantClass = variant === 'segmented' ? 'tabs-segmented' : 'tabs-underline';

  return (
    <div
      className={`tabs-nav ${variantClass} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
