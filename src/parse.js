import { XMLParser } from 'fast-xml-parser';

export default (data) => {
  try {
    const parser = new XMLParser();
    const xml = parser.parse(data);
    const { title, description, link } = xml.rss.channel;
    const rssFeeds = { title, description, link };
    const rssPosts = [...xml.rss.channel.item];
    return { rssFeeds, rssPosts };
  } catch {
    throw new Error('Parsing Error');
  }
};
