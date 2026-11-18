import { Menu } from '@base-ui/react/menu';
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react';

import { UiIcon, type UiIconName } from './icons';
import { ControlTooltip } from './tooltip';
import { cn, controlVariants } from './variants';

import './appearance.css';

type Appearance = 'system' | 'light' | 'dark';
const choices: { value: Appearance; label: string; icon: UiIconName }[] = [
  { value: 'system', label: 'System', icon: 'monitor' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
];
function isAppearance(value: unknown): value is Appearance {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** Collision-aware menu shell. Base UI owns presence, focus and dismissal. */
export function MenuSurface({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        side="bottom"
        align="end"
        sideOffset={5}
        collisionPadding={8}
        className="ds-menu-positioner"
      >
        <Menu.Popup aria-label={label} className="ds-menu-surface">
          <div className="ds-menu-content">{children}</div>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function syncPalette(value: Appearance) {
  const root = document.documentElement;
  root.dataset.theme = value;
  root.dataset.palette =
    value === 'system'
      ? matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : value;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', root.dataset.palette === 'dark' ? '#20232f' : '#ded5c5');
}

export function AppearanceControl() {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    const initial = document.documentElement.dataset.theme;
    return isAppearance(initial) ? initial : 'system';
  });
  const [open, setOpen] = useState(false);
  const transition = useRef<ViewTransition | null>(null);
  const generation = useRef(0);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = useRef(appearance);

  function stopTransition() {
    transition.current?.skipTransition();
    transition.current = null;
    delete document.documentElement.dataset.themeTransition;
  }
  function changeAppearance(value: Appearance, persist = true) {
    const root = document.documentElement;
    const next = ++generation.current;
    current.current = value;
    setAppearance(value);
    stopTransition();
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    delete root.dataset.themeFading;
    const apply = () => {
      if (next !== generation.current) return;
      syncPalette(value);
      if (persist) {
        try {
          localStorage.setItem('atlas.appearance', value);
        } catch {
          /* Memory preference remains usable. */
        }
      }
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    const routeTransition =
      document.activeViewTransition ||
      (CSS.supports('selector(:active-view-transition)') &&
        root.matches(':active-view-transition'));
    if (document.startViewTransition && !routeTransition) {
      root.dataset.themeTransition = 'true';
      const active = document.startViewTransition(apply);
      transition.current = active;
      void active.ready.catch(() => {});
      void active.finished
        .finally(() => {
          if (transition.current === active) {
            transition.current = null;
            delete root.dataset.themeTransition;
          }
        })
        .catch(() => {});
    } else {
      root.dataset.themeFading = 'true';
      void getComputedStyle(root).color;
      apply();
      fallbackTimer.current = setTimeout(() => {
        delete root.dataset.themeFading;
      }, 300);
    }
  }
  const onAppearance = useEffectEvent(changeAppearance);
  const onStop = useEffectEvent(stopTransition);
  const dispose = useEffectEvent(() => {
    ++generation.current;
    stopTransition();
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    delete document.documentElement.dataset.themeFading;
  });
  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const systemChange = () => {
      if (current.current === 'system') syncPalette('system');
    };
    const storage = (event: StorageEvent) => {
      if (event.key === 'atlas.appearance')
        onAppearance(isAppearance(event.newValue) ? event.newValue : 'system', false);
    };
    const motionChange = () => {
      if (reduced.matches) {
        onStop();
        if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
        delete document.documentElement.dataset.themeFading;
        syncPalette(current.current);
      }
    };
    const navigation = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) onStop();
    };
    syncPalette(current.current);
    system.addEventListener('change', systemChange);
    reduced.addEventListener('change', motionChange);
    window.addEventListener('storage', storage);
    window.addEventListener('popstate', onStop);
    document.addEventListener('click', navigation, true);
    return () => {
      dispose();
      system.removeEventListener('change', systemChange);
      reduced.removeEventListener('change', motionChange);
      window.removeEventListener('storage', storage);
      window.removeEventListener('popstate', onStop);
      document.removeEventListener('click', navigation, true);
    };
  }, []);
  return (
    <div className="theme-control">
      <Menu.Root modal={false} open={open} onOpenChange={setOpen}>
        <ControlTooltip
          content="Change appearance"
          disabled={open}
          render={
            <Menu.Trigger
              id="theme-trigger"
              className={cn(controlVariants({ variant: 'ghost', tone: 'neutral', size: 'md' }))}
              aria-label={`Theme: ${appearance}`}
            >
              <UiIcon
                name={choices.find((choice) => choice.value === appearance)!.icon}
                className="theme-phase"
              />
              <span>Theme</span>
              <UiIcon name="chevron-down" className="theme-chevron" />
            </Menu.Trigger>
          }
        />
        <MenuSurface label="Appearance">
          <Menu.RadioGroup
            value={appearance}
            onValueChange={(value: unknown) => {
              if (isAppearance(value)) changeAppearance(value);
            }}
            className="theme-options"
          >
            {choices.map((choice) => (
              <Menu.RadioItem
                key={choice.value}
                value={choice.value}
                closeOnClick
                nativeButton
                render={<button type="button" aria-label={choice.label} />}
                className={cn(controlVariants({ variant: 'ghost', tone: 'neutral', size: 'md' }))}
                data-theme-choice={choice.value}
              >
                <UiIcon name={choice.icon} />
                <span>{choice.label}</span>
                <Menu.RadioItemIndicator keepMounted>
                  <UiIcon name="check" className="choice-check" />
                </Menu.RadioItemIndicator>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </MenuSurface>
      </Menu.Root>
    </div>
  );
}
