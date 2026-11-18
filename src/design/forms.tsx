import { Field } from '@base-ui/react/field';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Tabs } from '@base-ui/react/tabs';
import { useReducedMotion } from 'motion/react';
import { Activity, startTransition, useId, useState, ViewTransition, type ReactNode } from 'react';

import { cn, controlVariants } from './variants';

import './forms.css';

export function TextField({
  label,
  description,
  errorMessage,
  className = '',
  ...props
}: Omit<Field.Control.Props, 'className'> & {
  className?: string;
  label: string;
  description?: string;
  errorMessage?: string;
}) {
  return (
    <Field.Root className={cn('ds-field', className)} validationMode="onBlur">
      <Field.Label className="ds-field-label">{label}</Field.Label>
      <Field.Control className="ds-field-input" {...props} />
      {errorMessage && <Field.Error className="ds-field-error">{errorMessage}</Field.Error>}
      {description && (
        <Field.Description className="ds-field-description">{description}</Field.Description>
      )}
    </Field.Root>
  );
}

export function ChoiceField<T extends string>({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <div className="ds-choice-field">
      <span id={id} className="ds-field-label">
        {label}
      </span>
      <RadioGroup
        className="ds-choice-group"
        aria-labelledby={id}
        value={value}
        onValueChange={onValueChange}
      >
        {options.map((option) => (
          <label
            className={cn(controlVariants({ variant: 'outline', tone: 'neutral' }), 'ds-choice')}
            key={option.value}
          >
            <Radio.Root className="ds-radio" value={option.value} aria-label={option.label}>
              <Radio.Indicator className="ds-radio-indicator" />
            </Radio.Root>
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export function AtlasTabs({
  label,
  items,
}: {
  label: string;
  items: readonly { value: string; label: string; content: ReactNode }[];
}) {
  const [value, setValue] = useState(items[0]?.value);
  const reduced = useReducedMotion();
  return (
    <Tabs.Root
      className="ds-atlas-tabs"
      value={value}
      onValueChange={(next) => startTransition(() => setValue(String(next)))}
    >
      <Tabs.List className="ds-tab-list" aria-label={label} activateOnFocus>
        {items.map((item) => (
          <Tabs.Tab
            className={cn(
              controlVariants({ variant: 'ghost', tone: 'neutral', size: 'lg' }),
              'ds-tab',
            )}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className="ds-tab-indicator" />
      </Tabs.List>
      <ViewTransition default={reduced ? 'none' : 'auto'}>
        <div className="ds-tab-panels">
          {items.map((item) => (
            <Tabs.Panel className="ds-tab-panel" key={item.value} value={item.value} keepMounted>
              <Activity mode={value === item.value ? 'visible' : 'hidden'}>{item.content}</Activity>
            </Tabs.Panel>
          ))}
        </div>
      </ViewTransition>
    </Tabs.Root>
  );
}
