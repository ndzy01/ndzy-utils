import { createContext, useContext } from 'react';

type Constructor<T = any> = new (...args: any[]) => T;

type HOC = (Children: React.FC | React.ComponentClass) => (props: Record<string, any>) => JSX.Element;

export const setupStores = <T,>(RootStore: Constructor) => {
  const rootStore = new RootStore();

  const StoreContext = createContext<{
    state: T;
  }>({ state: rootStore });

  const useStores = () => {
    const { state } = useContext(StoreContext);

    return state;
  };

  const withStores: HOC = (Children) => {
    const EnhancedComponent = (props: Record<string, any>) => {
      return (
        <StoreContext.Provider value={{ state: rootStore }}>
          <Children {...props} />
        </StoreContext.Provider>
      );
    };

    return EnhancedComponent;
  };

  return { useStores, withStores, StoreContext };
};
