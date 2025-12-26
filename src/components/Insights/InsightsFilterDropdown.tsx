import { ChevronDown } from "lucide-react";

export const InsightsFilterDropdown = ({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: any) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 py-2 pl-9 pr-8 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
      >
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  </div>
);
