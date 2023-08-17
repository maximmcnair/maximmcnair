interface Props {
  href: string;
  text: string;
}

function Button({ text, href }: Props) {
  if (href.includes('/p/')) {
    return (
      <a href={href} className="btn">
        {text}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn">
      {text}
    </a>
  );
}

export default Button;
