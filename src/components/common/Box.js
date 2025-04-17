import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/styles/components/box.module.scss';

function Box({ 
  children, 
  bgColor = 'white', 
  radius = 'medium',
  padding = 'medium',
  className = '', 
  ...rest 
}) {
  return (
    <section 
      className={`${styles.box} ${styles[`box--${bgColor}`]} ${styles[`box--radius-${radius}`]} ${styles[`box--padding-${padding}`]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

Box.propTypes = {
  children: PropTypes.node,
  bgColor: PropTypes.oneOf(['white', 'gray']),
  radius: PropTypes.oneOf(['8', '12', '16', '20', '32']),
  padding: PropTypes.oneOf(['none', '12', 'medium', '32']),
  className: PropTypes.string
};

export default Box;