/* Global variables (colors, typography, spacing, etc.) are defined in lib/themes */

/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
export default function generator ({ borders, colors, media, spacing, typography }) {
  return {
    fontFamily: typography.fontFamily,
    color: colors.licorice,

    padding: `${spacing.small} ${spacing.xSmall}`,
    paddingMedium: `${spacing.small}`,
    paddingLarge: `${spacing.small} ${spacing.medium}`,

    borderWidth: borders.widthSmall,
    borderColor: colors.tiara,
    bottomMarginPhoneUp: spacing.xSmall,

    buttonPadding: `${spacing.xSmall} 0`,
    buttonFontSize: typography.fontSizeMedium,
    buttonTextDecorationHover: 'underline',
    buttonColor: colors.brand,

    checkboxRightMarginPhoneUp: spacing.small,
    checkboxRightMarginWideUp: spacing.medium,

    badgeMargin: '0.0625rem',

    ...media
  };
}
