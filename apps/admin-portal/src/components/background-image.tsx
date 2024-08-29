import { FC } from 'react';

type BackgroundImageProps = {
  src: string;
  alt?: string;
};

const BackgroundImage: FC<BackgroundImageProps> = ({ src, alt }) => {
  return (
    <div className="absolute left-0 top-0 z-0 h-full w-full">
      <img className="h-full w-full object-cover object-center" src={src} alt={alt || ''} />
    </div>
  );
};

export default BackgroundImage;
