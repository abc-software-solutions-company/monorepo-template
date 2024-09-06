import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { WMPost } from '@/localdb/models/post.model';
import Divider from '~react-native-ui-core/components/divider';
import Text from '~react-native-ui-core/components/text';
import View from '~react-native-ui-core/components/view';

type PostListProps = {
  items: WMPost[];
};

const PostList: React.FC<PostListProps> = ({ items }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>ID: {item.id}</Text>
          <Text>Title: {item.title}</Text>
          {/* <Text>Is Public: {item.is_public ? 'Yes' : 'No'}</Text>
          <Text>Tags: {item.tags.join(', ')}</Text>
          <Text>SEO Title: {item.seo?.title}</Text> */}
          <Divider />
        </View>
      )}
    />
  );
};

export default PostList;
