import { themeEnum, themeType } from './constants';

export const isDarkTheme = (theme: themeType) => {
  return theme === themeEnum.Dark;
};

export const isLightTheme = (theme: themeType) => {
  return theme === themeEnum.Light;
};

export const generateCssVariables = (obj, str, setColorsStatic) => {
  if (typeof obj !== 'string') {
    const objArray = Object.keys(obj);
    return objArray.forEach((item) => {
      return generateCssVariables(obj[item], `${str}-${item}`, setColorsStatic);
    });
  }
  const newObj = {
    [`--osi${str}`]: obj,
  };
  setColorsStatic((prevState) => [...prevState, newObj]);
};

export const generateDynamicCss = (colorDefs, setColorsDynamic, Color) => {
  const generateItemCount = (is40?, is90?, is100?) => {
    let i;
    const itemCountArray = [];
    if (is40) {
      for (i = 0; i <= 30; i += 10) {
        itemCountArray.push(i as never);
      }
    }
    if (is90) {
      for (i = 50; i <= 80; i += 10) {
        itemCountArray.push(i as never);
      }
    }
    if (is100) {
      for (i = 92; i <= 100; i += 3) {
        itemCountArray.push(i as never);
      }
      itemCountArray.push(100 as never);
    }
    return itemCountArray;
  };

  const dynamicColors = colorDefs.dynamic;

  const originalData = Object.keys(dynamicColors).map((item) => {
    const colorTo40 = new Color('lch(0 0 214.79)');
    const colorFrom40To90 = new Color(dynamicColors[item][40]);
    const colorFrom90To100 = new Color(dynamicColors[item][90]);
    const newColors40 = colorTo40.steps(dynamicColors[item][40], {
      space: 'lch',
      outputSpace: 'srgb',
      steps: 5,
    });

    const newColorsFrom40To90 = colorFrom40To90.steps(dynamicColors[item][90], {
      space: 'lch',
      outputSpace: 'srgb',
      steps: 6,
    });

    newColorsFrom40To90.shift();

    const newColorsFrom90To100 = colorFrom90To100.steps('lch(100 0 214.79)', {
      space: 'lch',
      outputSpace: 'srgb',
      steps: 5,
    });

    newColorsFrom90To100.shift();

    const generatedObjectsTo40 = generateItemCount(true).map((colorKey, keyIndex) => {
      const colorItem = newColors40.find((color, index) => keyIndex === index && color);
      return {
        [colorKey as any]: colorItem.to('srgb').toString(),
      };
    });
    const generatedObjectsTo90 = generateItemCount(false, true).map((colorKey, keyIndex) => {
      const colorItem = newColorsFrom40To90.find((color, index) => keyIndex === index && color);
      return {
        [colorKey as any]: colorItem.to('srgb').toString(),
      };
    });

    const generatedObjectsTo100 = generateItemCount(false, false, true).map(
      (colorKey, keyIndex) => {
        const colorItem = newColorsFrom90To100.find((color, index) => keyIndex === index && color);
        return {
          [colorKey as any]: colorItem.to('srgb').toString(),
        };
      }
    );
    const genObjectItem = {};
    for (let i = 0; i < generatedObjectsTo40.length; i++) {
      if (generatedObjectsTo40) {
        Object.assign(genObjectItem, generatedObjectsTo40[i]);
      }
      if (generatedObjectsTo90) {
        Object.assign(genObjectItem, generatedObjectsTo90[i]);
      }
      if (generatedObjectsTo100) {
        Object.assign(genObjectItem, generatedObjectsTo100[i]);
      }
    }
    return {
      [item]: genObjectItem,
    };
  });

  const genObjectParent = {};
  for (let i = 0; i < originalData.length; i++) {
    Object.assign(genObjectParent, originalData[i]);
  }

  const generatedColorsObj = Object.keys(genObjectParent).map((item) => {
    return Object.keys(dynamicColors).map(
      (item2) =>
        item === item2 && {
          [item]: { ...dynamicColors[item2], ...genObjectParent[item] },
        }
    );
  });
  const finalArr = generatedColorsObj.map((item) => item.filter(Boolean)).flat(1);
  const finalObjOfColors = {};

  for (let i = 0; i < finalArr.length; i++) {
    Object.assign(finalObjOfColors, finalArr[i]);
  }
  generateCssVariables(finalObjOfColors, '', setColorsDynamic);
};

export const addThemeVariables = (colorsDynamic, themeName) => {
  const themeColor = (themeParamLight, themeParamDark, str?) => {
    return colorsDynamic?.map((item) => {
      const itemKey = Object.keys(item)[0];
      const themeValue = isDarkTheme(themeName) ? themeParamDark : themeParamLight;

      return itemKey === `--osi-${str}-${themeValue}` && item[itemKey];
    });
  };
  const newErrorColor = themeColor(40, 90, 'error')?.find((item) => item && item);
  const newWarningColor = themeColor(40, 90, 'warning')?.find((item) => item && item);
  const newLabelColor = themeColor(40, 90, 'primary')?.find((item) => item && item);
  const newBackgroundColor = themeColor(90, 40, 'primary')?.find((item) => item && item);
  const newBoxBorderColor = themeColor(60, 80, 'neutral')?.find((item) => item && item);
  const newBoxBorderHoverColor = themeColor(50, 90, 'neutral')?.find((item) => item && item);
  const newBoxBorderActiveColor = themeColor(40, 60, 'info')?.find((item) => item && item);
  const newBoxFieldTextColor = themeColor(10, 95, 'neutral')?.find((item) => item && item);
  const newBoxFieldContentColor = themeColor(100, 10, 'neutral')?.find((item) => item && item);
  const newBoxFieldIconColor = themeColor(40, 80, 'neutral')?.find((item) => item && item);
  const newBoxFieldIconHoverColor = themeColor(30, 95, 'neutral')?.find((item) => item && item);
  const newSelectedRowColor = themeColor(80, 30, 'neutral')?.find((item) => item && item);
  const newAccentColor = themeColor(90, 30, 'info')?.find((item) => item && item);
  const newThemeBackgroundColor = themeColor(100, 0, 'primary')?.find((item) => item && item);
  const newThemeTextColor = themeColor(0, 100, 'primary')?.find((item) => item && item);
  const newThemeAccentColor = themeColor(40, 20, 'success')?.find((item) => item && item);
  const newThemeSegmentedBackgroundColor = themeColor(10, 20, 'background')?.find(
    (item) => item && item
  );
  const newThemeSegmentedAccentColor = themeColor(70, 10, 'neutral')?.find((item) => item && item);
  const newRCPickerMobiscrollText = themeColor(40, 90, 'neutral')?.find((item) => item && item);
  const newRCPickerMobiscrollBackground = themeColor(98, 30, 'neutral')?.find(
    (item) => item && item
  );
  const newRCPickerMobiscrollAccent = themeColor(20, 40, 'info')?.find((item) => item && item);
  const secondaryBackground = themeColor(80, 40, 'secondary')?.find((item) => item && item);
  const secondaryText = themeColor(40, 80, 'secondary')?.find((item) => item && item);
  const successBackground = themeColor(80, 20, 'success')?.find((item) => item && item);
  const successText = themeColor(20, 80, 'success')?.find((item) => item && item);
  const dangerBackground = themeColor(80, 30, 'error')?.find((item) => item && item);
  const dangerText = themeColor(30, 80, 'error')?.find((item) => item && item);
  const warningBackground = themeColor(90, 40, 'warning')?.find((item) => item && item);
  const warningText = themeColor(40, 90, 'warning')?.find((item) => item && item);
  const lightBackground = themeColor(92, 30, 'info')?.find((item) => item && item);
  const lightText = themeColor(30, 92, 'info')?.find((item) => item && item);

  return {
    '--error-icon-color': newErrorColor,
    '--warning-icon-color': newWarningColor,
    '--primary-label-color': newLabelColor,
    '--neutral-border-color': newBoxBorderColor,
    '--neutral-border-hover-color': newBoxBorderHoverColor,
    '--neutral-border-active-color': newBoxBorderActiveColor,
    '--neutral-field-text-color': newBoxFieldTextColor,
    '--neutral-field-content-color': newBoxFieldContentColor,
    '--neutral-field-icon-color': newBoxFieldIconColor,
    '--neutral-field-icon-hover-color': newBoxFieldIconHoverColor,
    '--theme-tag-field-background': newBackgroundColor,
    '--theme-tag-field-text': newLabelColor,
    '--theme-devextreme-border': newSelectedRowColor,
    '--theme-devextreme-selected': newBoxBorderColor,
    '--theme-devextreme-select': newAccentColor,
    '--theme-devextreme-text': newBoxFieldTextColor,
    '--theme-devextreme-background': newBoxFieldContentColor,
    '--theme-background': newThemeBackgroundColor,
    '--theme-text': newThemeTextColor,
    '--theme-accent': newThemeAccentColor,
    '--theme-segmented-background': newThemeSegmentedBackgroundColor,
    '--theme-segmented-accent': newThemeSegmentedAccentColor,
    '--theme-segmented-text': newThemeTextColor,
    '--rc-picker-mobiscroll-text': newRCPickerMobiscrollText,
    '--rc-picker-mobiscroll-background': newRCPickerMobiscrollBackground,
    '--rc-picker-mobiscroll-accent': newRCPickerMobiscrollAccent,
    '--button-primary-background-color': newBackgroundColor,
    '--button-primary-text-color': newLabelColor,
    '--button-secondary-background-color': secondaryBackground,
    '--button-secondary-text-color': secondaryText,
    '--button-success-background-color': successBackground,
    '--button-success-text-color': successText,
    '--button-danger-background-color': dangerBackground,
    '--button-danger-text-color': dangerText,
    '--button-warning-background-color': warningBackground,
    '--button-warning-text-color': warningText,
    '--button-light-background-color': lightBackground,
    '--button-light-text-color': lightText,
    
  };
};
