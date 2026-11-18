import { Link } from '@tanstack/react-router';
import { flexRender } from '@tanstack/react-table';
import {
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from '@tanstack/react-table/legacy';

import { Page, SourceLink } from './shared';
const comparison = [
  {
    dimension: 'Where to start',
    sol: 'Everyday, bounded work',
    astra: 'Harder professional projects',
    basis: 'OpenAI’s positioning',
  },
  {
    dimension: 'A useful first test',
    sol: 'A document, synthesis or focused edit',
    astra: 'A demanding review or visual build',
    basis: 'Our editorial suggestion',
  },
  {
    dimension: 'What to watch',
    sol: 'Whether speed still yields a finished result',
    astra: 'Follow-through, clarity and supervision',
    basis: 'Questions raised by early reports',
  },
  {
    dimension: 'Where to find them',
    sol: 'ChatGPT Work and Codex',
    astra: 'ChatGPT Work and Codex',
    basis: 'Official subscription documentation',
  },
];
const comparisonColumns: LegacyColumnDef<(typeof comparison)[number]>[] = [
  { accessorKey: 'dimension', header: 'The question' },
  { accessorKey: 'sol', header: 'Sol' },
  { accessorKey: 'astra', header: 'Astra' },
  { accessorKey: 'basis', header: 'Basis' },
];

export default function Guide() {
  const table = useLegacyTable({
    data: comparison,
    columns: comparisonColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Page
      chapter="01 / THE GUIDE"
      title="Two models. Your work."
      intro="Not a leaderboard. A starting point for deciding what deserves a place in your workflow."
    >
      <div className="atlas-duet">
        <section className="atlas-model atlas-sol">
          <span className="atlas-orbit-mark" aria-hidden="true">
            ☼
          </span>
          <h2>Sol</h2>
          <p className="atlas-deck">Start with the everyday.</p>
          <p>
            OpenAI positions Sol as the efficient choice for everyday work. Give it a bounded task
            and judge the artifact, not just the first response.
          </p>
          <SourceLink id="launch">Official positioning</SourceLink>
        </section>
        <section className="atlas-model atlas-astra">
          <span className="atlas-orbit-mark" aria-hidden="true">
            ✧
          </span>
          <h2>Astra</h2>
          <p className="atlas-deck">Make room for complexity.</p>
          <p>
            OpenAI positions Astra for harder professional projects. Early testers saw impressive
            capabilities alongside frustrating failures of clarity and follow-through.
          </p>
          <SourceLink id="launch">Official positioning</SourceLink>
          <span className="atlas-link-divider"> · </span>
          <SourceLink id="theo">Tester perspective</SourceLink>
        </section>
      </div>
      <section className="atlas-section">
        <div className="atlas-section-head">
          <h2>A practical comparison</h2>
          <p>Suggestions are labeled. Neither column is a guarantee.</p>
        </div>
        <section
          className="atlas-table-scroll"
          tabIndex={0}
          aria-label="Model comparison, horizontally scrollable on small screens"
        >
          <table className="atlas-table">
            <caption className="atlas-sr-only">
              Sol and Astra: positioning and practical tests
            </caption>
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th scope="col" key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) =>
                    index === 0 ? (
                      <th scope="row" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </th>
                    ) : (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
      <aside className="atlas-pullquote">
        <p>More capability does not automatically mean less supervision.</p>
        <span>Our reading of the launch-period evidence</span>
      </aside>
      <div className="atlas-next">
        <Link to="/field-notes">
          Read the field notes <span>↗</span>
        </Link>
        <Link to="/access">
          Find your access <span>↗</span>
        </Link>
      </div>
    </Page>
  );
}
