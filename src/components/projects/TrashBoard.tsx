import type { TodoData } from '../../types';
import { memo } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { mq, pink, blue, yellow, green, size2, textPink } from '../../styles/const';
import { Board } from '../uiParts/Board';
import { Button } from '../uiParts/Button';
import { useTrashBoard } from '../../hooks/useTrashBoard';

interface Props {
  isActive: boolean;
  distArr: TodoData[];
  trashArr: TodoData[];
  boardId: number;
  setDist: (newDist: TodoData[]) => void;
  setTrash: (newTrash: TodoData[]) => void;
}

export const TrashBoard = memo((props: Props) => {
  const { isActive, distArr, trashArr, boardId, setDist, setTrash } = props;
  const { board, title, onClickDel, takeOut } = useTrashBoard(distArr, trashArr, boardId, setDist, setTrash);

  return (
    <Board
      cssName={[
        css`
          width: 100%;
          ${mq('pc')} {
            width: 100%;
          }
        `,
        isActive ? yellow : pink,
      ]}
    >
      <div css={boardInner}>
        <div>
          <h3>{title}</h3>
          <ul>
            {board.tasks.map((task) => (
              <li key={task.taskNum} css={task.checked ? [textPink, isActive ? txtDecLT : ''] : ''}>
                {task.value}
              </li>
            ))}
          </ul>
        </div>
        <div css={btnArea}>
          <Button isSubmit={false} cssName={[size2, green]} onClick={takeOut}>
            戻す
          </Button>
          <Button isSubmit={false} cssName={[size2, blue]} onClick={onClickDel}>
            破棄
          </Button>
        </div>
      </div>
    </Board>
  );
});

const boardInner = css`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto;
  gap: 24px;
  height: 100%;
  ${mq('tab')} {
    grid-template-rows: auto;
    grid-template-columns: 1fr auto;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
`;
const btnArea = css`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  ${mq('tab')} {
    align-self: flex-end;
  }
`;
const txtDecLT = css`
  text-decoration: line-through;
`;
