'use client';

import React, { FC } from 'react';
import useScrollTo from '@repo/shared-web/hooks/use-scroll-to';

import { Link } from '@/navigation';

import Logo from '../icons/logo';

const Footer: FC = () => {
  const scrollTo = useScrollTo();

  return (
    <footer>
      <div className="bg-primary/10">
        <div className="container">
          <div className="py-14 sm:py-16 md:flex md:justify-between">
            <div className="mb-10 md:mb-0">
              <Link href="/" className="flex items-center" aria-label="Next Application">
                <Logo />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-16 sm:grid-cols-4 sm:gap-6">
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase text-primary">Product</h2>
                <ul className="grid gap-4 font-medium text-gray-500 dark:text-gray-400">
                  <li className="">
                    <Link href={{ pathname: '/admin-portal' }} className="hover:underline">
                      Admin Portal
                    </Link>
                  </li>
                  <li>
                    <Link href={{ pathname: '/admin-api' }} className="hover:underline">
                      Admin API
                    </Link>
                  </li>
                  <li>
                    <Link href={{ pathname: '/mobile-app' }} className="hover:underline">
                      Mobile App
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase text-primary">Blog</h2>
                <ul className="grid gap-4 font-medium text-gray-500 dark:text-gray-400">
                  <li>
                    <a className="cursor-pointer hover:underline" onClick={() => scrollTo.elementWithOffset('#projects', -50)}>
                      Projects
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase text-primary">HELP & SUPPORT</h2>
                <ul className="font-medium text-gray-500 dark:text-gray-400">
                  <li className="mb-4">
                    <Link href={{ pathname: '/contact-us' }} className="hover:underline">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase text-primary">Legal</h2>
                <ul className="grid gap-4 font-medium text-muted-foreground">
                  <li>
                    <Link href={{ pathname: '/privacy-policy' }} className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href={{ pathname: '/terms-and-conditions' }} className="hover:underline">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary/5 py-6">
        <div className="container">
          <div className="text-center">
            <span className="text-muted-foreground">
              © {new Date().getFullYear()}{' '}
              <a href="https://nextap.com/" className="hover:underline">
                NextAP
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
