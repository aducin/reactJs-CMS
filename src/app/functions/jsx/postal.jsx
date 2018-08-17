import React from 'react';

export const setContent = (header, message, postalHeader, busy, postalDetail, modal) => {
  return (
    <div>
      {header}
      {message}
      {postalHeader}
      {busy}
      {postalDetail}
      {modal}
    </div>
  )
};
