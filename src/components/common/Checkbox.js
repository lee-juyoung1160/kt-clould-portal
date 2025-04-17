import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/components/checkBox.scss';

const Checkbox = ({ 
  id, 
  name,
  label, 
  checked, 
  onChange, 
  tabIndex 
}) => {
  return (
    <div className="check-item">
      <input 
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        tabIndex={tabIndex}
      />
      <label htmlFor={id}>
        <span></span>
        <strong>{label}</strong>
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  tabIndex: PropTypes.number
};

export default Checkbox;