import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useActive } from '../hooks/useActive';
import { useComp } from '../hooks/useComp';
import { useDemoData } from '../hooks/useDemoData';
import { Active } from '../components/pages/Active';
import { Comp } from '../components/pages/Comp';
import { EditActive } from '../components/pages/EditActive';
import { New } from '../components/pages/New';
import { Page404 } from '../components/pages/Page404';

export const Router = (): JSX.Element => {
  const { active } = useActive();
  const { comp } = useComp();
  const { fetch } = useDemoData();

  useEffect(() => {
    if (active.length > 0 || comp.length > 0) return;
    if (window.confirm('初期データとして、インターネットからデモデータを挿入しますか？')) fetch();
  }, [active, comp, fetch]);

  return (
    <Routes>
      <Route path="" element={<New />} />
      <Route path="active">
        <Route path="" element={<Active />} />
        <Route path=":id" element={<EditActive />} />
        <Route path="*" element={<Page404 />} />
      </Route>
      <Route path="comp" element={<Comp />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
