import { useParams, useNavigate } from 'react-router-dom';
import { FC, useEffect } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  bgLightYellow,
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
import { useEditActive } from '../../hooks/useEditActive';
import { Container } from '../uiParts/Container';
import { Board } from '../uiParts/Board';
import { Button } from '../uiParts/Button';

export const EditActive: FC = () => {
  const { id } = useParams();
  const {
    board,
    register,
    handleSubmit,
    formState,
    fields,
    onSubmit,
    isError,
    isInline,
    taskCount,
    addTask,
    reduceTask,
    startComposition,
    endComposition,
    onKeydownTitle,
    onKeydown,
  } = useEditActive(Number(id));

  const navigate = useNavigate();
  useEffect(() => {
    if (board.id === -1) {
      navigate('404');
    }
  }, [board, navigate]);

  if (board.id === -1) return <div></div>;
  return (
    <div css={[sec, bgLightYellow]}>
      <Container isSingle>
        <h2 css={fs3}>編集中のID： {id}</h2>
        <Board cssName={singleBoard}>
          <form css={form} onSubmit={handleSubmit(onSubmit)}>
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
                      defaultValue={field.value}
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
            {formState.isDirty && (
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
                決定
              </Button>
            )}
          </form>
        </Board>
      </Container>
    </div>
  );
};
