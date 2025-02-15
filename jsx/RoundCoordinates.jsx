/*
  RoundCoordinates.jsx for Adobe Illustrator
  Description: The script rounds the coordinates of the center of the object
  Date: June, 2020
  Author: Sergey Osokin, email: hi@sergosokin.ru

  Installation: https://github.com/creold/illustrator-scripts#how-to-run-scripts

  Release notes:
  0.1 Initial version
  0.2.0 Supports clipping groups, align to reference point
  0.2.1 Uses the document ruler mode to get coordinates

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via YooMoney https://yoomoney.ru/to/410011149615582
  - via QIWI https://qiwi.com/n/OSOKIN
  - via Donatty https://donatty.com/sergosokin
  - via PayPal http://www.paypal.me/osokin/usd

  NOTICE:
  Tested with Adobe Illustrator CC 2018-2021 (Mac), 2021 (Win).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale

  Released under the MIT license
  http://opensource.org/licenses/mit-license.php

  Check other author's scripts: https://github.com/creold
*/

//@target illustrator
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true; // Enabling automatic localization

function main() {
  var CFG = {
        refPoint: app.preferences.getIntegerPreference('plugin/Transform/AnchorPoint'),
        inclStroke: !app.preferences.getBooleanPreference('includeStrokeInBounds'),
      },
      LANG = {
        errDoc: { en: 'Error\nOpen a document and try again',
                  ru: 'Ошибка\nОткройте документ и запустите скрипт' },
        errSel: { en: 'Error\nPlease select atleast one object',
                  ru: 'Ошибка\nВыделите хотя бы 1 объект' },
        msg: { en: 'Use global (Y) or artboard (N) rulers?' + '\nArtboard rulers are set by default. ' +
                  'To toggle between rulers modes, choose View > Rulers > Change to...',
              ru: 'Использовать глобальные (Да) или линейки монтажной области (Нет)?' + '\nЛинейки монтажной области установлены по умолчанию. ' +
                  'Для переключения режимов линеек, выберите\nПросмотр > Линейки > Сменить...' }
      }

  if (!documents.length) {
    alert(LANG.errDoc);
    return;
  }

  if (!selection.length || selection.typename == 'TextRange') {
    alert(LANG.errSel);
    return;
  }

  var doc = activeDocument,
      defCoordSys = app.coordinateSystem,
      isConfirm = confirm(LANG.msg),
      bounds = []; // Bounds in document units

  if (!isConfirm) {
    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
  } else {
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
  }

  for (var i = 0, selLen = selection.length; i < selLen; i++) {
    var currItem = selection[i],
        currBoundsPx = getVisibleBounds(currItem, CFG.inclStroke);

    for (var j = 0; j < currBoundsPx.length; j++) {
      bounds.push(convertUnits(currBoundsPx[j], getDocUnit()));
    }
    
    var delta = getDelta(CFG.refPoint, bounds);

    // If has been replaced by the clipping mask bounds
    currBoundsPx = CFG.inclStroke ? currItem.visibleBounds : currItem.geometricBounds;
    currItem.position = [currBoundsPx[0] + delta.x, currBoundsPx[1] + delta.y];

    bounds = []; // Reset array
  }

  app.coordinateSystem = defCoordSys;
}

// Get the fractional part of the coordinates for the move
function getDelta(point, bounds) {
  var x = y = 0,
      left = Math.round(bounds[0]) - bounds[0],
      right = Math.round(bounds[2]) - bounds[2],
      top = Math.round(bounds[1]) - bounds[1],
      bottom = Math.round(bounds[3]) - bounds[3]
      centerX = bounds[0] + (bounds[2] - bounds[0]) / 2,
      centerY = bounds[1] + (bounds[3] - bounds[1]) / 2;

  switch (point) {
    case 0: // Left Top
      x = left;
      y = top;
      break;
    case 1: // Top Center
      x = Math.round(centerX) - centerX;
      y = top;
      break;
    case 2: // Top Right
      x = right;
      y = top;
      break;
    case 3: // Left Center
      x = left;
      y = Math.round(centerY) - centerY;
      break;
    case 4: // Center Center
      x = Math.round(centerX) - centerX;
      y = Math.round(centerY) - centerY;
      break;
    case 5: // Right Center
      x = right;
      y = Math.round(centerY) - centerY;
      break;
    case 6: // Left Bottom
      x = left;
      y = bottom;
      break;
    case 7: // Center Bottom
      x = Math.round(centerX) - centerX;
      y = bottom;
      break;
    case 8: // Bottom Right
      x = right;
      y = bottom;
      break;
  }

  x = convertUnits(x + getDocUnit(), 'px');
  y = convertUnits(y + getDocUnit(), 'px');

  return { 'x': x, 'y': y };
}

// Get the bounds of the visible content
function getVisibleBounds(item, inclStroke) {
  var childs = [];

  if (item.typename === 'GroupItem' && !item.clipped) {
    getChilds(item.pageItems, childs);
  } else if (item.typename === 'GroupItem' && item.clipped) {
    childs.push(getClippingPath(item));
  } else {
    childs.push(item);
  }

  var bounds = inclStroke ? childs[0].visibleBounds : childs[0].geometricBounds;

  for (var i = 0, len = childs.length; i < len; i++) {
    var itemBnds = inclStroke ? childs[i].visibleBounds : childs[i].geometricBounds;
    bounds = compareBounds(itemBnds, bounds);
  }

  return bounds;
}

// Get inner items excluding the contents of the clipping groups
function getChilds(collection, arr) {
  for (var i = 0, iLen = collection.length; i < iLen; i++) {
    var currItem = collection[i];
    try {
      switch (currItem.typename) {
        case 'GroupItem':
          if (!currItem.clipped) {
            getChilds(currItem.pageItems, arr);
          } else {
            var mask = getClippingPath(currItem);
            arr.push(mask);
          }
          break;
        default:
          arr.push(currItem);
          break;
      }
    } catch (e) {}
  }
}

// Get clipping path in group
function getClippingPath(group) {
  for (var i = 0, len = group.pageItems.length; i < len; i++) {
    var currItem = group.pageItems[i];
    if (isClippingPath(currItem)) {
      return currItem;
    }
  }
}

// Check clipping mask
function isClippingPath(item) {
  var clipText = (item.typename === 'TextFrame' &&
                  item.textRange.characterAttributes.fillColor == '[NoColor]' &&
                  item.textRange.characterAttributes.strokeColor == '[NoColor]');
  return (item.typename === 'CompoundPathItem' && item.pathItems[0].clipping) ||
          item.clipping || clipText;
}

// Comparison of array extrema
function compareBounds(itemBnds, currBnds) {
  return [Math.min(itemBnds[0], currBnds[0]),
    Math.max(itemBnds[1], currBnds[1]),
    Math.max(itemBnds[2], currBnds[2]),
    Math.min(itemBnds[3], currBnds[3])
  ];
}

// Units conversion
function getDocUnit() {
  var unit = activeDocument.rulerUnits.toString().replace('RulerUnits.', '');
  if (unit === 'Centimeters') unit = 'cm';
  else if (unit === 'Millimeters') unit = 'mm';
  else if (unit === 'Inches') unit = 'in';
  else if (unit === 'Pixels') unit = 'px';
  else if (unit === 'Points') unit = 'pt';
  return unit;
}

function getUnits(value, def) {
  try {
    return 'px,pt,mm,cm,in,pc'.indexOf(value.slice(-2)) > -1 ? value.slice(-2) : def;
  } catch (e) {}
};

function convertUnits(value, newUnit) {
  if (value === undefined) return value;
  if (newUnit === undefined) newUnit = 'px';
  if (typeof value === 'number') value = value + 'px';
  if (typeof value === 'string') {
    var unit = getUnits(value),
        val = parseFloat(value);
    if (unit && !isNaN(val)) {
      value = val;
    } else if (!isNaN(val)) {
      value = val;
      unit = 'px';
    }
  }

  if ((unit === 'px' || unit === 'pt') && newUnit === 'mm') {
      value = parseFloat(value) / 2.83464566929134;
  } else if ((unit === 'px' || unit === 'pt') && newUnit === 'cm') {
      value = parseFloat(value) / (2.83464566929134 * 10);
  } else if ((unit === 'px' || unit === 'pt') && newUnit === 'in') {
      value = parseFloat(value) / 72;
  } else if (unit === 'mm' && (newUnit === 'px' || newUnit === 'pt')) {
      value = parseFloat(value) * 2.83464566929134;
  } else if (unit === 'mm' && newUnit === 'cm') {
      value = parseFloat(value) * 10;
  } else if (unit === 'mm' && newUnit === 'in') {
      value = parseFloat(value) / 25.4;
  } else if (unit === 'cm' && (newUnit === 'px' || newUnit === 'pt')) {
      value = parseFloat(value) * 2.83464566929134 * 10;
  } else if (unit === 'cm' && newUnit === 'mm') {
      value = parseFloat(value) / 10;
  } else if (unit === 'cm' && newUnit === 'in') {
      value = parseFloat(value) * 2.54;
  } else if (unit === 'in' && (newUnit === 'px' || newUnit === 'pt')) {
      value = parseFloat(value) * 72;
  } else if (unit === 'in' && newUnit === 'mm') {
      value = parseFloat(value) * 25.4;
  } else if (unit === 'in' && newUnit === 'cm') {
      value = parseFloat(value) * 25.4;
  }
  return parseFloat(value);
}

try {
  main();
} catch (e) {}