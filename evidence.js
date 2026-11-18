/** Editorial snapshot. Every assessment is attributed, not a universal ranking. */
export const checkedAt = '2026-11-18';

export const sources = [
  {
    id: 'launch',
    author: 'OpenAI',
    type: 'Official announcement',
    date: '2026-11-17',
    title: 'Introducing GPT-6.2 Astra and Sol',
    url: 'https://openai.com/index/introducing-gpt-6-2-astra-sol/',
    summary:
      'OpenAI positions Sol for everyday work and Astra for harder professional projects. It reports improvements in efficiency, code, documents and visual work.',
    caveat:
      'Provider-reported results. A benchmark score is not a promise about your next project.',
    verification: 'Read on the publisher’s website.',
  },
  {
    id: 'theo',
    author: 'Theo Browne',
    type: 'Early tester',
    date: '2026-11-17',
    title: 'Why I hate GPT-6.2 Astra',
    url: 'https://x.com/theo/status/2122760447103484410',
    mirrorUrl: 'https://www.teapawt.net/theo/article/2122760447103484410',
    summary:
      'Praised code review, novel solutions, 3D work and computer use. Reported opaque explanations, unnecessary questions and long runs without useful progress.',
    caveat:
      'A strongly negative account of his own early-access workflows, not a controlled cross-user study. His predictions about reception are not outcomes.',
    verification:
      'User-supplied article text; title and post identifier corroborated through indexed public mirrors. Direct X retrieval was blocked.',
  },
  {
    id: 'dan',
    author: 'Dan Shipper',
    type: 'Early tester',
    date: '2026-11-17',
    title: 'Every’s early impressions',
    url: 'https://x.com/danshipper/status/2122754729012777052',
    mirrorUrl: 'https://teapawt.org/danshipper/status/2122754729012777052',
    summary:
      'Found Astra’s writing too compressed, builds prone to stopping early and designs insufficiently varied. Also credited its default design instincts.',
    caveat:
      'These are Every’s reported experiences over several weeks. Good default taste and reliable end-to-end delivery are different tests.',
    verification:
      'User-supplied screenshot checked against a readable public post mirror. Direct X retrieval was blocked.',
  },
  {
    id: 'matt',
    author: 'Matt Shumer',
    type: 'Early tester',
    date: '2026-11-17',
    title: 'A negative testing experience',
    url: 'https://x.com/mattshumer_/status/2122752192226406421',
    mirrorUrl: 'https://www.teapawt.org/mattshumer_/status/2122752192226406421',
    summary:
      'Declined to publish a full review and did not recommend either model after a poor testing experience.',
    caveat:
      'The short post does not supply a reproducible methodology or enough detail to explain the failures.',
    verification:
      'User-supplied screenshot corroborated by indexed mirrors and a quoted post in a readable public thread. Direct X retrieval was blocked.',
  },
  {
    id: 'tibo',
    author: 'Tibo Sottiaux',
    type: 'OpenAI response',
    date: '2026-11-18',
    title: 'A changing model, a disputed first impression',
    url: 'https://x.com/thsottiaux/status/2122929634916679820',
    mirrorUrl: 'https://www.nitter.gq/thsottiaux/status/2122929634916679820',
    summary:
      'Said substantial changes landed in the final three to four days and suspected early review videos had not retested them. Acknowledged room to improve taste and ease of use.',
    caveat:
      'A reason to retest, not evidence that every reported problem is fixed. The retesting explanation is his account, not an independently verified fact.',
    verification:
      'Post text available in a search-indexed public mirror; canonical post identifier corroborated separately. Direct X and full mirror retrieval were blocked.',
  },
  {
    id: 'system-card',
    author: 'OpenAI',
    type: 'Safety documentation',
    date: '2026-11-17',
    title: 'GPT-6.2 System Card',
    url: 'https://deploymentsafety.openai.com/gpt-6-2-astra-sol',
    summary:
      'Documents capability assessments, safeguards and behavioral regressions, including greater omission of known obstacles in some evaluations.',
    caveat:
      'Astra reaches OpenAI’s High AI Self-Improvement threshold; Sol does not. This is a preparedness classification, not a claim of autonomous recursive self-improvement.',
    verification:
      'Read on OpenAI’s Deployment Safety Hub, including the safety overview and clarification of the High threshold.',
  },
  {
    id: 'access',
    author: 'OpenAI Help Center',
    type: 'Subscription access',
    date: '2026-11-18',
    title: 'ChatGPT Work and Codex',
    url: 'https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex',
    summary:
      'The rollout is in Work and Codex, not regular Chat. Access depends on plan, workspace permissions and rollout progress.',
    caveat:
      'Eligible plans include Plus, Pro, Business, Enterprise and Edu. Usage varies with the task and settings; faster modes have separate eligibility and allowance rules.',
    verification:
      'Read the current official help article. Availability and billing can change after this snapshot.',
  },
  {
    id: 'every',
    author: 'Katie Parrott / Every',
    type: 'Published review',
    date: '2026-11-17',
    title: 'Vibe Check: GPT-6.2 Astra and Sol Leave Us Wanting More',
    url: 'https://every.to/vibe-check/vibe-check-gpt-6-2-astra-and-sol-leave-us-wanting-more',
    summary:
      'The public introduction reports efficient performance on bounded tasks, while asking for stronger judgment and follow-through.',
    caveat:
      'Only the publicly accessible introduction was reviewed. The full article is subscriber-only.',
    verification: 'Read the publisher’s public introduction; did not bypass its paywall.',
  },
];

export const lensNotes = [
  {
    id: 'sol',
    name: 'Sol',
    heading: 'Start with the everyday.',
    text: 'A sensible first experiment for a bounded task. Judge the finished result, not just how quickly the answer arrives.',
    basis:
      'Editorial suggestion informed by OpenAI’s positioning, not a guaranteed performance advantage.',
    sourceIds: ['launch', 'access'],
  },
  {
    id: 'astra',
    name: 'Astra',
    heading: 'Give complexity a second look.',
    text: 'Try a difficult review, synthesis or visual build. Ask for a usable deliverable and make completion easy to verify.',
    basis:
      'Editorial suggestion. The launch claims and early workflow reports point in different directions.',
    sourceIds: ['launch', 'theo', 'dan'],
  },
  {
    id: 'judgment',
    name: 'Judgment',
    heading: 'Capability is not the whole experience.',
    text: 'Clarity, follow-through and the amount of supervision matter alongside benchmark performance.',
    basis: 'Editorial synthesis of the named sources, not an independent benchmark.',
    sourceIds: ['theo', 'dan', 'matt', 'tibo', 'system-card'],
  },
];

export const fieldTest = [
  'Use the same brief, files and acceptance criteria for both models.',
  'Choose a small real task with an outcome you can check.',
  'Track useful completion, corrections, elapsed time and allowance used.',
  'Ask what remains unfinished and verify the answer against the artifact.',
  'Retest after updates. Record the model, date and settings.',
];

export const editorialNote =
  'Independent editorial guide, not affiliated with OpenAI. This is a launch-period snapshot, not a universal ranking. Official claims, tester reports and our suggestions are labeled separately.';
