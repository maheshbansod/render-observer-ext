export interface Config {
  borderColor: string;
  borderWidth: string;
  borderStyle: string;
  highlightDuration: number;
  zIndex: number;
  ignoredSelectors: string[];
}

export const DefaultConfig: Config = {
  borderColor: '#1E90FF',
  borderWidth: '2px',
  borderStyle: 'solid',
  highlightDuration: 500,
  zIndex: 999999,
  ignoredSelectors: [],
}; 

export function areConfigsEqual(a: Config, b: Config): boolean {
    return a.borderColor === b.borderColor &&
        a.borderWidth === b.borderWidth &&
        a.borderStyle === b.borderStyle &&
        a.highlightDuration === b.highlightDuration &&
        a.zIndex === b.zIndex &&
        a.ignoredSelectors.length === b.ignoredSelectors.length &&
        a.ignoredSelectors.every((selector, index) => selector === b.ignoredSelectors[index])
}