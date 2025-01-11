import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@repo/react-native-ui-core/components/icon';
import Loading from '@repo/react-native-ui-core/components/loading';
import Pagination from '@repo/react-native-ui-core/components/pagination';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { TravelExploreStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import PostFilters from '@/modules/post/components/post-filter';
import { PostList } from '@/modules/post/components/post-list';
import { usePost } from '@/modules/post/hooks/use-post';

function TravelPlacesScreen({ navigation, route }: TravelExploreStackProps<'TravelPlaces'>) {
  const { t } = useTranslation();
  const { isLoading, error, data, meta, filter, setFilter } = usePost(route.params);

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      {isLoading && (
        <View>
          <Loading />
        </View>
      )}
      {error && (
        <View>
          <Text>Error fetching data</Text>
        </View>
      )}
      {!isLoading && !error && (
        <>
          <PostFilters value={filter.q} onTextChange={text => setFilter({ ...filter, q: text, page: 1 })} />
          <PostList items={data} />
          <Pagination
            totalItems={meta?.paging?.totalItems}
            currentPage={filter.page}
            itemPerPage={filter.limit}
            onChange={page => setFilter({ ...filter, page })}
          />
        </>
      )}
    </SafeViewArea>
  );
}

export default TravelPlacesScreen;
