import * as React from "react";

const Checkbox = ({
  isChecked,
  onSetChecked,
}: {
  isChecked: boolean;
  onSetChecked: (value: boolean) => void;
}) => {
  const handleChange = () => {
    onSetChecked(!isChecked);
  };

  return (
    <label className="checkbox">
      <input
        type="checkbox"
        tabIndex={0}
        checked={isChecked}
        onChange={handleChange}
      />
      <span></span>
    </label>
  );
};

export default Checkbox;