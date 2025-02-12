import React from 'react';

interface HeaderProps {
  username: string;
}

export const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <div className="flex items-center">
        <img src="/logo.png" alt="eLGU BPLS" className="h-8" />
        <span className="ml-2 font-bold">BPLS</span>
      </div>
      <div className="flex items-center">
        <span className="text-gray-600">Welcome, {username}</span>
      </div>
    </header>
  );
};