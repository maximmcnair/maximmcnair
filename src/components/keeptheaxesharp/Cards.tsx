import React, { useState } from "react";
import styled from "styled-components";

import { CardView } from "./CardView";
import { Button } from "./Button";
import { sm2 } from "./sm2";

import { format } from "date-fns";

const colors = {
  white: "#FFFFFF",
  blue: "#457492",
  blueDark: "#32607E",
  success: "#3FC59D",
  red: "#BC3E2F",
  error: "#BC3E2F",
}

export interface Card {
  id: string;
  question: string;
  questionLang: string;
  answer: string;
  answerLang: string;
  nextReview: Date;
  lastReview: Date;
  interval: number;
  reps: number;
  ef: number;
}

export type ProgressState = "fail" | "ok" | "success" | "todo";

// const FORMAT = "do MMM yy";
const FORMAT = "do MMM";

export function formatDate(date: Date | string) {
  if (date instanceof Date) {
    return format(date, FORMAT);
  } else {
    return format(new Date(date), FORMAT);
  }
}

const CardsStack = styled.div`
  max-width: 600px;
  width: calc(100% - 20px);
  height: 260px;
  perspective: 600px;
  margin: 60px 10px 0px 10px;
  position: relative;

  @media (min-width: 600px) {
    margin: 60px auto 0px auto;
  }
`;

const ReviewOptionsWrapper = styled("div")`
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 0px;
  right: 0px;
`;

const ReviewOptions = styled("div")`
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewOption = styled("div")`
  display: inline-block;
  text-align: center;
  margin: 0px 5px;
`;

const NextReview = styled("span")`
  color: #aab7c0;
  font-size: 13px;
  text-align: center;
  margin-top: 9px;
  display: block;
  font-weight: 600;
`;

const OptionsTitle = styled("span")`
  color: #aab7c0;
  font-size: 14px;
  text-align: center;
  margin-bottom: 18px;
  display: block;
  font-weight: 600;
`;

interface Props {
  cards: Card[];
  showCreating?: boolean;
}

export const Cards: React.FC<Props> = ({
  cards,
  showCreating = false,
}) => {
  const [currentCard, setCurrent] = useState(0);
  const [isCreating, setIsCreating] = useState(showCreating);
  // const { update: cardUpdate } = useUpdate<Card>("card");
  const [progress, setProgress] = useState<ProgressState[]>([]);

  const cardsFinished = cards.length > 0 && cards.length === currentCard;

  async function recordAttempt(card: Card, grade: number) {
    try {
      const { ef, reps, interval, nextReview, lastReview } = sm2(
        card.ef,
        card.reps,
        card.interval,
        card.nextReview,
        card.lastReview,
        grade
      );

      // await cardUpdate(card.id, {
      //   ef,
      //   reps,
      //   interval,
      //   nextReview,
      //   lastReview,
      // });

      setCurrent(currentCard + 1);

      switch (grade) {
        case 5:
          return setProgress([...progress, "success"]);
        case 4:
          return setProgress([...progress, "ok"]);
        case 3:
          return setProgress([...progress, "ok"]);
        case 2:
          return setProgress([...progress, "fail"]);
        case 1:
          return setProgress([...progress, "fail"]);
        case 0:
          return setProgress([...progress, "fail"]);
      }
    } catch (err) {
      // @ts-ignore
      console.log(err.message);
    }
  }

  return (
      <CardsStack>
        {cards.map((card, index) => {
          // const nextReviews = gradeNextReviews(card);
          return (
            <CardView
              key={card.id}
              cardIndex={isCreating ? index + 1 : index}
              currentCard={currentCard}
              front={<span>asdf</span>}
              back={<span>asdf</span>}
            />
          );
        })}
      </CardsStack>
  );
};
