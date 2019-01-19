import React from 'react';
import './Loader.module.css';

const Loader = () => (
    <div className='loading'>
        <p>
          Loading
        </p>
        <img 
            style={{ width: '100px', height: '100px' }}
            src='http://www.freetoursbyfoot.com/wp-content/uploads/2017/05/loading.gif' 
            alt='none' 
        />
    </div>
);

export { Loader };