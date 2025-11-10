import './Message.scss';

interface MessageProps {
  text: string;
  messageType?: string;
}

export default function Message({ text, messageType }: MessageProps) {
  return <div className={`message message--${messageType}`}>{text}</div>;
}
