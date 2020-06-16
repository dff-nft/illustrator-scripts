/*
  SelectPointsType.jsx for Adobe Illustrator
  Description: Selects points on the selected paths according to their type.
  Date: May, 2020
  Author: Sergey Osokin, email: hi@sergosokin.ru
  ============================================================================
  Installation: https://github.com/creold/illustrator-scripts#how-to-run-scripts
  ============================================================================
  Versions:
   1.0 Initial version. Tolerance for broken points handles 0..180 degrees
   1.1 Changed points type algorithm. Broken points 0..15 degrees. Corner points > 15 degrees
  ============================================================================
  Donate (optional): If you find this script helpful, you can buy me a coffee
                     via PayPal http://www.paypal.me/osokin/usd
  ============================================================================
  NOTICE:
  Tested with Adobe Illustrator CC 2020 (Win), 2019 (Mac).
  This script is provided "as is" without warranty of any kind.
  Free to use, not for sale.
  ============================================================================
  Released under the MIT license.
  http://opensource.org/licenses/mit-license.php
  ============================================================================
  Check other author's scripts: https://github.com/creold
*/

//@target illustrator

var SCRIPT_NAME = 'SelectPointsType',
    SCRIPT_VERSION = 'v.1.1';

// Folder for icons
var ICNS_FOLDER = Folder.myDocuments + '/Adobe Scripts/' + SCRIPT_NAME + '/';
if(!Folder(ICNS_FOLDER).exists) Folder(ICNS_FOLDER).create();

// RAW icons data
var SMOOTH_ICNS_RAW = {
      normal:   new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02\u00AEIDATX\u0085\u00ED\u0097_HSQ\x1C\u00C7?\u00B7?lT\u008CY\u009A\t\u0091\u00B9^4\x04\u0087E\x1A\x14\u00CC\u0097\u00E8\x1F\x14\x04\u00BD\u00F8\u00E0 \u00B0\u0082J\t_/\u0099#\u00E8)*\u0082,\u00C8\u00F4\u00C1\u00A7\x10\f\u00B2\u00A4\u0097\u0084z\u00A8\u0088\u00B5Q\u00E0C`3\u00A4U&MM\u009B\u0096\u009D8\u00D7\u00DDy\u00B6\u00DD9k\x0F\u00F6p\u00BFp\u00E1\u009C\u00DF\u00FD\u009D\u00EF\u00F9\u00EC\u00FC\u00BD\u00D3\u0084\x10,\u00B7V,;\u0081\r\u00A1\u00C8\u00860eC\u0098\u00B2!L\u00FD\x17\x10\u00AB,\u00A3\x01m+ \u009F\x18\u00BA\b-\u00EA\x10\u00D0\u00DC\u00807Q\x0B\u00A1\u008BX\u008E|\u0099+\u00DBD\u00D0ED\u00862\u00EF\u008E\u009B\x15\u00ED8\x0B\x1A\u00F0\u00ECs\x12}\u00F5\u0093\u0089\u0091\u00974\u0086\u00F6X\x1A\u00DE\u00A9\u00D9Kl\u00E8!\u0095\u00F5\u00EB\u008C\u00FA\u00DB\u00EE\u00EF\u00B8=\x079\u00F1\u00E2\u00A9e\u00FEm\u00EF3\\\u009BwQ\u00B2s5C\u008F\u00E3\u00C4\u00BFuqz\u00F0\x14\x12\"\u00F9\u00B4\u00E1\x15\x1D\u00BB\x7F\bU\u00FDMB\u00B4W\u00B6\u00A4\u00E5\u00B9E\x1B~q\u00BDl\\D_/$\u00CB\u00B2\u008C\u00C9w2Gm#=\u00A4\u0097*\u00D9W\x1B\u00DE\u00D4\u00E9(\u00A9\u00AE\u00A7\u00BA\u00D1\u0099\x12+?\n\u00EF\x1E\u00B4\x10\u00D0\x0E\x03\u00CE\u00C44\x15\x1B\u00EF\x1C.\u00D8\u00E4]\u00C8\u0095e\u0087\u00CB\x05\u00DC5\u009E\u0080\u00F6\u00D9\x18v\u0088S\u00B0\u00AD\u00DC\u00F0R\u00B5\u00FD\u00B8\u0093\u00B9\u0099\u00FA\u00D4\u0085\x19\r\u00F6\u00F1)m\t\u00C4\"\u00E0t\u00F7\x03\u00BD@M\x12@jb\x04\u00E2\u00CA\x12\u0090\u00E5\u00C9\u008Fj\u00EB\u00E2D\u009B^\u00C3#\x16\u00C9\u00F4\u009E\x1E\x0Be\u00AE\u0089k[F\u00A9=_H\u0095\x1F\u0086\x07\u00A0\u00EF\u00E44S_\x1E\x01\u00C7\u00D2fx\x18\u00B7g\u008C\u00A2\u008A*\u00F6\u00DFXiD\u00FA\u00CF\u00CC1:\x18&6\u00B4\x01(M\u00CB\u00EFa\u00ED\u00C6\x03\x1C\u00BA\u00B5\u0086R\x1F\u0084;\u00E1\u00F9\u0095\u00AF4}(\u00CA\u0084\u0090\u00AB\u00BDd\u00C7Uf\u00C6}8\\o\u0088\x06g\u00D2\x00\u0086\u0081Vt\u00D1i\u00D4:j\x1B\u0099\u009D<k\u0094g\u00A7.s.\u00D2\u009D\u00F0\u00F1\x1By\u00A90=\x14\u0096\u00AF\u00E7\u00F7/\x0F\x0E\u00D7=\u00A2\u00C1Kr7-\u00FEe\x15\u00D0\u00A4\u00C9\x05%r\x1F\u00F0\u00E7\u00DC\u0086\u00EA\x0F\x02\t{D\u0089^D\x17\u00ADjZv\u0088\u00F9\u00B3\u00E2\u00BD\x12\u00E9B\x17\u00FE%u\u009E\u00E9%A\x1A\u0094H\u0099yF\u0090\u00E3\u00C4Ti\u00E5\x144\u00FF\x13\u00C0\u00BC\u009A\x13\x1EV\u00DEYF\"s\x14\u00EA\u00D0\u00C5@\x1E\x10\u00D2\u00D3\x07<Q\"\u00C9\u00D1\u00C86\x12\u00EA\u0086\x0E\u00E7\r 5\u00EF\x11\u00B6\u00EA#\x1B\u0084O)\u00F7\u00E6\r`\u00ED\u0095\u00EC#\x1B\u0084[)\u00E7?\n\u00D6^\u00C9>\u00B2A(g1K\u00DB\u008EK\u0093\u00EA\u0095\u00EC\u00C3\u00FA*W\u00D7D\u00AE\u00AB\u00FCo$\u00BD\x02Z]z\x0B\u00FBo\u00A0)\x1B\u00C2\u0094\ra\u00CA\u00860\u00B5\u00FC\x10\u00C0\x1F\u00C1c-8\u00DA\x1D\u00C2\u00CF\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      disabled: new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x03\x00IDATX\u0085\u00ED\u00971L\x13Q\x18\u00C7\u00FFEI^\x1As\x11SJ\x17(\u0096E\u0098:\x10\x1B\x13\u009B\u00C0f\u008CD\x12\x13\x16b`\u00F2u\u00D0\u0088\t\u00860\u0090\u00B6!\u00D2\x12\x1Dt\u00EB\u009B\u00944\x0E`Lp\u00D0\u00B8iPbp*\x18`\u00C1J\x0F\x16\u00C9\x11Z#w\u00B5\"\u0098g\u00EE.\u00AFpW\u00D0\x0E8\u00DC?\u00B9\u00E4\u00DD\u00D7\u00F7\u00FE\u00DF\u00EF\u00BE\u00F7\u00DDk\u00EB\u00DA\u00DB\u00DB\u00C3q\u00AB\u00E6\u00D8\t\x1C\bA\x0E\u0084!\x07\u00C2\u0090\x03a\u00E8\u00BF\u00808i\x15\u00A4\u00946\x03\u00E0W\u009E1\u0096\u00A9d@)=\r \u00A8\u00DFf\x18c\u00F9C\u00E6\u00F3\u00B9|\u00CD*cl\u0095\u00C7\x0E|wD\u00A3\u00D1\u0094\u00DB\u00ED\u00EEkkk#\u00B9\\\u00EE\u00E7\u00D6\u00D6\u00D6\u00C7\u0091\u0091\u0091\u008BV\u0086\u0089D\"\u00AC(\u00CA\u00ABP(t\u008A\u00DF\u00CF\u00CD\u00CD}\u00F7x<\u0097\u0087\u0087\u0087\u00DFY\u00CD\x1F\x1D\x1D}_WWw\u00DE\u00EF\u00F7\u00D7.--\x15UU\u009D\u0088\u00C7\u00E3\u00912\bN\x19\b\x04>\f\r\r\x11#655\u0085\u00E5\u00E5\u00E5\u00BB\u00D1h\u00F4\u00C1\u00BE\u00A7\u00EF\u00F6x<\u008F\"\u0091\u0088\u00D4\u00D8\u00D8\u00F8'\u00BE\u00B6\u00B6\u0086T*\u00F5MQ\u0094\u00DB\x00\u00A6\u00C5\u00AA\u00C4\u00E3\u00F1\u00C1\u00D6\u00D6\u00D6\u00FB===f\u00BE\u00F1\u00F1\u00F1b6\u009B\u00BDP\u00B6\x1DMMM\u00BD\u00E1p\u0098\u0088\u00B1`0\u0088\u0085\u0085\u0085AJ\u00E9\x15\x00D\u00DF\u00A6\x06\u00FE\x19!\x04\x06\x00\x17\x1F\x13B$\x00\u008F\u00F9E)\u00FD\u00CA\u00CB\x0E\u00A0X__\x7F\u008E{\u0089joo';;;\u00BDe\u008D)\u00CB\u00F2\u00CB\u00F5\u00F5\u00F5\u00B2\u0089\u008A\u00A2\u00C0\u00EDv\u00BF\u00E6O\x06 d\x00p\u00E5\u00F3y\u00A8\u00AAj\u00CE\u00E5\u00E3B\u00A1 .o\u00D0\u00D7Ls\x0F\u00EE%jss\x13\u00DB\u00DB\u00DB\u0099\x13\u00B1X\u00CC\fwuu\u00AD\u00A6\u00D3\u00E9\u009B.\u0097\u00CB\u00ED\u00F3\u00F9\u00B0\u00B8\u00B8\u0088\u00C9\u00C9IuccC\x06pg\u00DF\x16\u00E7$I\u00CA\u00AE\u00AC\u00ACx[ZZj4MC:\u009D\u00FE\u00A5iZFU\u00D5\u0092\u00DE|\u0086.\x15\n\u0085\u00CF\u00D9l\u00B6\u00D9\u00EB\u00F5\u00D6J\u0092\u0084\u0099\u0099\x19\u00CC\u00CE\u00CE*\u0089D\u00E2\u00FA\u0081\u00C6\u00E4\u00FB\u00ED\u00F7\u00FB\x1Fj\u009A\u00D6A\b\u00F9$\u00CB\u00F2\x0F\x00\u00D7\u00C4\u00E4\x00b\u008C\u00B1'\u00FC&\u0099L\u00DE(\x16\u008B\u00B7\u00F8\u00B8T*%\u00C7\u00C6\u00C6\u009E\u00EA>\u00FD|\x1E\x00\u00BF\u00B0\u00F6\u00B9\u00CF\u00E7;\u00B3\u00BB\u00BB\x1B \u0084<\u0093e\u00F9\x1E\u00EF\u009B\u008A\u00BF\u00AC(\u00A5\u00DC$*\u0084^\x00\u00E8?\u00EC5\x14\x1F\b\x00\u0087\u00BD*\u0084\u00E3\u008C\u00B1\u00988\u00CF\x16B?+\u00BE\b\u00A1\t\u00C6X\u00FFQ\u0092[xq\u0090>!t\u00D68#p\u00C8\u0089)\u00D2\u00F2-\x18\u00F8\x17\x00]\x03\u00BA\u0087\u0095\u00B7u%,\u00AA\u00D0\u00C9\x18{[\x05\x04\u00F7\u00EC\x00\u00F0F\b\u0099\u00D5\u00B0\u00ABD\u00B70\u009E\u00AF\x16\u0080K\u00F7\u0098\u00B7\u00CAa\x07\u00D1!\u008C\u00A7\u00AB\x05\u00B0\u00F12s\u00D8A\u0088\u00EFx\u00D5U\u00B0\u00F12s\u00D8A\u0088\u00E7\u00EB\u0091^\u00C7#J\u00F42sT\u00EA\u0089N\u00BD!+~\u0095\u00FF\u008Dt\u00AFN\u00FD2{\u00C2\u00F9\x1Bh\u00C8\u00810\u00E4@\x18r \f\x1D?\x04\u0080\u00DF\u00D6\x06/t\u00D4\x0BO\u00DA\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      pressed:  new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02\u00AEIDATX\u0085\u00ED\u0097_HSQ\x1C\u00C7?\u00B7?lT\u008CY\u009A\t\u0091\u00B9^4\x04\u0087E\x1A\x14\u00CC\u0097\u00E8\x1F\x14\x04\u00BD\u00F8\u00E0 \u00B0\u0082J\t_/\u0099#\u00E8)*\u0082,\u00C8\u00F4\u00C1\u00A7\x10\f\u00B2\u00A4\u0097\u0084z\u00A8\u0088\u00B5Q\u00E0C`3\u00A4U&MM\u009B\u0096\u009D8\u00D7\u00DDy\u00B6\u00DD9k\x0F\u00F6p\u00BFp\u00E1\u009C\u00DF\u00FD\u009D\u00EF\u00F9\u00EC\u00FC\u00BD\u00D3\u0084\x10,\u00B7V,;\u0081\r\u00A1\u00C8\u00860eC\u0098\u00B2!L\u00FD\x17\x10\u00AB,\u00A3\x01m+ \u009F\x18\u00BA\b-\u00EA\x10\u00D0\u00DC\u00807Q\x0B\u00A1\u008BX\u008E|\u0099+\u00DBD\u00D0ED\u00862\u00EF\u008E\u009B\x15\u00ED8\x0B\x1A\u00F0\u00ECs\x12}\u00F5\u0093\u0089\u0091\u00974\u0086\u00F6X\x1A\u00DE\u00A9\u00D9Kl\u00E8!\u0095\u00F5\u00EB\u008C\u00FA\u00DB\u00EE\u00EF\u00B8=\x079\u00F1\u00E2\u00A9e\u00FEm\u00EF3\\\u009BwQ\u00B2s5C\u008F\u00E3\u00C4\u00BFuqz\u00F0\x14\x12\"\u00F9\u00B4\u00E1\x15\x1D\u00BB\x7F\bU\u00FDMB\u00B4W\u00B6\u00A4\u00E5\u00B9E\x1B~q\u00BDl\\D_/$\u00CB\u00B2\u008C\u00C9w2Gm#=\u00A4\u0097*\u00D9W\x1B\u00DE\u00D4\u00E9(\u00A9\u00AE\u00A7\u00BA\u00D1\u0099\x12+?\n\u00EF\x1E\u00B4\x10\u00D0\x0E\x03\u00CE\u00C44\x15\x1B\u00EF\x1C.\u00D8\u00E4]\u00C8\u0095e\u0087\u00CB\x05\u00DC5\u009E\u0080\u00F6\u00D9\x18v\u0088S\u00B0\u00AD\u00DC\u00F0R\u00B5\u00FD\u00B8\u0093\u00B9\u0099\u00FA\u00D4\u0085\x19\r\u00F6\u00F1)m\t\u00C4\"\u00E0t\u00F7\x03\u00BD@M\x12@jb\x04\u00E2\u00CA\x12\u0090\u00E5\u00C9\u008Fj\u00EB\u00E2D\u009B^\u00C3#\x16\u00C9\u00F4\u009E\x1E\x0Be\u00AE\u0089k[F\u00A9=_H\u0095\x1F\u0086\x07\u00A0\u00EF\u00E44S_\x1E\x01\u00C7\u00D2fx\x18\u00B7g\u008C\u00A2\u008A*\u00F6\u00DFXiD\u00FA\u00CF\u00CC1:\x18&6\u00B4\x01(M\u00CB\u00EFa\u00ED\u00C6\x03\x1C\u00BA\u00B5\u0086R\x1F\u0084;\u00E1\u00F9\u0095\u00AF4}(\u00CA\u0084\u0090\u00AB\u00BDd\u00C7Uf\u00C6}8\\o\u0088\x06g\u00D2\x00\u0086\u0081Vt\u00D1i\u00D4:j\x1B\u0099\u009D<k\u0094g\u00A7.s.\u00D2\u009D\u00F0\u00F1\x1By\u00A90=\x14\u0096\u00AF\u00E7\u00F7/\x0F\x0E\u00D7=\u00A2\u00C1Kr7-\u00FEe\x15\u00D0\u00A4\u00C9\x05%r\x1F\u00F0\u00E7\u00DC\u0086\u00EA\x0F\x02\t{D\u0089^D\x17\u00ADjZv\u0088\u00F9\u00B3\u00E2\u00BD\x12\u00E9B\x17\u00FE%u\u009E\u00E9%A\x1A\u0094H\u0099yF\u0090\u00E3\u00C4Ti\u00E5\x144\u00FF\x13\u00C0\u00BC\u009A\x13\x1EV\u00DEYF\"s\x14\u00EA\u00D0\u00C5@\x1E\x10\u00D2\u00D3\x07<Q\"\u00C9\u00D1\u00C86\x12\u00EA\u0086\x0E\u00E7\r 5\u00EF\x11\u00B6\u00EA#\x1B\u0084O)\u00F7\u00E6\r`\u00ED\u0095\u00EC#\x1B\u0084[)\u00E7?\n\u00D6^\u00C9>\u00B2A(g1K\u00DB\u008EK\u0093\u00EA\u0095\u00EC\u00C3\u00FA*W\u00D7D\u00AE\u00AB\u00FCo$\u00BD\x02Z]z\x0B\u00FBo\u00A0)\x1B\u00C2\u0094\ra\u00CA\u00860\u00B5\u00FC\x10\u00C0\x1F\u00C1c-8\u00DA\x1D\u00C2\u00CF\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      rollover: new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02\u00AEIDATX\u0085\u00ED\u0097_HSQ\x1C\u00C7?\u00B7?lT\u008CY\u009A\t\u0091\u00B9^4\x04\u0087E\x1A\x14\u00CC\u0097\u00E8\x1F\x14\x04\u00BD\u00F8\u00E0 \u00B0\u0082J\t_/\u0099#\u00E8)*\u0082,\u00C8\u00F4\u00C1\u00A7\x10\f\u00B2\u00A4\u0097\u0084z\u00A8\u0088\u00B5Q\u00E0C`3\u00A4U&MM\u009B\u0096\u009D8\u00D7\u00DDy\u00B6\u00DD9k\x0F\u00F6p\u00BFp\u00E1\u009C\u00DF\u00FD\u009D\u00EF\u00F9\u00EC\u00FC\u00BD\u00D3\u0084\x10,\u00B7V,;\u0081\r\u00A1\u00C8\u00860eC\u0098\u00B2!L\u00FD\x17\x10\u00AB,\u00A3\x01m+ \u009F\x18\u00BA\b-\u00EA\x10\u00D0\u00DC\u00807Q\x0B\u00A1\u008BX\u008E|\u0099+\u00DBD\u00D0ED\u00862\u00EF\u008E\u009B\x15\u00ED8\x0B\x1A\u00F0\u00ECs\x12}\u00F5\u0093\u0089\u0091\u00974\u0086\u00F6X\x1A\u00DE\u00A9\u00D9Kl\u00E8!\u0095\u00F5\u00EB\u008C\u00FA\u00DB\u00EE\u00EF\u00B8=\x079\u00F1\u00E2\u00A9e\u00FEm\u00EF3\\\u009BwQ\u00B2s5C\u008F\u00E3\u00C4\u00BFuqz\u00F0\x14\x12\"\u00F9\u00B4\u00E1\x15\x1D\u00BB\x7F\bU\u00FDMB\u00B4W\u00B6\u00A4\u00E5\u00B9E\x1B~q\u00BDl\\D_/$\u00CB\u00B2\u008C\u00C9w2Gm#=\u00A4\u0097*\u00D9W\x1B\u00DE\u00D4\u00E9(\u00A9\u00AE\u00A7\u00BA\u00D1\u0099\x12+?\n\u00EF\x1E\u00B4\x10\u00D0\x0E\x03\u00CE\u00C44\x15\x1B\u00EF\x1C.\u00D8\u00E4]\u00C8\u0095e\u0087\u00CB\x05\u00DC5\u009E\u0080\u00F6\u00D9\x18v\u0088S\u00B0\u00AD\u00DC\u00F0R\u00B5\u00FD\u00B8\u0093\u00B9\u0099\u00FA\u00D4\u0085\x19\r\u00F6\u00F1)m\t\u00C4\"\u00E0t\u00F7\x03\u00BD@M\x12@jb\x04\u00E2\u00CA\x12\u0090\u00E5\u00C9\u008Fj\u00EB\u00E2D\u009B^\u00C3#\x16\u00C9\u00F4\u009E\x1E\x0Be\u00AE\u0089k[F\u00A9=_H\u0095\x1F\u0086\x07\u00A0\u00EF\u00E44S_\x1E\x01\u00C7\u00D2fx\x18\u00B7g\u008C\u00A2\u008A*\u00F6\u00DFXiD\u00FA\u00CF\u00CC1:\x18&6\u00B4\x01(M\u00CB\u00EFa\u00ED\u00C6\x03\x1C\u00BA\u00B5\u0086R\x1F\u0084;\u00E1\u00F9\u0095\u00AF4}(\u00CA\u0084\u0090\u00AB\u00BDd\u00C7Uf\u00C6}8\\o\u0088\x06g\u00D2\x00\u0086\u0081Vt\u00D1i\u00D4:j\x1B\u0099\u009D<k\u0094g\u00A7.s.\u00D2\u009D\u00F0\u00F1\x1By\u00A90=\x14\u0096\u00AF\u00E7\u00F7/\x0F\x0E\u00D7=\u00A2\u00C1Kr7-\u00FEe\x15\u00D0\u00A4\u00C9\x05%r\x1F\u00F0\u00E7\u00DC\u0086\u00EA\x0F\x02\t{D\u0089^D\x17\u00ADjZv\u0088\u00F9\u00B3\u00E2\u00BD\x12\u00E9B\x17\u00FE%u\u009E\u00E9%A\x1A\u0094H\u0099yF\u0090\u00E3\u00C4Ti\u00E5\x144\u00FF\x13\u00C0\u00BC\u009A\x13\x1EV\u00DEYF\"s\x14\u00EA\u00D0\u00C5@\x1E\x10\u00D2\u00D3\x07<Q\"\u00C9\u00D1\u00C86\x12\u00EA\u0086\x0E\u00E7\r 5\u00EF\x11\u00B6\u00EA#\x1B\u0084O)\u00F7\u00E6\r`\u00ED\u0095\u00EC#\x1B\u0084[)\u00E7?\n\u00D6^\u00C9>\u00B2A(g1K\u00DB\u008EK\u0093\u00EA\u0095\u00EC\u00C3\u00FA*W\u00D7D\u00AE\u00AB\u00FCo$\u00BD\x02Z]z\x0B\u00FBo\u00A0)\x1B\u00C2\u0094\ra\u00CA\u00860\u00B5\u00FC\x10\u00C0\x1F\u00C1c-8\u00DA\x1D\u00C2\u00CF\x00\x00\x00\x00IEND\u00AEB`\u0082")
    },
    CORNER_ICNS_RAW = {
      normal:   new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x01NIDATX\u0085\u00ED\u00D71J\x03Q\x10\u00C6\u00F1\u00FF\u0086\x146\u0092\u0090J\u00B0\x16\u00C1*\u00E4\x04\u00A2\x17\u00F0\b\x1B\x0B\x1B\u00CF\u0090f-\x15;A\x10\u008CG\u00C8\r\u00B4\u00B3\x12\u0082\u0085\u008D\u00856\x166\u0091`a#\x19\u0099\u00CD>\u00DC\u0085\u0098\u009D\u00DD'\u00A4y\x1F\u00840\u0093\u00DD\u00C9\u008F0\u00C9#\u0091\u0088\u00B0\u00EA4V.\b\u0088\\\x02\u00C2% \\\x02\u00C2\u00A5\u00F9/SN\u00A2.\u009D\u00ADk\u0090\x0ED\x13&\u00CF\u0087\fdl\u00BE_\x7F\u00B6\u00BD\x1E\tm9\u00DF\u00F8\u0092\u00D7[I\u00A3\u00CFZk\u00DF8\u00DB\x1Fq\u00D5;\u0095\u00F1P\n\u00D1Z\u00FB\u00C6\x19\u00FE;1\u00FB\u00DEf\u00AD]\u00ECi\u00AD}c\u00FC\x10\u00BA\x0B\u00EF\u008F{\u00DC\u009F\x15\u00FBZ\x7F\u00BC\u00EC\u00A7\u00AF\x1BR\u00FF(\u009F\u00BF\u00C1\x1D\u00D0b}\x13d\x06\u00BD#x\u00B8\u0084F\x13>\u00DF\u00F4\u00AA)\u00B0[\u00B6\u00A4\u00F5\x10y\u00C0o\u008E\u0081'`\x07\u00B8\u00C8\u00F5K!\u00D5\x11\u008B\x01}\x06r\u0093\u00BB&\x06\u0086VH\u00B5\u009D\u00B0\x004\u00F3\u00BA\u009F\u00EB\u00B4\u00D2\u00FB\u00FE\u00D8\x11;\u00C2\n\u00A8\x01\u00B1!\u00AA\x02*B\u00CA\x11u\x01\x15 \u00CB\x11\u00BE\x00#\u00A4\u00EC\u0093\x18y\x03\u0096CF\x16\u00C4A\u00F6\u00F5\u00F2\x03,\u0086L\u00B3\u00F9\u0086\x03,\u00A1+\t\u00B1\u00F7AW\u009C\x19\u00A7s\u00B3:\u00FC\x03s\t\b\u0097\u0080p\t\b\u0097\u0080H\x03\u00FC\x00l\t\u0098\u00FF\x1D\u00DA\u008E\u00B1\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      disabled: new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x01bIDATX\u0085\u00ED\u00D7\u00B1j\u0083@\x18\x07\u00F0\x7F\u00A5Cq\u00B0\u00D2A\u00E8\u00E2h\u00A1S^@(\u00ED\x0B\u00D47H\n\u009EC\x1F\u00A1\u00CF\u0091\u00E1\x10\u00DA>Bv\u0097\u00E0\x13t\u00EA\u00E0,\x14\x14\u008Aq\u00EA\u00A4\u00E5\x13\x0F\u00CC\u0090xz\u00A5Y\u00EE\x0F\x12\u00EE\u00CB\u00F9\u00F9\u00C3|\x11<k\u00DB\x16\u00A7\u008Eqr\u0081F\f\u00A2\x11\"\x1A!\u00A2\x11\"\u00E7\x7F\u00D1$\u008A\u00A2\u0085\u00E38\u00AF\x00\u00AE\x00|\x17E\u00F1\u00C49\u00FF\u0090=_\u00F9\u00B1\x1DE\u0091mY\u00D6W\x18\u0086\x17\u009E\u00E7!\u00CB2\u00C4q\u00FCS\u00D7\u00F55\u00E7\u00BC\u0092\u00E9\u00A1\u00FCs\u00B8\u00AE\u00FB\x12\x04A\x07\u00A0\u00D0'\u00AD\u00A9.\u00DBC\x19\u00D14\u00CD\u008Di\u009A{5ZS\u00FD_\x104\x0By\u009E\u00DF'I\u00B2W\u00A7uY\u0096\x0F\u00F4\u00BDL\u009F\u00D93\u00D1_`\x0B\u00E0\u00D2\u00B6mP\x1F\u00DF\u00F7\u0091\u00A6)\f\u00C3@Uu\u00E3\u00B0\x03p76\u00A4\u00B3\x10C\u00C0\u00A0\u00FC\f\u00E0\x13\u00C0-\u0080\u00F5\u00A0>\n\u0099\u008C8\x00Xq\u00CE\u00DF\x07{\u0096\x00\u00DEd!\u0093fB\x06@\u00E9\u00D7\u00ABA\u0089\u00F6o\x0F\u00CD\u00884B\x160\x07\"\u0085\u0098\n\u0098\n\x19E\u00CC\x05L\u0081\x1CE\u00A8\x02d!cwb\u00A3\n\x18\u0081ld\x10\u008F\u00FD\u00DFK\tp\x00\u00B2\u00EB\u00FB\u00A3{\u00D2\x1D;\x18c\x0B\u00C6\u00D8rl\u00DF\u0094\u0083\u00FAQ_q\u008E~\x03\x13\u00D1\b\x11\u008D\x10\u00D1\b\x11\u008D\u00E8\x02\u00E0\x17\u00C3'\x02!\u00E0\x11\u00BBV\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      pressed:  new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x01NIDATX\u0085\u00ED\u00D71J\x03Q\x10\u00C6\u00F1\u00FF\u0086\x146\u0092\u0090J\u00B0\x16\u00C1*\u00E4\x04\u00A2\x17\u00F0\b\x1B\x0B\x1B\u00CF\u0090f-\x15;A\x10\u008CG\u00C8\r\u00B4\u00B3\x12\u0082\u0085\u008D\u00856\x166\u0091`a#\x19\u0099\u00CD>\u00DC\u0085\u0098\u009D\u00DD'\u00A4y\x1F\u00840\u0093\u00DD\u00C9\u008F0\u00C9#\u0091\u0088\u00B0\u00EA4V.\b\u0088\\\x02\u00C2% \\\x02\u00C2\u00A5\u00F9/SN\u00A2.\u009D\u00ADk\u0090\x0ED\x13&\u00CF\u0087\fdl\u00BE_\x7F\u00B6\u00BD\x1E\tm9\u00DF\u00F8\u0092\u00D7[I\u00A3\u00CFZk\u00DF8\u00DB\x1Fq\u00D5;\u0095\u00F1P\n\u00D1Z\u00FB\u00C6\x19\u00FE;1\u00FB\u00DEf\u00AD]\u00ECi\u00AD}c\u00FC\x10\u00BA\x0B\u00EF\u008F{\u00DC\u009F\x15\u00FBZ\x7F\u00BC\u00EC\u00A7\u00AF\x1BR\u00FF(\u009F\u00BF\u00C1\x1D\u00D0b}\x13d\x06\u00BD#x\u00B8\u0084F\x13>\u00DF\u00F4\u00AA)\u00B0[\u00B6\u00A4\u00F5\x10y\u00C0o\u008E\u0081'`\x07\u00B8\u00C8\u00F5K!\u00D5\x11\u008B\x01}\x06r\u0093\u00BB&\x06\u0086VH\u00B5\u009D\u00B0\x004\u00F3\u00BA\u009F\u00EB\u00B4\u00D2\u00FB\u00FE\u00D8\x11;\u00C2\n\u00A8\x01\u00B1!\u00AA\x02*B\u00CA\x11u\x01\x15 \u00CB\x11\u00BE\x00#\u00A4\u00EC\u0093\x18y\x03\u0096CF\x16\u00C4A\u00F6\u00F5\u00F2\x03,\u0086L\u00B3\u00F9\u0086\x03,\u00A1+\t\u00B1\u00F7AW\u009C\x19\u00A7s\u00B3:\u00FC\x03s\t\b\u0097\u0080p\t\b\u0097\u0080H\x03\u00FC\x00l\t\u0098\u00FF\x1D\u00DA\u008E\u00B1\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      rollover: new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x01NIDATX\u0085\u00ED\u00D71J\x03Q\x10\u00C6\u00F1\u00FF\u0086\x146\u0092\u0090J\u00B0\x16\u00C1*\u00E4\x04\u00A2\x17\u00F0\b\x1B\x0B\x1B\u00CF\u0090f-\x15;A\x10\u008CG\u00C8\r\u00B4\u00B3\x12\u0082\u0085\u008D\u00856\x166\u0091`a#\x19\u0099\u00CD>\u00DC\u0085\u0098\u009D\u00DD'\u00A4y\x1F\u00840\u0093\u00DD\u00C9\u008F0\u00C9#\u0091\u0088\u00B0\u00EA4V.\b\u0088\\\x02\u00C2% \\\x02\u00C2\u00A5\u00F9/SN\u00A2.\u009D\u00ADk\u0090\x0ED\x13&\u00CF\u0087\fdl\u00BE_\x7F\u00B6\u00BD\x1E\tm9\u00DF\u00F8\u0092\u00D7[I\u00A3\u00CFZk\u00DF8\u00DB\x1Fq\u00D5;\u0095\u00F1P\n\u00D1Z\u00FB\u00C6\x19\u00FE;1\u00FB\u00DEf\u00AD]\u00ECi\u00AD}c\u00FC\x10\u00BA\x0B\u00EF\u008F{\u00DC\u009F\x15\u00FBZ\x7F\u00BC\u00EC\u00A7\u00AF\x1BR\u00FF(\u009F\u00BF\u00C1\x1D\u00D0b}\x13d\x06\u00BD#x\u00B8\u0084F\x13>\u00DF\u00F4\u00AA)\u00B0[\u00B6\u00A4\u00F5\x10y\u00C0o\u008E\u0081'`\x07\u00B8\u00C8\u00F5K!\u00D5\x11\u008B\x01}\x06r\u0093\u00BB&\x06\u0086VH\u00B5\u009D\u00B0\x004\u00F3\u00BA\u009F\u00EB\u00B4\u00D2\u00FB\u00FE\u00D8\x11;\u00C2\n\u00A8\x01\u00B1!\u00AA\x02*B\u00CA\x11u\x01\x15 \u00CB\x11\u00BE\x00#\u00A4\u00EC\u0093\x18y\x03\u0096CF\x16\u00C4A\u00F6\u00F5\u00F2\x03,\u0086L\u00B3\u00F9\u0086\x03,\u00A1+\t\u00B1\u00F7AW\u009C\x19\u00A7s\u00B3:\u00FC\x03s\t\b\u0097\u0080p\t\b\u0097\u0080H\x03\u00FC\x00l\t\u0098\u00FF\x1D\u00DA\u008E\u00B1\x00\x00\x00\x00IEND\u00AEB`\u0082")
    },
    BROKEN_ICNS_RAW = {
      normal:   new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02IIDATX\u0085\u00EDW\u00BFO\x14A\x18}sR\x001\u00E1\x14-\u00AC8b\x026\u00863\u00C6J\x12\u008E\u00F8\x07@hi\u00AE\u00B1UCE\u00B3\u00F1p\x1A+sj\u00AC,\u00BC\u0086\x16\u00AE\u00B23z\u0089\u009D1@GB\u00C1u\x14p\b\u00CD\x1E\u0089rc\u00BE\u0099\u009B\u00BDqng\x7F\x1C\u00C5Y\u00ECK6\u0099\u00F9\u00BEo\u00DE\u00BE\u00F9\u00E6\u00ED\u00DE\x1E\x13B`\u00D8\u00C8\r]A&\u00C2@&B\u00E3\u00BF\x101\x12\u0099\u00E5\u00AC\u0080;\x0F+r|\u00F4\u00B3\x02O4\x07\u00BAK\x1C\x0F\u00BD'B\u00AF\u00B7S\u00AB\u00E2\u00C3\u00AC/\u00F6\u00B7\u0085\u00BChL1W\u00FD\x15x\u00A2\x16\u00B7D\u00FB\u0097\b@c\u008A\u00A5\x17\x11\u00CB\u00E3\u00F6\u00C4\u00F8d\x0E\u00A3\u00F9\u00DE\u009C\u00C6\x14K\u008B\x04<nR\u00BF\u00D5\u00C1\u00C5YoNc\u00FF\u00E4:8+\u00A5\u00F0BI\u00AE\u00E9\u00E3iu\u00CC2\u00F7o\u00C7\u00BB\u00C2*FF?\u00E2\u00C9\u00EB19\u00FF\u00B2\u00DEF\u00FB\u00F4\r\u00FC\u00E3\u00F9n\x05\x19m\x17\u00B7\u00EEm\u00A1s\u00F9Hm\u00E9\u00DA\x0F\u009C\u00EC\u00AF\x00(v\u00F3\u00C0\u00F8\u00ED\u00EF\x18\u00BB\u00B9\u00F6\x0F\u00CF\u009F\u008B\u00A7x\u00D6\u00DC\u008C\x17\u0081\bW\u00ABnT0Q\u0098\u00C3\u00C2\u00CB<\u00E6\u00CA\u00AA~\u00AF\x0646\u00CEp\u00DE\u00DC\u0093yO|\u008B\u00E4\u00D1Hm4}\u00BDBI\u00BC\u00BF{)lP\u008Cr)\u00B8\u00D2\x1B\u008D\u00B3\"8\u00A3\x1D~ux*'s\u009C\u00D5e\x07\x12 \u00B9\b\u00CE\u00F2\u00E0\u00AC\n`\x07\u00C0\u0082\u008Cu~\u00AB#\u00D0\u00A01\u00C5\x14\u0096\x00\x1C\u0082\u00B3J\x1Cu\u00B2\u008F\x1A\u00DA=P\x070ee>cr\u00E6\x06\u0084\u00B8\u00DF\u009D\x1F\u00E0\u00F4\u00C0\x07\u00F0\u00D8\u00AA#\u008F\u0094\u00E1\u0089\u00DD\u00C1DpF\u00AE\u00FB\x14B\u00FA\"0^\u00FF\x1A2n\u00CD\x12}\x0E`9lM\u00DC\u00D3\u00B1\f`\u00DB\u008An\u00C0\x13\u00B1-\u0096\u00C7\u00A7\x1E\u00D3\u00E7V\u00E6\u0081\u00DD\x11\u00B7\be**\u009E0vRr\u00B54f#5\u008B\u00A7h>\u00A6Q\u00C6\u00B4\x17\u00A6\x17@\u00F0D]\u00AEU\x1C\u00E8rV\u00CD\u0092\u00F0N(#\u00EE\x18\u0091E\u00E7\u00F9'E\u00FF\u00D1N\u00EBn\u00B8:Q6\u00C6\u008D+\x0B@\u00D0\u0091F\u00D8=\\\"\u008A\u00C6\u00B8\u00EA\u00A8\x19\x04&W\u00F0C\u00E8\x12a\u00BE\u00E9\u00D2\u00FB\u00C0\r\u0093+\u00B8\u0087\u00EB\u00F3\u00AEw\x1C\u0083~\u00D2\u0085\u0081\u00B88[\u00B43\u00D9\u00DF@\u008DL\u0084F&B#\x13\u00A11|\x11\x00\u00FE\x02\u00BBf\u00F1\u00FER\\>\u008B\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      disabled: new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02MIDATX\u0085\u00EDW\u00BF\u008F\x12A\x18}\x12\x1A\x17\u0089g(\u00A0\u00E3\u00FC\x03\u008CX\u00D8\u00A0\u0089\u00D0\u0093x\u00A1\u00B5\u00A1\u0091\u00AF\u00F4b\x074\u00D8P\x1A\u00DA\u0089\u0085\u00D7\u00D8\u00A2&\u00C4V/\u00B9\u00D0X\u00DCY[(\x1D!!\u00D1\u00C0\u00AE\r\u00B0\u00E6#3\u00EBd\u00B3\u00B3?\u00B8\x02\u008B}\u00C9&\u00DF\u00CC|\u00F3\u00E6\u00ED7of\u00E1\u0086\u00EB\u00BA842\x07W\u0090\u008A\u00D0\u0090\u008AP\u00F8/Dd\u00C3\x06\u0089\u00E8\u00B8\\.\u00F79\u009EN\u00A7}!\u00C4\u00CF}\x16\u0089\u00E21\u00DE\x13\u00DDn\u00F7Y6\u009B}\u00D3l6or{4\x1A\u00FDY\u00AF\u00D7\u00CF\x07\u0083\u00C1\u00BB$\x02b\u00F1\u00B0\u0088\u00A0\u00A7\u00D3\u00E9,l\u00DBv\x158\u00E6>S\u00FEux\u008C\u009E\u00C8\u00E5r\x19\u00CB\u00B2\u00BC6\u00C7\u00DC\u0097\u00A4\nqy\u008C\u00A4\u00B6mo\x1D\u00C7\u00F1\u00DA\x1C\u00AFV\u00AB[DT\u008B+\u0080sy\u008E\u009F\u0087\u00B9\u00F5\u00BCD\u009Ep\x1C\u00E7\u00F5r\u00B9|,S\u00D8hW\u00A5Ri\u00B4\u00DDn\x1F\u00EE\u00DE(\u0093\u00F9:\u009B\u00CD\u009A\x00*r\x1C\u00F9|\u00FE\u00C2\u00B2\u00AC\u0097a\u009E\b\u00FD\u0080\u0099\\-\u00AB\u00D1/\x14\n\u00F7\x1B\u008D\u00C6Q\u00B5Z\u00DD\u00E5O&\x13\u008C\u00C7\u00E3_\u008B\u00C5\u00E2\x1B\u008F\x0B!\u00BE\u0084\u00F1xHj4\u00F5\u00B4\u00DB\u00EDZ\u00AF\u00D7\u00DB\u00B8>p\x1F\u008F%\u00E1\n\u00BD'\f\u00D5\u00E1R\x0F\x01<1\u00A4\u00B0\u00CF>\x13\u00D1G\x00\u00A7q\u00EE\u0096\u00D8n'\u00A2#\"\u00E2\u00C5/\u0095\u0080\u00CDf\u00B3\u00DB\x02\x05\u008E\u00B9O\u00E2)\u0080\x1FD\u00D4\u008F\u00E2\u008E\u00F5\u00A3F\u00BE\u00FD\x07\x00e\u00DF\u00D0\u00A7b\u00B1x\u00C7u\u00DD{\u00B2\u00FD}>\u009F\u00F3Qx\u00E4\u00CBc\u008F\u00B4\u0084\x10W{\u0089 \u00A2\x16\u0080\u00B7\x01\u00A4\u00A7\u00CAx\x01s\u00D8\u00B8g>\u00D1\u00BF\x01\u009C\x04\u00CD\u0089:\x1D'\x00\u00DE\u00FB\u00BA_\t!\"K\u00CC\u00DB'\u008F\u00E9\x0B\u00DF\u00D0\x03\x7FE\u008C\"\u00F8X\u00F1=\x00\u00E0\u00B6\u00F6&5SI#^\u00E4\u00CC\u00C7S\u00D1\r\x1BfL\u00FF\u00C4\u00C4\x02\x18B\b\u00F6RMr@r\x0E\u00F5\u009C\u00C0JH#^j]u\u00D3\u00FE\u00C7E\u00C0\u00D6\u00DEU\u00D50U\u00A2\u00A5\u00C5\u00E7\u00D7\x15\u0080\x7F\x159\x0FZ\u00C3$\u00A2\u00A2\u00C5CC\u00CE>\u00D0\u00B9\u00BC\x0F\u00A1I\u00C4\u00B1\x16'\u00F6A\bt.o\u008D\u00B0\u00ED\u00A8K/\u00EC\u00F5\u0093.\b\u0092\u00AB.\x1Fo;\u00D2\u00BF\u0081\n\u00A9\b\u0085T\u0084B*B\u00E1\u00F0\"\x00\u00FC\x05\u00C3y\u00DE9\u0083\u00DD$\u00D7\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      pressed:  new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02IIDATX\u0085\u00EDW\u00BFO\x14A\x18}sR\x001\u00E1\x14-\u00AC8b\x026\u00863\u00C6J\x12\u008E\u00F8\x07@hi\u00AE\u00B1UCE\u00B3\u00F1p\x1A+sj\u00AC,\u00BC\u0086\x16\u00AE\u00B23z\u0089\u009D1@GB\u00C1u\x14p\b\u00CD\x1E\u0089rc\u00BE\u0099\u009B\u00BDqng\x7F\x1C\u00C5Y\u00ECK6\u0099\u00F9\u00BEo\u00DE\u00BE\u00F9\u00E6\u00ED\u00DE\x1E\x13B`\u00D8\u00C8\r]A&\u00C2@&B\u00E3\u00BF\x101\x12\u0099\u00E5\u00AC\u0080;\x0F+r|\u00F4\u00B3\x02O4\x07\u00BAK\x1C\x0F\u00BD'B\u00AF\u00B7S\u00AB\u00E2\u00C3\u00AC/\u00F6\u00B7\u0085\u00BChL1W\u00FD\x15x\u00A2\x16\u00B7D\u00FB\u0097\b@c\u008A\u00A5\x17\x11\u00CB\u00E3\u00F6\u00C4\u00F8d\x0E\u00A3\u00F9\u00DE\u009C\u00C6\x14K\u008B\x04<nR\u00BF\u00D5\u00C1\u00C5YoNc\u00FF\u00E4:8+\u00A5\u00F0BI\u00AE\u00E9\u00E3iu\u00CC2\u00F7o\u00C7\u00BB\u00C2*FF?\u00E2\u00C9\u00EB19\u00FF\u00B2\u00DEF\u00FB\u00F4\r\u00FC\u00E3\u00F9n\x05\x19m\x17\u00B7\u00EEm\u00A1s\u00F9Hm\u00E9\u00DA\x0F\u009C\u00EC\u00AF\x00(v\u00F3\u00C0\u00F8\u00ED\u00EF\x18\u00BB\u00B9\u00F6\x0F\u00CF\u009F\u008B\u00A7x\u00D6\u00DC\u008C\x17\u0081\bW\u00ABnT0Q\u0098\u00C3\u00C2\u00CB<\u00E6\u00CA\u00AA~\u00AF\x0646\u00CEp\u00DE\u00DC\u0093yO|\u008B\u00E4\u00D1Hm4}\u00BDBI\u00BC\u00BF{)lP\u008Cr)\u00B8\u00D2\x1B\u008D\u00B3\"8\u00A3\x1D~ux*'s\u009C\u00D5e\x07\x12 \u00B9\b\u00CE\u00F2\u00E0\u00AC\n`\x07\u00C0\u0082\u008Cu~\u00AB#\u00D0\u00A01\u00C5\x14\u0096\x00\x1C\u0082\u00B3J\x1Cu\u00B2\u008F\x1A\u00DA=P\x070ee>cr\u00E6\x06\u0084\u00B8\u00DF\u009D\x1F\u00E0\u00F4\u00C0\x07\u00F0\u00D8\u00AA#\u008F\u0094\u00E1\u0089\u00DD\u00C1DpF\u00AE\u00FB\x14B\u00FA\"0^\u00FF\x1A2n\u00CD\x12}\x0E`9lM\u00DC\u00D3\u00B1\f`\u00DB\u008An\u00C0\x13\u00B1-\u0096\u00C7\u00A7\x1E\u00D3\u00E7V\u00E6\u0081\u00DD\x11\u00B7\be**\u009E0vRr\u00B54f#5\u008B\u00A7h>\u00A6Q\u00C6\u00B4\x17\u00A6\x17@\u00F0D]\u00AEU\x1C\u00E8rV\u00CD\u0092\u00F0N(#\u00EE\x18\u0091E\u00E7\u00F9'E\u00FF\u00D1N\u00EBn\u00B8:Q6\u00C6\u008D+\x0B@\u00D0\u0091F\u00D8=\\\"\u008A\u00C6\u00B8\u00EA\u00A8\x19\x04&W\u00F0C\u00E8\x12a\u00BE\u00E9\u00D2\u00FB\u00C0\r\u0093+\u00B8\u0087\u00EB\u00F3\u00AEw\x1C\u0083~\u00D2\u0085\u0081\u00B88[\u00B43\u00D9\u00DF@\u008DL\u0084F&B#\x13\u00A11|\x11\x00\u00FE\x02\u00BBf\u00F1\u00FER\\>\u008B\x00\x00\x00\x00IEND\u00AEB`\u0082"),
      rollover: new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00!\x00\x00\x00$\b\x06\x00\x00\x00\x07)S\u00DC\x00\x00\x00\tpHYs\x00\x00\x10\u009B\x00\x00\x10\u009B\x01t\u0089\u009CK\x00\x00\x02IIDATX\u0085\u00EDW\u00BFO\x14A\x18}sR\x001\u00E1\x14-\u00AC8b\x026\u00863\u00C6J\x12\u008E\u00F8\x07@hi\u00AE\u00B1UCE\u00B3\u00F1p\x1A+sj\u00AC,\u00BC\u0086\x16\u00AE\u00B23z\u0089\u009D1@GB\u00C1u\x14p\b\u00CD\x1E\u0089rc\u00BE\u0099\u009B\u00BDqng\x7F\x1C\u00C5Y\u00ECK6\u0099\u00F9\u00BEo\u00DE\u00BE\u00F9\u00E6\u00ED\u00DE\x1E\x13B`\u00D8\u00C8\r]A&\u00C2@&B\u00E3\u00BF\x101\x12\u0099\u00E5\u00AC\u0080;\x0F+r|\u00F4\u00B3\x02O4\x07\u00BAK\x1C\x0F\u00BD'B\u00AF\u00B7S\u00AB\u00E2\u00C3\u00AC/\u00F6\u00B7\u0085\u00BChL1W\u00FD\x15x\u00A2\x16\u00B7D\u00FB\u0097\b@c\u008A\u00A5\x17\x11\u00CB\u00E3\u00F6\u00C4\u00F8d\x0E\u00A3\u00F9\u00DE\u009C\u00C6\x14K\u008B\x04<nR\u00BF\u00D5\u00C1\u00C5YoNc\u00FF\u00E4:8+\u00A5\u00F0BI\u00AE\u00E9\u00E3iu\u00CC2\u00F7o\u00C7\u00BB\u00C2*FF?\u00E2\u00C9\u00EB19\u00FF\u00B2\u00DEF\u00FB\u00F4\r\u00FC\u00E3\u00F9n\x05\x19m\x17\u00B7\u00EEm\u00A1s\u00F9Hm\u00E9\u00DA\x0F\u009C\u00EC\u00AF\x00(v\u00F3\u00C0\u00F8\u00ED\u00EF\x18\u00BB\u00B9\u00F6\x0F\u00CF\u009F\u008B\u00A7x\u00D6\u00DC\u008C\x17\u0081\bW\u00ABnT0Q\u0098\u00C3\u00C2\u00CB<\u00E6\u00CA\u00AA~\u00AF\x0646\u00CEp\u00DE\u00DC\u0093yO|\u008B\u00E4\u00D1Hm4}\u00BDBI\u00BC\u00BF{)lP\u008Cr)\u00B8\u00D2\x1B\u008D\u00B3\"8\u00A3\x1D~ux*'s\u009C\u00D5e\x07\x12 \u00B9\b\u00CE\u00F2\u00E0\u00AC\n`\x07\u00C0\u0082\u008Cu~\u00AB#\u00D0\u00A01\u00C5\x14\u0096\x00\x1C\u0082\u00B3J\x1Cu\u00B2\u008F\x1A\u00DA=P\x070ee>cr\u00E6\x06\u0084\u00B8\u00DF\u009D\x1F\u00E0\u00F4\u00C0\x07\u00F0\u00D8\u00AA#\u008F\u0094\u00E1\u0089\u00DD\u00C1DpF\u00AE\u00FB\x14B\u00FA\"0^\u00FF\x1A2n\u00CD\x12}\x0E`9lM\u00DC\u00D3\u00B1\f`\u00DB\u008An\u00C0\x13\u00B1-\u0096\u00C7\u00A7\x1E\u00D3\u00E7V\u00E6\u0081\u00DD\x11\u00B7\be**\u009E0vRr\u00B54f#5\u008B\u00A7h>\u00A6Q\u00C6\u00B4\x17\u00A6\x17@\u00F0D]\u00AEU\x1C\u00E8rV\u00CD\u0092\u00F0N(#\u00EE\x18\u0091E\u00E7\u00F9'E\u00FF\u00D1N\u00EBn\u00B8:Q6\u00C6\u008D+\x0B@\u00D0\u0091F\u00D8=\\\"\u008A\u00C6\u00B8\u00EA\u00A8\x19\x04&W\u00F0C\u00E8\x12a\u00BE\u00E9\u00D2\u00FB\u00C0\r\u0093+\u00B8\u0087\u00EB\u00F3\u00AEw\x1C\u0083~\u00D2\u0085\u0081\u00B88[\u00B43\u00D9\u00DF@\u008DL\u0084F&B#\x13\u00A11|\x11\x00\u00FE\x02\u00BBf\u00F1\u00FER\\>\u008B\x00\x00\x00\x00IEND\u00AEB`\u0082")
    };

// Degrees for broken handles
var MIN_ANGLE = 0,
    MAX_ANGLE = 15;

// Create icons files on disk
createIcons('SMOOTH_ICNS', SMOOTH_ICNS_RAW);
createIcons('CORNER_ICNS', CORNER_ICNS_RAW);
createIcons('BROKEN_ICNS', BROKEN_ICNS_RAW);

// Get icons files for GUI from disk
var SMOOTH_ICNS_PNG = getIcons('SMOOTH_ICNS'),
    CORNER_ICNS_PNG = getIcons('CORNER_ICNS'),
    BROKEN_ICNS_PNG = getIcons('BROKEN_ICNS');

// Main function
function main() {
  if (app.documents.length < 1 
      || !(selection instanceof Array)
      || selection.length < 1) {
    return;
  }

  var selPaths = [];
  var btnsState = [];

  getPaths(app.selection, selPaths);

  // DIALOG
  var dialog = new Window('dialog', SCRIPT_NAME + ' ' + SCRIPT_VERSION); 
      dialog.orientation = 'column'; 
      dialog.alignChildren = ['fill','center'];
      dialog.opacity = .9; // Range 0-1

  var smoothIcns = ScriptUI.newImage(SMOOTH_ICNS_PNG[0], SMOOTH_ICNS_PNG[1], SMOOTH_ICNS_PNG[2], SMOOTH_ICNS_PNG[3]),
      cornerIcns = ScriptUI.newImage(CORNER_ICNS_PNG[0], CORNER_ICNS_PNG[1], CORNER_ICNS_PNG[2], CORNER_ICNS_PNG[3]),
      brokenIcns = ScriptUI.newImage(BROKEN_ICNS_PNG[0], BROKEN_ICNS_PNG[1], BROKEN_ICNS_PNG[2], BROKEN_ICNS_PNG[3]);
  
  var buttons = dialog.add('group'); 
      buttons.orientation = 'column'; 
      buttons.alignChildren = ['fill','center']; 
  var smoothBtn = buttons.add('iconbutton', undefined, smoothIcns, {style:'button', toggle:true}); 
      smoothBtn.text = 'Smooth ';
      smoothBtn.helpTip = 'Select Smooth points\n(with handles).\nShortcut Alt + 1';
  var cornerBtn = buttons.add ('iconbutton', undefined, cornerIcns, {style:'button', toggle:true});
      cornerBtn.text = 'Corner ';
      cornerBtn.helpTip = 'Select Corner points (without\none or both handles).\nShortcut Alt + 2';
  var brokenBtn = buttons.add ('iconbutton', undefined, brokenIcns, {style:'button', toggle:true});
      brokenBtn.text = 'Broken ';
      brokenBtn.helpTip = 'Select Pseudo Smooth (Broken) points\n(with handles at the angle).\nShorcut Alt + 3';

  // TOLERANCE
  var tolerance = dialog.add('group'); 
      tolerance.orientation = 'row'; 
      tolerance.alignChildren = ['left','center']; 

  var toleranceTitle = tolerance.add('statictext', undefined, 'Angle Tolerance, \u00b0'); 

  var toleranceVal = tolerance.add('edittext', undefined, '3'); 
      toleranceVal.characters = 4;
      toleranceVal.helpTip = 'Tolerance angle in degrees\nbetween handles\nfor Broken points';
  
  var copyright = dialog.add('statictext', undefined, 'www.github.com/creold');
      copyright.justify = 'center';
      copyright.enabled = false;

  // EVENTS      
  toleranceVal.onChanging = function() {
    if (this.text == '') this.text = '0';
    if (convertToNum(this.text) < MIN_ANGLE) this.text = MIN_ANGLE;
    if (convertToNum(this.text) > MAX_ANGLE) this.text = MAX_ANGLE;

    if (isNaN(convertToNum(this.text))) {
      buttons.enabled = false; 
    } else {
      buttons.enabled = true;
    }
  }

  toleranceVal.addEventListener('keydown', function (e) {
    var step;
    ScriptUI.environment.keyboardState['shiftKey'] ? step = 10 : step = 1;
    if (e.keyName == 'Down') {
      if (Number(this.text) >= step) {
        this.text = Number(this.text) - step;
        e.preventDefault();
      } else {
        this.text = MIN_ANGLE;
      }
    }
    if (e.keyName == 'Up') {
      if (Number(this.text) <= MAX_ANGLE - step) {
        this.text = Number(this.text) + step;
        e.preventDefault();
      } else {
        this.text = MAX_ANGLE;
      }
    }
  });
  
  toleranceVal.onChange = function() {
    if (brokenBtn.value && brokenBtn.enabled) run();
  }

  toleranceVal.addEventListener('keydown', function(kd) {
    if (kd.altKey) kd.preventDefault();
  });

  dialog.addEventListener('keydown', function(kd) {
    if(kd.keyName === 'Enter'){
      if (brokenBtn.value && brokenBtn.enabled) run();
    }
    if (kd.altKey) {
      if (kd.keyName.match(/1/)) smoothBtn.notify();
      if (kd.keyName.match(/2/)) cornerBtn.notify();
      if (kd.keyName.match(/3/)) brokenBtn.notify();
    }
  });

  for (var i = 0; i < buttons.children.length; i++) {
    buttons.children[i].onClick = function () {
      run();
      // Reset button highlight hack
      var temp = dialog.add('checkbox', undefined, 'checkbox');
      temp.active = true;
      dialog.update();
      temp.remove();
      dialog.update();
    }
  }

  // Apply selection at event
  function run() {
    app.selection = null;
    btnsState = [smoothBtn.value, cornerBtn.value, brokenBtn.value];
    selectPoints(btnsState, selPaths, convertToNum(toleranceVal.text));
  }

  dialog.show();  
}

// Create icons files on disk
function createIcons(prefix, obj) {
  var outfile;
  var count = 0;
  for (var key in obj) {
    var filePath = ICNS_FOLDER + prefix + '_' + count + '.png';
    try {
      outfile = new File(filePath);
      outfile.encoding = 'binary';
      outfile.open ('w');
      outfile.write(obj[key]);
      outfile.close();
    } catch (err) {}
    count++;
  }
}

// Get icons files for GUI from disk
function getIcons(pattern) {
  var arr = [];
  var iconsFolder = Folder(ICNS_FOLDER);
  var icnsFiles = iconsFolder.getFiles(pattern + '_*.png');
  try {
    for (var i = 0; i < icnsFiles.length; i++) {
      if (icnsFiles[i].exists) arr.push(decodeURI(icnsFiles[i]));
    }
  } catch (err) {}
  return arr.sort(); // Sort by name
}

// Get paths from selection
function getPaths(item, arr) {
  for (var i = 0; i < item.length; i++) {
    var currItem = item[i];
    try {
      switch (currItem.typename) {
        case 'GroupItem':
          getPaths(currItem.pageItems, arr);
          break;
        case 'PathItem':
          arr.push(currItem);
          break;
        case 'CompoundPathItem':
          getPaths(currItem.pathItems, arr);
          break;
        default:
          currItem.selected = false;
          break;
      }
    } catch (e) {}
  }
}
 
// Set decimal separator symbol and convert to number
function convertToNum(str) {
  return +str.replace(',', '.');
}

function selectPoints(btnsVal, paths, tolerance) {
  for (var i = 0; i < paths.length; i++) {
    if (paths[i].pathPoints.length > 1) {
      var points = paths[i].pathPoints;
      for (var j = 0; j < points.length; j++) {
        var currPoint = points[j];
        var answer = checkPointType(currPoint, tolerance);
        
        if ((answer == 'smooth' && btnsVal[0]) ||
            (answer == 'corner' && btnsVal[1]) ||
            (answer == 'broken' && btnsVal[2])) {
          currPoint.selected = PathPointSelection.ANCHORPOINT;
        }
      }
    }
  }

  app.redraw();
};

function checkPointType(point, tolerance) {
  var x1, x2, x3, y1, y2, y3;
  with(point) {
    x1 = leftDirection[0];  // left handle
    x2 = anchor[0];         // point
    x3 = rightDirection[0]; // right handle
    y1 = leftDirection[1];  // left handle
    y2 = anchor[1];         // point
    y3 = rightDirection[1]; // right handle
  }

  // Cos of angle between vectors
  var first = (x1 - x2) * (x3 - x2) + (y1 - y2) * (y3 - y2);
  var second = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
  var third = Math.sqrt(Math.pow((x3 - x2), 2) + Math.pow((y3 - y2), 2));
  var result = first / (second * third);

  // Convert Degrees to Radians
  var radians = (180 - tolerance) * 0.0175;
  var cornerRadians = (180 - MAX_ANGLE) * 0.0175;

  // If cos of angle is -1, then angle is 180 degrees 
  if (point.pointType === PointType.SMOOTH && result.toFixed(1) == -1.0) return 'smooth';
  if (point.pointType === PointType.CORNER && result <= Math.cos(radians)) return 'broken';
  if (first == 0 || result > Math.cos(cornerRadians)) return 'corner';
}

// Run script
try {
  main();
} catch (e) {}