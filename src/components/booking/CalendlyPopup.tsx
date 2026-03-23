import React from 'react';
import { PopupModal } from 'react-calendly';

interface CalendlyPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalendlyPopup = ({ open, onOpenChange }: CalendlyPopupProps) => {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
  const primaryColor = import.meta.env.VITE_CALENDLY_PRIMARY || 'E8640A';
  const bgColor = import.meta.env.VITE_CALENDLY_BG || '0D0D0D';
  const textColor = 'FFFFFF';

  if (!calendlyUrl) return null;

  return (
    <PopupModal
      url={calendlyUrl}
      onModalClose={() => onOpenChange(false)}
      open={open}
      rootElement={document.getElementById('root')!}
      pageSettings={{
        backgroundColor: bgColor,
        hideGdprBanner: true,
        primaryColor: primaryColor,
        textColor: textColor,
      }}
    />
  );
};

export default CalendlyPopup;
