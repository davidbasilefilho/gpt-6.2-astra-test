/** Shared, dependency-free source filtering; keeps provider responses classified as official. */
export function filterSources(sources, kind = 'All', query = '') {
  const needle = query.trim().toLocaleLowerCase('en');
  return sources.filter((source) => {
    const official = source.author.startsWith('OpenAI') || source.id === 'tibo';
    const matchesKind = kind === 'All' || (kind === 'Official' ? official : !official);
    return (
      matchesKind &&
      `${source.author} ${source.title} ${source.summary}`.toLocaleLowerCase('en').includes(needle)
    );
  });
}
