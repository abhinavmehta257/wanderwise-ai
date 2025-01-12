import React from 'react';
import PropTypes from 'prop-types';


const NavBar = () => {
    return (
        <header class="bg-white lg:pb-0">
            <div class="mx-auto max-w-7xl px-8">
                <nav class="flex items-center justify-between h-16 lg:h-20">
                    <div class="flex-shrink-0">
                        <a href="/" title="" class="flex items-center gap-2">
                            <img class="w-auto h-8 lg:h-10" src="/logo.png" alt="" />
                            <span class="text-[24px] font-semibold text-[#181F23]">Wander<span className='text-[#21BCBE]'>wise</span></span>
                        </a>
                    </div>
                </nav>
            </div>
        </header>

    );
};


export default NavBar;
