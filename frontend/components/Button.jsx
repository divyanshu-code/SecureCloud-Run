import React from 'react';
import Link from 'next/link';
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-text hover:bg-primary-hover shadow-md hover:shadow-glow-primary focus:ring-primary',
    secondary: 'bg-card text-text border border-white/10 hover:bg-white/5 focus:ring-white/20',
    ghost: 'bg-transparent text-text hover:bg-white/10 focus:ring-white/20',
    danger: 'bg-danger text-text hover:bg-danger-hover shadow-md focus:ring-danger'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const styles = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  if (props.href) {
    // If href is passed, render a Next.js Link
    return (
      <Link className={styles} {...props}>
        {Icon && iconPosition === 'left' && <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" />}
      </Link>
    );
  }

  // Otherwise render a standard button
  return (
    <button className={styles} {...props}>
      {Icon && iconPosition === 'left' && <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" />}
    </button>
  );
}
