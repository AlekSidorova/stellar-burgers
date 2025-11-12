import styles from './modal-overlay.module.css';

type TModalOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  onClick: () => void;
};

export const ModalOverlayUI = ({ onClick, ...props }: TModalOverlayProps) => (
  <div className={styles.overlay} onClick={onClick} {...props} />
);
