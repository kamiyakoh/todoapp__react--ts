import toast from 'react-hot-toast';

export const toastSuccess = (): void => {
  toast.success('作成しました');
};
export const toastError = (): void => {
  toast.error('することを入力してください');
};
export const toastTrash = (): void => {
  toast('ゴミ箱へ移動しました', { icon: '🚮' });
};
export const toastSubmit = (): void => {
  toast.success('完了おめでとう');
};
export const toastEdit = (): void => {
  toast.success('編集しました');
};
export const toastDel = (text: string): void => {
  toast(text, { icon: '💥' });
};
export const toastTakeOut = (): void => {
  toast.success('ゴミ箱から戻しました');
};
