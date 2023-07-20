import toast from 'react-hot-toast';

export const toastCustom = (text: string, i: string): void => {
  toast(text, { icon: `${i}` });
};
export const toastSuccess = (text: string): void => {
  toast.success(text);
};
export const toastError = (text: string): void => {
  toast.error(text);
};
