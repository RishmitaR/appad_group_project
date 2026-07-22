import React from 'react';

// Define the shape of the props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, type = 'button', ...rest }) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      {...rest} // Allows passing other standard HTML button attributes (disabled, id, etc.)
    >
      {children}
    </button>
  );
};

export default Button;
