# Path Recognition

This package tackles the issue of trying to match a url with a certain list of possible paths. The paths can be static or dynamics, where dynamic paths are define by starting with a special character.

As well, it is offered some util functions for basic (but painful to research) url parsing.

## Table of Contents

- [Installing](#installing)
- [Functions](#functions)
  - [Path Recognition Function](#path-recognition-function)
  - [Path Trimmer Function](#path-trimmer-function)
  - [Pathname Extractor Function](#pathname-extractor-function)
- [Examples](#examples)

## Installing

Using npm:

```bash
$ npm install path-recognition
```

## Functions

The main function of the package is the Path Recognition one (which will be the first to be explained), but also comes with a little set of extra util functions.

### Path Recognition Function

Try to match a certain URL versus a list of possible paths. If the url doesn't match with any path from the list, it will return undefined as part of the response object.

The **response** has the following to properties:

1. match: which can be the found path or undefined when not found
2. params: Hash object that may contain possible params based on dynamic routes. If no param is found, the object will be empty

*Dynamic routes* need to be identified by certain pattern at the beginning of the string of the element.You can set the identifier for a custom one. THe default one is `:`. Notice with the given description that to identify such dynamic routes, you need a pattern which the path starts with. So an identifier that encloses the param, like [id], is not valid. (This convention can be seen in [Next.js](https://nextjs.org/docs/routing/dynamic-routes) for instance)

### Path Trimmer Function
 
This function will trim the path from both ends of the string from the character `/`.

### Pathname Extractor Function
 
Obtains the pathname from a cerain URL. The main pain that this function helps solves is to seperate the querystring.

## Examples

### Path Recognition

Example to recognize with which match a url matches the most.

```ts
import pathRecognition from 'path-recognition';

const possibleUrls = [
  '/',
  '/disable',
  '/guests',
  '/invitations',
  '/invitations/pending',
  '/follows/followers',
  '/follows/followings',
  '/:did',
  '/access/:did',
  '/ban/:did',
  '/unban/:did',
  '/follows/unfollow/:did/follower',
  '/follows/unfollow/:did/following',
  '/invitations/:inviteId',
];

const pathToMatch = '/follows/unfollow/did:key:kbd12asco1/follower';

const match = pathRecognition(possibleUrls, pathToMatch);
// Output:
// {
//   match: '/follows/unfollow/:did/follower',
//   params: {
//     did: 'did:key:kbd12asco1',
//   },
// }
```

### Path Trimmer

Example to trim a path from the character `/` at the beginning and end of the string.

```ts
import { pathTrimmer } from 'path-recognition';

const pathToTrim = '/path/to/trim';

const trimmedPath = pathTrimmer(pathToTrim);
// Output:
// 'path/to/trim'
```
