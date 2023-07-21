import type { TodoData } from '../../types';
import { FC, memo } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import trashbox from '../../assets/icon/trashbox.png';
import { mq, pink, blue, dBlock, dNone } from '../../styles/const';
import { useModal } from '../../hooks/useModal';
import { useTrash } from '../../hooks/useTrash';
import { Container } from '../uiParts/Container';
import { Wrapper } from '../uiParts/Wrapper';
import { Button } from '../uiParts/Button';
import { TrashBoard } from './TrashBoard';

interface Props {
  isActive: boolean;
  distArr: TodoData[];
  setDist: (newDist: TodoData[]) => void;
  trashArr: TodoData[];
  setTrash: (newTrash: TodoData[]) => void;
}

export const Trash: FC<Props> = memo(({ isActive, distArr, setDist, trashArr, setTrash }) => {
  const { isOpen, isScale, isShow, openModal, closeModal } = useModal();
  const { checkedIds, allDel, handleToggle, dels } = useTrash(trashArr, setTrash);

  return (
    <div
      css={[
        container,
        isOpen
          ? css`
              pointer-events: auto;
            `
          : css`
              pointer-events: none;
            `,
      ]}
    >
      <Container isSingle={false} cssName={wrapper}>
        {isOpen || (
          <button type="button" css={btnTrash} onClick={openModal}>
            <img src={trashbox} alt="trashbox" css={btnImg} />
          </button>
        )}
        {isOpen && (
          <div css={overlay}>
            <div css={inner}>
              <div css={[base, isScale ? scale : '']} />
              {isShow && (
                <Button isSubmit={false} cssName={[pink, sizeResp, btnAllDel]} onClick={allDel}>
                  ゴミ箱を空にする
                </Button>
              )}
              <div css={[contents, isShow ? dBlock : dNone]}>
                <Wrapper
                  cssName={css`
                    padding: 0;
                  `}
                >
                  {trashArr.map((obj) => (
                    <label
                      htmlFor={`${obj.id}`}
                      key={obj.id}
                      css={[label, checkedIds[obj.id].checked ? bgColorChecked : '']}
                    >
                      <input
                        type="checkbox"
                        id={`${obj.id}`}
                        css={checkbox}
                        checked={checkedIds[obj.id].checked}
                        onChange={() => {
                          handleToggle(obj.id);
                        }}
                      />
                      <TrashBoard
                        isActive={isActive}
                        distArr={distArr}
                        trashArr={trashArr}
                        boardId={obj.id}
                        setDist={setDist}
                        setTrash={setTrash}
                      />
                    </label>
                  ))}
                </Wrapper>
              </div>
              {isShow && (
                <Button
                  isSubmit={false}
                  cssName={[blue, sizeResp, btnDels]}
                  onClick={() => {
                    dels();
                  }}
                >
                  まとめて破棄
                </Button>
              )}
              {isShow && (
                <button type="button" css={[btnTrash, btnClose]} onClick={closeModal}>
                  <span css={iconClose} />
                </button>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
});

const bgColor = '#eee';
const container = css`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
  width: 100vw;
  height: 100vh;
`;
const wrapper = css`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 90vh;
  max-width: 1280px;
  margin: 5vh auto 0;
`;
const btnTrash = css`
  pointer-events: auto;
  background: ${bgColor};
  border-radius: 5%;
  width: 64px;
  height: 64px;
`;
const btnImg = css`
  display; inline-block;
  width: 48px;
  height: 48px;
  margin: auto;
`;
const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
`;
const inner = css`
  position: relative;
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
`;
const base = css`
  position: absolute;
  right: 0;
  bottom: 5%;
  background: ${bgColor};
  width: 1%;
  height: 1%;
  border-radius: 1%;
  margin-right: 5%;
  transform-origin: bottom right;
  transition: all 0.3s ease-in-out;
  ${mq('ex')} {
    margin: 0;
  }
`;
const scale = css`
  transform: scale(90, 90);
  ${mq('ex')} {
    transform: scale(100, 90);
  }
`;
const contents = css`
  position: absolute;
  top: 15%;
  left: 6.5%;
  z-index: 40;
  width: 87%;
  height: 70%;
  overflow-y: auto;
`;
const sizeResp = css`
  --size: 1.5;
  ${mq('tab')} {
    --size: 2;
  }
`;
const btnAllDel = css`
  position: absolute;
  top: 6.5%;
  margin-left: 6.5%;
`;
const btnDels = css`
  position: absolute;
  bottom: 6.5%;
  margin-left: 6.5%;
`;
const label = css`
  display: flex;
  width: 100%;
  padding: 16px 16px 16px 0;
  ${mq('pc')} {
    width: calc(50% - 1em);
  }
`;
const bgColorChecked = css`
  background: skyblue;
`;
const checkbox = css`
  vertical-align: middle;
  margin: 0 8px !important;
`;
const btnClose = css`
  position: absolute;
  background: transparent;
  right: 5%;
  bottom: 5%;
  ${mq('ex')} {
    right: 0;
  }
`;
const iconClose = css`
  display: block;
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 5%;
  :before,
  :after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background: #000;
    width: 8px;
    height: 48px;
    border-radius: 28px;
  }
  :before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  :after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;
