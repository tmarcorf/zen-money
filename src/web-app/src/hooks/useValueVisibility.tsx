import { createContext, useContext, useState, ReactNode } from "react";

interface ValueVisibilityContextType {
  visible: boolean;
  toggle: () => void;
  mask: (text: string) => string;
}

const ValueVisibilityContext = createContext<ValueVisibilityContextType>({
  visible: true,
  toggle: () => {},
  mask: (t) => t,
});

export function ValueVisibilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  const toggle = () => setVisible((v) => !v);
  const mask = (text: string) => (visible ? text : "•••••");

  return (
    <ValueVisibilityContext.Provider value={{ visible, toggle, mask }}>
      {children}
    </ValueVisibilityContext.Provider>
  );
}

export const useValueVisibility = () => useContext(ValueVisibilityContext);
