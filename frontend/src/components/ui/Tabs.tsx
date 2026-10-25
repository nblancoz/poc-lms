export interface TabItem<T extends string> {
  key: T;
  label: string;
}

export interface TabsProps<T extends string> {
  items: Array<TabItem<T>>;
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  activeTab,
  onChange,
  className = '',
}: TabsProps<T>) {
  return (
    <div className={`tabs-nav ${className}`.trim()} role="tablist">
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
