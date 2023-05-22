const getChannelInfo = (doc) => {
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  return { title, description };
};

const getPosts = (doc) => {
  const items = doc.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const pubDate = item.querySelector('pubDate');
    const timemark = pubDate ? pubDate.textContent : '';
    const post = {
      title,
      link,
      description,
      timemark,
    };
    posts.push(post);
  });
  return posts;
};

const parseRss = (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, 'text/xml');
  const err = doc.querySelector('parsererror');
  if (err) {
    const error = new Error();
    error.isParsingError = true;
    throw error;
  }

  const channelInfo = getChannelInfo(doc);
  const posts = getPosts(doc);

  return { channelInfo, posts };
};

export default parseRss;
