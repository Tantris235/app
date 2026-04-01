# Globalna Pogoda

Prosta aplikacja webowa do sprawdzania aktualnej pogody dla dowolnego miejsca na mapie świata.

## Podgląd strony na GitHub (GitHub Pages)
Repo ma workflow, który publikuje stronę na GitHub Pages po pushu.

Po włączeniu **Settings → Pages → Source: GitHub Actions**, strona będzie dostępna pod adresem:

`https://<twoj-login>.github.io/<nazwa-repozytorium>/`

> Uwaga: na stronie głównej repozytorium GitHub zawsze widać pliki. Widok aplikacji jest pod linkiem GitHub Pages powyżej.

## Funkcje
- Interaktywna mapa świata (Leaflet + OpenStreetMap).
- Kliknięcie na mapie pobiera bieżące warunki pogodowe z API Open-Meteo.
- Podgląd temperatury, temperatury odczuwalnej, prędkości wiatru i zachmurzenia.

## Uruchomienie lokalnie
Wystarczy otworzyć `index.html` w przeglądarce.

Możesz też uruchomić lokalny serwer:

```bash
python3 -m http.server 8080
```

Następnie przejdź do `http://localhost:8080`.
