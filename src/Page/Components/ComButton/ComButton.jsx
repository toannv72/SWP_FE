import { Button } from "antd";
import React from "react";

const ComButton = React.forwardRef(
  ({ endIcon, className = "", onClick, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="default"
        size="large"
        shape="round"
        className={`flex w-44 mg mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className} `}
        {...props}
        onClick={endIcon ? undefined : onClick}
      >
        {children}
      </Button>
    );
  }
);

export default ComButton;
