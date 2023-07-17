/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { bgLightPink, fs3, sec } from '../../styles/const';
import { useComp } from '../../hooks/useComp';
import { Container } from '../uiParts/Container';
import { Wrapper } from '../uiParts/Wrapper';
import { Compboard } from '../projects/CompBoard';
// import Trash from '../projects/Trash';
// import Naviboard from '../projects/Naviboard';

export const Comp = (): JSX.Element => {
  const { comp } = useComp();

  return (
    <div css={[sec, bgLightPink]}>
      <Container isSingle={false}>
        <h2 css={fs3}>完了済： {comp.length}件</h2>
        <Wrapper>
          {comp.map((obj) => (
            <Compboard boardId={obj.id} key={obj.id} />
          ))}
        </Wrapper>
      </Container>
    </div>
  );
};
