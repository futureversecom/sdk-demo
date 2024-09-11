import React from 'react';

type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  backgroundImage?: string;
};

export const Dialog = ({
  children,
  backgroundImage,
  className,
  ...props
}: DialogProps) => {
  return (
    <div
      className={className ? `sdk-demo-dialog ${className}` : 'sdk-demo-dialog'}
      {...props}
    >
      {children}
    </div>
  );
};

const Container = ({ children, className, ...props }: DialogProps) => (
  <div
    className={
      className
        ? `sdk-demo-dialog-container ${className}`
        : 'sdk-demo-dialog-container'
    }
    {...props}
  >
    {children}
  </div>
);

const Content = ({ children, className, ...props }: DialogProps) => (
  <div
    className={
      className
        ? `sdk-demo-dialog-content ${className}`
        : 'sdk-demo-dialog-content'
    }
    {...props}
  >
    {children}
  </div>
);

Dialog.Container = Container;
Dialog.Content = Content;

export default Dialog;
