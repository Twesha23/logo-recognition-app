import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div style={{clear: 'left'}}>
      <div className='white f3 center'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='white f1'>
        {entries}
      </div>
    </div>
  );
}

export default Rank;