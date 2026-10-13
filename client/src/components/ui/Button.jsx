import React from 'react';
import clsx from "clsx";

const Button = ({className, label, icon, type , onClick =() => {}, ...rest}) => {
    return (
        <button
            type={type}
            className={clsx("px-2 py-1.5 outline-none rounded font-semibold", className)}
            onClick={onClick}
            {...rest}
        >
            {icon && icon}
            <span>{label}</span>
        </button>
    );
};

export default Button;
