/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { fs3, bgLightYellow, sec } from '../../styles/const';
import { useActive } from '../../hooks/useActive';
// import { useTrashActive } from '../../hooks/useTrashActive';
import { Container } from '../uiParts/Container';
import { Wrapper } from '../uiParts/Wrapper';
import { Activeboard } from '../projects/ActiveBoard';
// import Trash from '../projects/Trash';
// import Naviboard from '../projects/Naviboard';

export const Active = (): JSX.Element => {
  const { active } = useActive();
  // const { trashActive, setNewTrashActive } = useTrashActive();

  return (
    <div css={[sec, bgLightYellow]}>
      <Container isSingle={false}>
        <h2 css={fs3}>進行中： {active.length}件</h2>
        <Wrapper>
          {active.map((obj) => (
            <Activeboard key={obj.id} boardId={obj.id} />
          ))}
        </Wrapper>
      </Container>
    </div>
  );
};