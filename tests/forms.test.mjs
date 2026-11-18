import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('real Base UI form render has named radios, associated field label and tab semantics', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const rendered = JSON.parse(
    execFileSync(
      `${root}node_modules/.bin/bun`,
      [
        '-e',
        `
    import { renderToStaticMarkup as render } from 'react-dom/server';
    import { createElement as el } from 'react';
    import { ChoiceField, TextField, WorksheetTabs } from './src/design/forms.tsx';
    console.log(JSON.stringify({
      radios: render(el(ChoiceField, {label:'Model',value:'Sol',onValueChange:()=>{},options:[{value:'Sol',label:'Sol'},{value:'Astra',label:'Astra'}]})),
      field: render(el(TextField, {label:'Search sources',type:'search',value:'',onValueChange:()=>{}})),
      tabs: render(el(WorksheetTabs, {label:'Workload to estimate',items:[{value:'a',label:'ChatGPT Pro',content:'first worksheet'},{value:'b',label:'Claude Ultra',content:'second worksheet'}]}))
    }));
  `,
      ],
      { cwd: root, encoding: 'utf8' },
    ),
  );
  assert.match(rendered.radios, /role="radiogroup" aria-labelledby="[^"]+"/);
  for (const name of ['Sol', 'Astra'])
    assert.match(rendered.radios, new RegExp(`role="radio"[^>]*aria-label="${name}"`));
  assert.match(rendered.radios, /aria-checked="true"/);
  const fieldId = rendered.field.match(/<label[^>]*for="([^"]+)"/)[1];
  assert.ok(rendered.field.includes(`<input id="${fieldId}"`));
  assert.match(rendered.tabs, /role="tablist" aria-label="Workload to estimate"/);
  assert.equal((rendered.tabs.match(/role="tab"/g) || []).length, 2);
  assert.equal((rendered.tabs.match(/role="tabpanel"/g) || []).length, 2);
  assert.match(rendered.tabs, /aria-selected="true"/);
  assert.match(rendered.tabs, /hidden=""[^>]*role="tabpanel"[^>]*inert=""/);
  assert.ok(rendered.tabs.includes('first worksheet'));
  assert.ok(!rendered.tabs.includes('second worksheet'));
});

test('worksheet panels preserve independent state and honor reduced motion', async () => {
  const forms = await readFile(new URL('../src/design/forms.tsx', import.meta.url), 'utf8');
  const worksheet = await readFile(
    new URL('../src/subscription-value.tsx', import.meta.url),
    'utf8',
  );
  assert.match(forms, /activateOnFocus/);
  assert.match(forms, /validationMode="onBlur"/);
  assert.match(forms, /<Field.Error/);
  assert.doesNotMatch(forms, /required/);
  assert.match(worksheet, /Check the entered values/);
  assert.match(forms, /keepMounted/);
  assert.match(forms, /<Activity mode=\{value === item.value \? 'visible' : 'hidden'\}/);
  assert.match(forms, /<ViewTransition default=\{reduced \? 'none' : 'auto'\}/);
  assert.match(worksheet, /function Worksheet[\s\S]*?useState\(initial\)/);
  assert.equal((worksheet.match(/content: <Worksheet/g) || []).length, 2);
  assert.doesNotMatch(worksheet, /type="radio"|placeholder="Enter value"/);
});
