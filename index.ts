export interface PathRecognition {
  match: string | undefined;
  params: { [key: string]: string };
}

export default function pathRecognition(
  url: string,
  possiblePaths: string[]
): PathRecognition {
  for (const path of possiblePaths) {
    if (path === url) {
      return { match: path, params: {} };
    }

    const splitPath = path.split('/');
    const splitUrl = url.split('/');

    if (splitPath.length !== splitUrl.length || !path.includes(':')) {
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

        if (el.startsWith(':')) {
          prev.params[el.replace(':', '')] = splitUrl[index];
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

export function pathTrimmer(path: string) {
  return path.replace(/^\/+|\/+$/g, '');
}
