import React from 'react';

export default function Button({ onClick, text, disabled }) {
  return (
    <button
      className="rounded-b border-white border-4 font-bold transition delay-100 bg-white hover:border-b-green-300 duration-300"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
