import React, { useContext, createContext, useEffect, useState } from "react";

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: any) => {
  const [toastMessage, setToastMessage] = useState<string | null>("");

  return (
    <ToastContext.Provider
      value={{
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

export default ToastContext;
