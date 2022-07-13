const toasts = ref<
  {
    title?: string;
    subtitle?: string;
    body: string;
    key: number;
  }[]
>([]);
let counter = 0;
export const showToast = (toast: {
  title?: string;
  subtitle?: string;
  body: string;
}) => {
  toasts.value.push({ ...toast, key: counter++ });
  setTimeout(() => toasts.value.shift(), 5000);
};

export const getShowingToasts = () => toasts;
