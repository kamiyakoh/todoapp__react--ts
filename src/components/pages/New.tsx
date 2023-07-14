import { Link } from 'react-router-dom';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
import { useActive } from '../../hooks/useActive';
import { useComp } from '../../hooks/useComp';
import { useCustomForm } from '../../hooks/useCustomForm';
import { Container } from '../uiParts/Container';
import { Board } from '../uiParts/Board';
import { Button } from '../uiParts/Button';
import {
  mq,
  pink,
  blue,
  yellow,
  size3,
  textOrange,
  dInline,
  dNone,
  fs3,
  fwBold,
  sec,
  singleBoard,
  form,
} from '../../styles/const';

export const New = (): JSX.Element => {
  const { active } = useActive();
  const { comp } = useComp();
  const {
    register,
    handleSubmit,
    fields,
    isError,
    submitNew,
    isInline,
    taskCount,
    addTask,
    reduceTask,
    startComposition,
    endComposition,
    onKeydownTitle,
    onKeydown,
  } = useCustomForm();

  return (
    <div css={sec}>
      <Container isSingle>
        <h2 css={fs3}>作成</h2>
        <p>することを1つ以上は必ず入力してください</p>
        <Board cssName={[singleBoard, yellow, counter]}>
          <Link to="./active">
            <Button isSubmit={false} cssName={[yellow, sizeResp]}>
              進行中 {active.length}
            </Button>
          </Link>
          <Link to="./comp">
            <Button isSubmit={false} cssName={[pink, sizeResp]}>
              完了済 {comp.length}
            </Button>
          </Link>
        </Board>
        <Board cssName={singleBoard}>
          <form css={form} onSubmit={handleSubmit(submitNew)}>
            <div>
              <label htmlFor="newTitle">
                <span css={fwBold}>タイトル</span>
                <br />
                <input
                  {...register('title')}
                  onCompositionStart={startComposition}
                  onCompositionEnd={endComposition}
                  onKeyDown={(e) => {
                    onKeydownTitle(e);
                  }}
                />
                <br />
              </label>
              <label htmlFor="tasks">
                <span css={fwBold}>すること</span>
                <br />
                <span css={[isError ? dInline : dNone, fwBold, textOrange]}>
                  することを1つ以上は必ず入力してください
                </span>
                <div id="taskInputs">
                  {fields.map((field, index) => (
                    <input
                      key={field.id}
                      {...register(`tasks.${index}.value`)}
                      onCompositionStart={startComposition}
                      onCompositionEnd={endComposition}
                      onKeyDown={(e) => {
                        onKeydown(e, index);
                      }}
                    />
                  ))}
                </div>
              </label>
              <Button isSubmit={false} cssName={pink} onClick={addTask}>
                追加する
              </Button>
              <Button
                isSubmit={false}
                btnId="btnReduce"
                cssName={[
                  isInline ? dInline : dNone,
                  blue,
                  css`
                    margin-left: 24px;
                  `,
                ]}
                onClick={() => {
                  reduceTask(taskCount);
                }}
              >
                枠を減らす
              </Button>
            </div>
            <Button
              isSubmit
              cssName={[
                yellow,
                size3,
                css`
                  align-self: flex-end;
                `,
              ]}
            >
              作成
            </Button>
          </form>
        </Board>
      </Container>
      <Toaster />
    </div>
  );
};

const counter = css`
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
