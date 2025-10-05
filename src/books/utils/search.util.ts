export class SearchUtil {
  static buildSearchRegex(query: string): RegExp | null {
    const normalized = query?.trim();
    if (!normalized) return null;
    return new RegExp(normalized, 'i');
  }
}
