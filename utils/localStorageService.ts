export class LocalStorageService {
  private static addFavorite = (id: number) => {
    const favorites: number[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  private static removeFavorite = (id: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const index = favorites.indexOf(id);
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  static getFavorite = (id: number) => {
    return localStorage.getItem("favorites")?.includes(id.toString()) || false;
  };

  static toggleFavorite = (id: number) => {
    localStorage.getItem("favorites")?.includes(id.toString())
      ? this.removeFavorite(id)
      : this.addFavorite(id);
  };
}
