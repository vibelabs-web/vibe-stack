import React, { type HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    hoverable = false,
    className = '',
    ...props
}) => {
    return (
        <div
            className={`
        ${styles.card} 
        ${hoverable ? styles.hoverable : ''} 
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
