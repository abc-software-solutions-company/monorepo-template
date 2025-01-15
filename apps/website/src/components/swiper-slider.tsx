import React, { FC } from 'react';
import Image, { StaticImageData } from 'next/image';
import classNames from 'classnames';
import { SearchIcon } from 'lucide-react';
import { LightgalleryItem, LightgalleryProvider } from 'react-lightgallery';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import NoSsr from './no-ssr';

type SwiperProps = {
  items?: {
    image: string | StaticImageData;
  }[];
  groupName?: string;
} & ComponentBaseProps;

const SwiperSlider: FC<SwiperProps> = ({ className, items, groupName }) => {
  return (
    <NoSsr>
      <LightgalleryProvider>
        <Swiper
          className={classNames('h-full w-full rounded-lg', className)}
          modules={[Pagination]}
          loop={false}
          spaceBetween={12}
          slidesPerView={3}
          grabCursor={true}
          pagination={{ bulletActiveClass: 'bg-primary opacity-100', clickable: true }}
        >
          {items?.map((item, index) => {
            const key = typeof item.image === 'string' ? item.image : `${item.image.src}-${index}`;

            return (
              <SwiperSlide key={key}>
                <div className="group relative">
                  <LightgalleryItem
                    group={groupName ?? 'any'}
                    src={typeof item.image === 'string' ? item.image : item.image.src}
                    thumb={typeof item.image === 'string' ? item.image : item.image.src}
                  >
                    <Image
                      loading="eager"
                      src={item.image}
                      width={1920}
                      height={1024}
                      className="h-full w-full rounded-lg object-cover"
                      alt="image"
                    />
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg transition-all duration-300 group-hover:bg-black/20">
                      <SearchIcon className="scale-75 transform text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                    </div>
                  </LightgalleryItem>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </LightgalleryProvider>
    </NoSsr>
  );
};

export default SwiperSlider;
