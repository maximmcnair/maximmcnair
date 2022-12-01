import React from "react";
import styled, { css } from "styled-components";

const colors = {
  dark: "#242E3A",
  grey: "#AAB7C0",
  white: '#FFFFFF'
}

// import { Loading } from "./Loading";

const Btn = styled("button")<{ color?: string; disabled?: boolean }>`
  background-color: ${({ color = colors.dark, disabled }) =>
    disabled ? colors.grey : color};
  border: none;
  color: ${colors.white};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: inline-block;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;

  cursor: ${({ disabled }) =>
    disabled
      ? ""
      : css`
          &:active {
            transform: translate3d(0px, 1px, 0px);
          }
        `};
`;

interface Props {
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  className?: string;
  onClick?(e: React.MouseEvent): void;
}

export const Button: React.FC<Props> = ({
  disabled = false,
  // loading = false,
  onClick,
  color,
  children,
  className,
}) => {
  return (
    <Btn
      disabled={disabled}
      onClick={(e) => {
        if (!disabled && onClick !== undefined) onClick(e);
      }}
      color={color}
      className={className}
    >
      {children}
    </Btn>
  );
};
// {loading ? <Loading /> : children}
