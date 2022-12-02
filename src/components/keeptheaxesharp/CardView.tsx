import React, { useState } from "react";
import styled, { css } from "styled-components";

export const CardSide = styled.div<{ isBack?: boolean }>`
  display: flex;
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  border-radius: 3px;
  min-height: 450px;
  z-index: 100;
  ${({ isBack }) => (isBack ? "transform: rotateY(180deg)" : "")};
  overflow: hidden;
`;

export const CardContent = styled.div<{ disablePadding?: boolean }>`
  padding: ${({ disablePadding }) => (disablePadding ? 0 : 20)}px;
  transform: 0.8s;
  flex: 1;
  width: 100%;
  font-family: "Source Code Pro";
  opacity: 0;
`;

export const CardContainer = styled.div<{
  cardIndex: number;
  showAnswer: boolean;
}>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  transition: transform 1s;
  transform-style: preserve-3d;
  transform: scale(0.88) translate3d(0px, -20px, 0px) rotateY(0deg);
  transition: transform 0.5s, opacity 0.5s;

  ${({ cardIndex, showAnswer }) => {
    switch (true) {
      // done cards
      case cardIndex < 0:
        return css`
          transform: scale(1.5) translate3d(0px, 20px, 0px)
            rotateY(${showAnswer ? 180 : 0}deg);
          opacity: 0;
          z-index: 600;
          pointer-events: none;
        `;
      // current card
      case cardIndex === 0:
        return css`
          transform: scale(1) translate3d(0px, 0px, 0px)
            rotateY(${showAnswer ? 180 : 0}deg);
          opacity: 1;
          z-index: 500;
          pointer-events: auto;
          .content {
            opacity: 1;
          }
        `;
      case cardIndex === 1:
        return css`
          transform: scale(0.97) translate3d(0px, -10px, -5px)
            rotateY(${showAnswer ? 180 : 0}deg);
          opacity: 1;
          z-index: 400;
        `;
      case cardIndex === 2:
        return css`
          transform: scale(0.94) translate3d(0px, -20px, -10px)
            rotateY(${showAnswer ? 180 : 0}deg);
          opacity: 0.8;
          z-index: 300;
        `;
      case cardIndex === 3:
        return css`
          transform: scale(0.91) translate3d(0px, -30px, -15px)
            rotateY(${showAnswer ? 180 : 0}deg);
          opacity: 0.6;
          z-index: 200;
        `;
      case cardIndex === 4:
        return css`
          transform: scale(0.88) translate3d(0px, -40px, -20px)
            rotateY(${showAnswer ? 180 : 0}deg);
          opacity: 0.4;
          z-index: 100;
        `;
    }
    return css``;
  }}
`;

const CardFlip = styled.div<{ disabled?: boolean }>`
  cursor: ${({ disabled = false }) => (disabled ? "not-allowed" : "pointer")};
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0%);
  font-size: 14px;
  color: grey;
  width: 225px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnswerCardFlip = styled(CardFlip)`
  top: 20px;
  right: 20px;
  bottom: auto;
  left: auto;
  transform: none;
  width: 100px;
`;

interface Props {
  cardIndex: number;
  currentCard: number;
  front?: React.ReactNode;
  back?: React.ReactNode;
  disablePadding?: boolean;
  editing?: boolean;
  canFlip?: boolean;
}

export const CardView: React.FC<Props> = ({
  cardIndex,
  currentCard,
  front,
  back,
  disablePadding = false,
  editing = false,
  canFlip = true,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <CardContainer cardIndex={cardIndex - currentCard} showAnswer={showAnswer}>
      <CardSide>
        <CardContent className="content" disablePadding={disablePadding}>
          {front}

          <CardFlip
            onClick={() => !!canFlip && setShowAnswer(true)}
            disabled={!canFlip}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              style={{ width: 18, marginRight: 4 }}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            flip card to {editing ? "write" : "see"} answer
          </CardFlip>
        </CardContent>
      </CardSide>

      <CardSide isBack>
        <CardContent className="content" disablePadding={disablePadding}>
          {back}
          <AnswerCardFlip onClick={() => setShowAnswer(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              style={{ width: 18, marginRight: 4 }}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            flip card
          </AnswerCardFlip>
        </CardContent>
      </CardSide>
    </CardContainer>
  );
};
