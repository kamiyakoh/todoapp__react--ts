import { Route, Routes } from 'react-router-dom';
// import { useActive } from '../hooks/useActive';
// import { useComp } from "../hooks/useComp";

import { New } from '../components/pages/New';

export const Router = (): JSX.Element => {
  // const { active } = useActive();
  // const { comp } = useComp();

  return (
    <Routes>
      <Route path="" element={<New />} />
    </Routes>
  );
};
