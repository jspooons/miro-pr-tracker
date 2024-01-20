import * as React from "react";

const Checkbox = ({onSetChecked}: {
  onSetChecked: (value: boolean) => void;
}) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
    onSetChecked(!checked);
  };

  return (
    <input
        type="checkbox"
        tabIndex={0}
        checked={checked}
        onChange={handleChange}
    />
  );
};

export default Checkbox;