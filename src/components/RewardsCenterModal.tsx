import React from 'react';
import RewardsCenterScreen from '../screens/RewardsCenterScreen';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
  onEnterRoom?: (room: any) => void;
}

export const RewardsCenterModal: React.FC<Props> = ({ isOpen, onClose, onNavigate, onEnterRoom }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none overflow-y-auto custom-scrollbar">
      <RewardsCenterScreen onBack={onClose} onNavigate={onNavigate} onEnterRoom={onEnterRoom} />
    </div>
  );
};
