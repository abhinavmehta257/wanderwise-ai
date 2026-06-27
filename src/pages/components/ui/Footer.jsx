import React from 'react';

const Footer = () => {
    return (
        <footer class="bg-white dark:bg-gray-900 mt-auto">
        <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
            <div class="md:flex md:justify-between">
            <div class="mb-6 md:mb-0">
                <a href="/" class="flex items-center">
                    <img src="/logo.png" class="h-8 me-3" alt="wanderwise AI Logo" />
                    <span class="text-[24px] font-semibold text-[#181F23]">Wander<span className='text-[#21BCBE]'>wise</span></span>
                </a>
            </div>
            <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                <div>
                    <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                    <ul class="text-gray-500 dark:text-gray-400 font-medium">
                        <li class="mb-4">
                            <a href="https://www.instagram.com/wander_wise_ai/" class="hover:underline ">Instagram</a>
                        </li>
                        
                    </ul>
                </div>
                <div>
                    <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                    <ul class="text-gray-500 dark:text-gray-400 font-medium">
                        <li class="mb-4">
                            <a href="/policies" class="hover:underline">Privacy Policy</a>
                        </li>
                        <li class="mb-4">
                            <a href="/terms" class="hover:underline">Terms of Use</a>
                        </li>
                        <li class="mb-4">
                            <a href="/cookies" class="hover:underline">Cookie Policy</a>
                        </li>
                        <li class="mb-4">
                            <a href="/data-storage" class="hover:underline">Data Storage &amp; Use</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div class="sm:flex sm:items-center sm:justify-between">
            <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2026 <a href="/" class="hover:underline">Wanderwise</a>. All Rights Reserved.
            </span>
        </div>
        </div>
    </footer>
    );
}

export default Footer;
