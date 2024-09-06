import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '~react-native-design-system';
import Loading from '~react-native-ui-core/components/loading';
import Pagination from '~react-native-ui-core/components/pagination';
import StatusBar from '~react-native-ui-core/components/statusbar';
import Text from '~react-native-ui-core/components/text';
import View from '~react-native-ui-core/components/view';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { TravelExploreStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import PostFilters from '@/modules/post/components/post-filter';
import { PostList } from '@/modules/post/components/post-list';
import { usePost } from '@/modules/post/hooks/use-post';

function TravelPlacesScreen({ route }: TravelExploreStackProps<'TravelPlaces'>) {
  const { t } = useTranslation();
  const { isLoading, error, data, meta, filter, setFilter } = usePost(route.params);

  return (
    <View style={ds.flex1}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
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
    </View>
  );
}

export default TravelPlacesScreen;
