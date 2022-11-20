type ClassName = string | null | undefined | boolean

export const joinClassNames = (classnames: Array<ClassName>): string =>
  classnames
    .filter((item) => !!item)
    .join(' ')
    .replace(/ +/g, ' ')
    .trim()
