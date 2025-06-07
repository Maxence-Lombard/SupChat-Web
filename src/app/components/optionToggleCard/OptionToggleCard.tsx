interface OptionToggleCardProps {
  name: string;
  description: string;
  toggle: boolean;
  onToggleChange: (value: boolean) => void;
}

function OptionToggleCard({
  name,
  description,
  toggle,
  onToggleChange,
}: OptionToggleCardProps) {
  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-lg">
      <div>
        <p className="font-semibold"> {name} </p>
        <p className="text-sm text-black/50"> {description} </p>
      </div>
      <input
        type="checkbox"
        className="customSwitch"
        checked={toggle}
        onChange={(e) => onToggleChange(e.target.checked)}
      />
    </div>
  );
}

export default OptionToggleCard;
