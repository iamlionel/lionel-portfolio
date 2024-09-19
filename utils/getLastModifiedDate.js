import { LAST_COMMIT_BASE_URL } from '@/app/constants';

export function getLastModifiedDate(filePath) {
  const headers = new Headers({
    Authorization: 'Token ' + process.env.GITHUB_TOKEN_READ_ONLY,
  });

  const urlWithIndex = new URL(LAST_COMMIT_BASE_URL);
  urlWithIndex.searchParams.set('path', `${filePath}/index.md`);
  urlWithIndex.searchParams.set('page', '1');
  urlWithIndex.searchParams.set('per_page', '1');
  urlWithIndex.searchParams.set('sha', 'main');
  const urlWithoutIndex = new URL(urlWithIndex);
  urlWithoutIndex.searchParams.set('path', `${filePath}.md`);
  return fetch(urlWithIndex, { headers })
    .then((res) => res.json())
    .then((commits) => commits[0].commit.committer.date)
    .catch((_) =>
      fetch(urlWithoutIndex, { headers })
        .then((res) => res.json())
        .then((commits) => commits[0].commit.committer.date)
        .catch(console.error)
    );
}
