interface Props {
  visible: boolean;
  icon: string;
  title: string;
  message: string;
  showClose: boolean;
  onClose: () => void;
}

export default function PaymentOverlay({ visible, icon, title, message, showClose, onClose }: Props) {
  return (
    <div className={`pay-overlay ${visible ? 'show' : ''}`} role="dialog" aria-modal="true">
      <div className="pay-modal">
        {icon ? (
          <span className="pm-icon">{icon}</span>
        ) : (
          <div className="pm-spinner" />
        )}
        <h3>{title}</h3>
        <p>{message}</p>
        {showClose && (
          <button className="pm-close" onClick={onClose}>Close</button>
        )}
      </div>
    </div>
  );
}
