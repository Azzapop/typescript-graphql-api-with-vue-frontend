import type { MenuItem } from 'primevue/menuitem';
import { computed, reactive, readonly } from 'vue';
import type { ColorName } from './color-palletes';
import type { PresetName } from './presets';
import type { SurfaceName } from './surface-palletes';

type LayoutConfig = {
  preset: PresetName;
  primary: ColorName;
  surface: SurfaceName | null;
  darkTheme: boolean;
  menuMode: 'static' | 'overlay';
};

const layoutConfig = reactive<LayoutConfig>({
  preset: 'Aura',
  primary: 'emerald',
  surface: null,
  darkTheme: false,
  menuMode: 'static',
});

type LayoutState = {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
  activeMenuItem: MenuItem | null;
};

const layoutState = reactive<LayoutState>({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  activeMenuItem: null,
});

export const useLayout = () => {
  const setPrimary = (value: ColorName) => {
    layoutConfig.primary = value;
  };

  const setSurface = (value: SurfaceName | null) => {
    layoutConfig.surface = value;
  };

  const setPreset = (value: PresetName) => {
    layoutConfig.preset = value;
  };

  const setActiveMenuItem = (item: MenuItem) => {
    layoutState.activeMenuItem = item.value || item;
  };

  const setMenuMode = (mode: 'static' | 'overlay') => {
    layoutConfig.menuMode = mode;
  };

  const toggleDarkMode = () => {
    if (!document.startViewTransition) {
      executeDarkModeToggle();

      return;
    }

    document.startViewTransition(() => executeDarkModeToggle());
  };

  const executeDarkModeToggle = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme;
    document.documentElement.classList.toggle('app-dark');
  };

  const onMenuToggle = () => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
    }

    if (window.innerWidth > 991) {
      layoutState.staticMenuDesktopInactive =
        !layoutState.staticMenuDesktopInactive;
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
    }
  };

  const resetMenu = () => {
    layoutState.overlayMenuActive = false;
    layoutState.staticMenuMobileActive = false;
    layoutState.menuHoverActive = false;
  };

  const isSidebarActive = computed(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
  );

  const isDarkTheme = computed(() => layoutConfig.darkTheme);

  const getPrimary = computed(() => layoutConfig.primary);

  const getSurface = computed(() => layoutConfig.surface);

  return {
    layoutConfig: readonly(layoutConfig),
    layoutState: readonly(layoutState),
    onMenuToggle,
    isSidebarActive,
    isDarkTheme,
    getPrimary,
    getSurface,
    setActiveMenuItem,
    toggleDarkMode,
    setPrimary,
    setSurface,
    setPreset,
    resetMenu,
    setMenuMode,
  };
};
