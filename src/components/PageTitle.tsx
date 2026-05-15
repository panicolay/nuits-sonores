import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

type PageTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("");
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(title: string) {
  const ctx = useContext(PageTitleContext);
  // useLayoutEffect avoids a paint with the previous route's title
  useLayoutEffect(() => {
    ctx?.setTitle(title);
  }, [ctx, title]);
}

export function usePageTitleValue(): string {
  return useContext(PageTitleContext)?.title ?? "";
}
