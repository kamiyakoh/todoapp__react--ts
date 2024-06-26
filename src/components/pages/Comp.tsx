import { FC } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { bgLightPink, fs3, sec } from '../../styles/const';
import { useComp } from '../../hooks/useComp';
import { useTrashComp } from '../../hooks/useTrashComp';
import { Container } from '../uiParts/Container';
import { Wrapper } from '../uiParts/Wrapper';
import { CompBoard } from '../projects/CompBoard';
import { Trash } from '../projects/Trash';
import { NaviBoard } from '../projects/NaviBoard';

export const Comp: FC = () => {
  const { comp, setNewComp } = useComp();
  const { trashComp, setNewTrashComp } = useTrashComp();

  return (
    <div css={[sec, bgLightPink]}>
      <Trash isActive={false} distArr={comp} setDist={setNewComp} trashArr={trashComp} setTrash={setNewTrashComp} />
      <Container isSingle={false}>
        <h2 css={fs3}>完了済： {comp.length}件</h2>
        <Wrapper>
          {comp.length < 1 && <NaviBoard isActive={false} isComp />}
          {comp.map((obj) => (
            <CompBoard boardId={obj.id} key={obj.id} />
          ))}
        </Wrapper>
      </Container>
    </div>
  );
};
