import React, { useEffect, useState } from 'react';
import Color from 'colorjs.io/dist/color.legacy.cjs';

import { themeEnum, themeType } from './constants';
import colorDefs from './color-defs.json';
import { addThemeVariables, generateCssVariables, generateDynamicCss } from './utils';

export interface ThemeProviderProps {
  themeName?: themeType;
  children: any;
}
export const ThemeContext = React.createContext('lightTheme');

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, themeName = themeEnum.Light }) => {
  const [colorsStatic, setColorsStatic] = useState<any>([]);
  const [colorsDynamic, setColorsDynamic] = useState<any>([]);
  const newTheme = addThemeVariables(colorsDynamic, themeName);

  useEffect(() => {
    Object.keys(newTheme).map((key) => {
      return document.documentElement.style.setProperty(key, newTheme[key]);
    });
  }, [colorsDynamic, themeName]);

  useEffect(() => {
    generateCssVariables(colorDefs.static, '', setColorsStatic);
    generateDynamicCss(colorDefs, setColorsDynamic, Color);
    colorsStatic.map((item) => {
      return Object.keys(item).map((key) => {
        return document.documentElement.style.setProperty(key, item[key]);
      });
    });
    colorsDynamic.map((item) => {
      return Object.keys(item).map((key) => {
        return document.documentElement.style.setProperty(key, item[key]);
      });
    });
  }, []);

  return <ThemeContext.Provider value={themeName}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
