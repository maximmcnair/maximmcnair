interface Props {
  href: string;
  text: string;
}

function Button({ text, href }: Props) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn">
      {text}
    </a>
  );
}

export default Button;
