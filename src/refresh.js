import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import makeProxy from './makeProxy.js';
import RssParse from './parse.js';

const refresh = (watchedState, refreshTime) => {
  const { posts, feeds } = watchedState;
  const promises = feeds.map((feed) => axios.get(makeProxy(feed.url))
    .then((response) => {
      const { rssPosts } = RssParse(response.data.contents);
      const findDiff = _.differenceBy(rssPosts, posts, 'guid');
      if (!_.isEmpty(findDiff)) {
        const newPush = findDiff.map(({
          title, link, description, guid,
        }) => {
          const newPost = {
            id: uuidv4(), feedId: feed.id, title, link, description, guid,
          };
          return newPost;
        });
        posts.push(...newPush);
        console.log(posts);
      }
    }));
  Promise
    .all(promises)
    .finally(() => setTimeout(() => refresh(watchedState, refreshTime), refreshTime));
};

export default refresh;
