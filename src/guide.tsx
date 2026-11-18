import { Link } from '@tanstack/react-router';
import { flexRender } from '@tanstack/react-table';
import {
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from '@tanstack/react-table/legacy';

import { Benchmarks } from './benchmarks';
import { UiIcon } from './design/icons';
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
    <Page kind="guide" title="Choosing a model">
      <div className="atlas-duet">
        <section className="atlas-model atlas-sol">
          <h2>Sol</h2>
          <p>
            OpenAI positions Sol as the efficient choice for everyday work. Give it a bounded task
            and judge the artifact, not just the first response.
          </p>
          <SourceLink id="launch">Official positioning</SourceLink>
        </section>
        <section className="atlas-model atlas-astra">
          <h2>Astra</h2>
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
      <Benchmarks />
      <div className="atlas-next">
        <Link to="/field-notes">
          Read the field notes <UiIcon name="arrow-up-right" />
        </Link>
        <Link to="/access">
          Find your access <UiIcon name="arrow-up-right" />
        </Link>
      </div>
    </Page>
  );
}
