const toasts: {
  title?: string;
  subtitle?: string;
  body: string;
  key: number;
}[] = [];
let counter = 0;
export const showToast = (toast: {
  title?: string;
  subtitle?: string;
  body: string;
}) => {
  toasts.push({ ...toast, key: counter++ });
  setInterval(() => toasts.shift(), 5000);
};

export const getShowingToasts = () => toasts;
