import { URL } from 'url';

export interface PathRecognition {
  match: string | undefined;
  params: { [key: string]: string };
}

/**
 * ## Path Recognition
 *
 * Try to match a certain URL versus a list of possible paths. If the url doesn't match with any path from the list,
 * it will return undefined as part of the response object.
 *
 * The **response** has the following to properties:
 *
 * 1. match: which can be the found path or undefined when not found
 * 2. params: Hash object that may contain possible params based on dynamic routes. If no param is found, the object
 * will be empty
 *
 * *Dynamic routes* need to be identified by certain pattern at the beginning of the string of the element.You can set
 * the identifier for a custom one. THe default one is `:`. Notice with the given description that to identify such
 * dynamic routes, you need a pattern which the path starts with. So an identifier that encloses the param, like [id],
 * is not valid. (This convention can be seen in [Next.js](https://nextjs.org/docs/routing/dynamic-routes) for instance)
 *
 * @param {string} url URL to try to match
 * @param {string[]} possiblePaths List of paths to which the url should match to
 * @returns {PathRecognition} Object with the matched path (undefined if not find), and the params found when comparing with a dynamic route.
 */
export default function pathRecognition(
  url: string,
  possiblePaths: string[],
  dynamicRouteIdentifier = ':'
): PathRecognition {
  for (const path of possiblePaths) {
    if (path === url) {
      return { match: path, params: {} };
    }

    const splitPath = path.split('/');
    const splitUrl = url.split('/');

    if (splitPath.length !== splitUrl.length || !path.includes(dynamicRouteIdentifier)) {
      continue;
    }

    const metadata = splitPath.reduce<{
      leftoverLength: number;
      params: { [key: string]: string };
    }>(
      (prev, el, index) => {
        if (!(el === splitUrl[index] || el.startsWith(':'))) {
          prev.leftoverLength++;
        }

        if (el.startsWith(dynamicRouteIdentifier)) {
          prev.params[el.replace(dynamicRouteIdentifier, '')] = splitUrl[index];
        }

        return prev;
      },
      { leftoverLength: 0, params: {} }
    );

    if (metadata.leftoverLength === 0) {
      return { match: path, params: metadata.params };
    }
  }

  return { match: undefined, params: {} };
}

/**
 * ## Path trimmer
 * 
 * This function will trim the path from both ends of the string from the character `/`.
 * 
 * @param {string} path Path to trim
 * @returns {string} Trimmed path
 */
export function pathTrimmer(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

/**
 * ## Pathname extractor
 * 
 * Obtains the pathname from a cerain URL. The main pain that this function helps solves is to seperate the querystring.
 * 
 * @param {string} host Host that has access to the url sent to
 * @param {string} url The path to which a request was sent
 * @param {string} protocol The protocol of the request ('http' or 'https')
 * @returns {string} Pathname of the url
 */
export function extractPathname(
  host: string,
  url: string,
  protocol: 'http' | 'https' = 'http'
): string {
  const baseUrl = `${protocol}://${host}`;

  const { pathname } = new URL(url, baseUrl);

  return pathname;
}
