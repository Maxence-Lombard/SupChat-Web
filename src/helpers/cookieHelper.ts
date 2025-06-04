export const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`,
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

export function getRawCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`,
    ),
  );
  return matches ? matches[1] : null;
}

export const setCookie = (
  name: string,
  value: string,
  options: { path?: string } = {},
  expires?: Date,
) => {
  let cookieStr = `${name}=${encodeURIComponent(value)};`;
  if (options.path) cookieStr += ` path=${options.path};`;
  if (expires) cookieStr += ` expires=${expires.toUTCString()};`;
  document.cookie = cookieStr;
};
