export const getAllNetworks = ({ url, title, description, image }) => [
  {
    name: 'twitter',
    label: 'Twitter',
    url: `https://twitter.com/intent/tweet?text=${title};url=${url};`,
    icon: ''
  },
  {
    name: 'facebook',
    label: 'Facebook',
    url: `http://www.facebook.com/share.php?u=${url}`,
    icon: ''
  },
  {
    name: 'vkontakte',
    label: 'VKontakte',
    url: `http://vkontakte.ru/share.php?url=${url}`,
    icon: ''
  },
  {
    name: 'odnoklassniki',
    label: 'Odnoklassniki',
    url: `http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st.comments=${description}&st._surl=${url}`,
    icon: ''
  },
  {
    name: 'blogger',
    label: 'Blogger',
    url: `http://blogger.com/blog-this.g?t=${description}&n=${title}&u=${url}`,
    icon: ''
  },
  {
    name: 'pinterest',
    label: 'Pinterest',
    url: `http://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`,
    icon: ''
  },
  {
    name: 'tumblr',
    label: 'Tumblr',
    url: `http://www.tumblr.com/share/link?url=${url}&name=${title}&description=${description}`,
    icon: ''
  },
  {
    name: 'digg',
    label: 'Digg',
    url: `http://digg.com/submit?phase=2&url=${url}`,
    icon: ''
  },
  {
    name: 'delicious',
    label: 'Del.icio.us',
    url: `http://del.icio.us/post?url=${url}`,
    icon: ''
  },
  {
    name: 'stumbleupon',
    label: 'StumbleUpon',
    url: `http://www.stumbleupon.com/submit?url=${url}&title=${title}`,
    icon: ''
  },
  {
    name: 'slashdot',
    label: 'Slashdot',
    url: `http://slashdot.org/slashdot-it.pl?op=basic&url=${url}`,
    icon: ''
  },
  {
    name: 'reddit',
    label: 'Reddit',
    url: `http://reddit.com/submit?url=${url}&title=${title}`,
    icon: ''
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    url: `http://www.linkedin.com/shareArticle?mini=true&url=${url}&title={title}`,
    icon: ''
  }
];
