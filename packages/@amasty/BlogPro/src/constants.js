export const PAGE_TYPES = {
  ALL: 'ALL',
  CATEGORY: 'CATEGORY',
  AUTHOR: 'AUTHOR',
  TAG: 'TAG',
  SEARCH: 'SEARCH',
  POST: 'POST'
};

export const DATE_FORMAT = {
  PASSED: 'PASSED',
  DIRECT: 'DIRECT'
};

export const COMMENT_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3
};

export const ROOT_PATH = '/blog';

export const BLOG_URLS_BY_SECTION = {
  HOME: ROOT_PATH,
  POST: ROOT_PATH,
  CATEGORY: `${ROOT_PATH}/category`,
  TAG: `${ROOT_PATH}/tag`,
  AUTHOR: `${ROOT_PATH}/author`
};

export const DEFAULT_BLOG_TITLE = 'Blog';

export const VOTE_TYPES = {
  UPDATE: 'UPDATE',
  PLUS: 'PLUS',
  MINUS: 'MINUS'
};

export const GUEST_NAME = 'Guest';

export const PAGE_TITLES = {
  SEARCH: 'Search results for',
  AUTHOR: 'More from',
  TAG: 'Posts tagged'
};
