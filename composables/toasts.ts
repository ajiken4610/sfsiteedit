let counter = 0;
export const showToast = (toast: {
  title?: string;
  subtitle?: string;
  body: string;
}) => {
  const toasts = useState<
    {
      title?: string;
      subtitle?: string;
      body: string;
      key: number;
    }[]
  >("toasts", () => []);
  toasts.value.push({ ...toast, key: counter++ });
  setTimeout(() => toasts.value.shift(), 5000);
};

export const getShowingToasts = () =>
  useState<
    {
      title?: string;
      subtitle?: string;
      body: string;
      key: number;
    }[]
  >("toasts", () => []);
