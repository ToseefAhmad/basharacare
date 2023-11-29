import { gql, useQuery } from '@apollo/client';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const getNavLinkSettingsQuery = gql`
  query amNavBlogSetting {
    amBlogSetting {
      display_settings_label
      display_settings_display_at_category
    }
  }
`;

export const useNavLink = () => {
  const { data } = useQuery(getNavLinkSettingsQuery);

  const { amBlogSetting } = data || {};
  const { display_settings_label, display_settings_display_at_category } =
    amBlogSetting || {};

  return {
    label: display_settings_label,
    isEnabled: display_settings_display_at_category,
    urlKey: BLOG_URLS_BY_SECTION.HOME.replace('/', '')
  };
};
