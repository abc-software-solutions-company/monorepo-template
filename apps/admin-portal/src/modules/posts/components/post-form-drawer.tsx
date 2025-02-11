import { FC } from 'react';
import { X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@repo/react-web-ui-shadcn/components/ui/drawer';
import { Language } from '@repo/shared-universal/interfaces/language.interface';

import { PostFormData } from '../interfaces/posts.interface';

import { POST_STATUSES } from '../constants/posts.constant';

import FormFieldCardCoverMultiLanguage from '@/components/form-fields/form-field-card-cover-multi-language';
import FormFieldCardImages from '@/components/form-fields/form-field-card-images';
import FormFieldCardSelectCategory from '@/components/form-fields/form-field-card-select-category';
import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';

interface IPostFormDrawerProps {
  form: UseFormReturn<PostFormData>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: CategoryEntity[];
  locales: Language[];
}

const PostFormDrawer: FC<IPostFormDrawerProps> = ({ form, isOpen, setIsOpen, categories, locales }) => {
  return (
    <Drawer open={isOpen} direction="right" onOpenChange={setIsOpen}>
      <DrawerContent className="left-auto right-0 h-full w-80 rounded-none lg:hidden">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Mobile menu</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="flex justify-end p-2">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="grid gap-4 p-4">
          <FormFieldCardSelectStatus form={form} statuses={POST_STATUSES} />
          <FormFieldCardSelectCategory form={form} fieldName="categoryId" formLabel="Category" items={categories ?? []} />
          <FormFieldCardCoverMultiLanguage form={form} fieldName="coverLocalized" formLabel="Cover Image" locales={locales} maxVisible={2} />
          <FormFieldCardImages form={form} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PostFormDrawer;
