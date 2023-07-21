import { Link } from 'react-router-dom';
import { FC } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { mq, pink, yellow } from '../../styles/const';
import { useActive } from '../../hooks/useActive';
import { useComp } from '../../hooks/useComp';
import { Board } from '../uiParts/Board';
import { Button } from '../uiParts/Button';

interface Props {
  isActive: boolean;
  isComp: boolean;
}

export const NaviBoard: FC<Props> = ({ isActive, isComp }) => {
  const { active } = useActive();
  const { comp } = useComp();

  return (
    <Board cssName={[flexbox, isActive ? pink : yellow]}>
      <Link to="/">
        <Button
          isSubmit={false}
          cssName={[
            sizeResp,
            css`
              --color: #fff;
            `,
          ]}
        >
          作成
        </Button>
      </Link>
      {isActive || active.length < 0 || (
        <Link to="/active">
          <Button isSubmit={false} cssName={[yellow, sizeResp]}>
            進行中 {active.length}
          </Button>
        </Link>
      )}
      {isComp || (
        <Link to="/comp">
          <Button isSubmit={false} cssName={[pink, sizeResp]}>
            完了済 {comp.length}
          </Button>
        </Link>
      )}
    </Board>
  );
};

const flexbox = css`
  display: flex;
  justify-content: space-around;
  ${mq('tab')} {
    justify-content: space-evenly;
  }
`;
const sizeResp = css`
  --size: 1.5;
  ${mq('tab')} {
    --size: 2;
  }
  ${mq('pc')} {
    --size: 3;
  }
`;
