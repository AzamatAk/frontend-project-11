import axios from 'axios';
import _ from 'lodash';
import parseRss from './parse.js';

const getProxiedUrl = (url) => {
  const proxiedUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxiedUrl.searchParams.set('disableCache', 'true');
  proxiedUrl.searchParams.set('url', url);
  return proxiedUrl;
};

const addNewPosts = (posts, watchedState, channelId) => {
  posts.forEach((post) => {
    const index = _.findIndex(watchedState.posts, (oldPost) => post.link === oldPost.link);
    if (index === -1) {
      post.channelId = channelId;
      post.id = watchedState.posts.length;
      watchedState.posts.push(post);
    }
  });
};

const uploadChannelFirst = (url, watchedState) => {
  watchedState.status = 'start';
  const proxiedUrl = getProxiedUrl(url);
  axios.get(proxiedUrl)
    .then((response) => {
      const { channelInfo, posts } = parseRss(response);
      channelInfo.url = url;
      channelInfo.id = watchedState.channels.length;
      watchedState.channels.push(channelInfo);
      addNewPosts(posts, watchedState, channelInfo.id);
      watchedState.status = 'success';
    })
    .catch((err) => {
      if (err.isAxiosError) {
        watchedState.error = 'network';
      } else if (err.isParsingError) {
        watchedState.error = 'parsing';
      } else {
        watchedState.error = 'unknown';
      }
      watchedState.status = 'failure';
    });
};

const listenChannels = (watchedState) => {
  const period = 5000;
  const promises = watchedState.channels
    .map((channel) => {
      const proxiedUrl = getProxiedUrl(channel.url);
      return axios.get(proxiedUrl);
    });
  Promise.allSettled(promises)
    .then((responses) => {
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          const { posts } = parseRss(response.value);
          const channelId = watchedState.channels[index].id;
          addNewPosts(posts, watchedState, channelId);
        }
      });
    })
    .finally(() => {
      setTimeout(() => listenChannels(watchedState), period);
    });
};

export { uploadChannelFirst, listenChannels };
