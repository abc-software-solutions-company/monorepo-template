// type CategoryFormFilter = {
//   type?: CATEGORY_TYPE;
// };
// type UseCategoriesProps = {
//   isEdit: boolean;
//   categoryId: string;
// };
// function useCategories({ isEdit, categoryId }: UseCategoriesProps) {
//   const [formFilter, refetchCategories] = useState<CategoryFormFilter>({ type: undefined });
//   const {
//     data: category,
//     isFetched: isCategoryFetched,
//     isFetching: isCategoryFetching,
//   } = useQuery({
//     queryKey: ['category', categoryId],
//     queryFn: async () => {
//       const categoryResp = await CategoryApi.read(categoryId);
//       return categoryResp.data.data;
//     },
//     enabled: isEdit,
//     staleTime: 0,
//     gcTime: 0,
//   });
//   const {
//     data: categories,
//     isFetched: isCategoriesFetched,
//     isFetching: isCategoriesFetching,
//   } = useQuery({
//     queryKey: ['categories', formFilter],
//     queryFn: async () => {
//       const categoriesResp = await CategoryApi.list({ type: category?.type ?? formFilter.type, excludeId: categoryId });
//       return categoriesResp.data.data;
//     },
//     enabled: isEdit ? !!category : !!formFilter.type,
//     staleTime: 0,
//     gcTime: 0,
//   });
//   const isFetched = isCategoryFetched || isCategoriesFetched;
//   const isFetching = isCategoryFetching || isCategoriesFetching;
//   return {
//     isFetched,
//     isFetching,
//     isCategoryFetched,
//     isCategoryFetching,
//     isCategoriesFetched,
//     isCategoriesFetching,
//     category,
//     categories,
//     refetchCategories,
//   };
// }
// export default useCategories;
import { useContext } from 'react';

import { CategoryContext } from '../contexts/categories.context';

export const useCategories = () => {
  const context = useContext(CategoryContext);

  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }

  return context;
};
