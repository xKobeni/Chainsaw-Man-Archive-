export function SplitText({ text }: { text: string }) {
  return <>{[...text].map((letter, index) => letter === " " ? " " : <span className="ch" key={index}>{letter}</span>)}</>;
}
