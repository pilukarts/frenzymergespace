# Frenzy Merge Space

Juego de fusión espacial del universo **Pilukarts**. Combina objetos iguales, desarrolla tecnología cada vez más avanzada y alcanza la **StarForge Ark**.

## Jugar

La demo no requiere instalación: abre `index.html` en un navegador o visita la versión publicada mediante GitHub Pages.

1. Selecciona un objeto.
2. Selecciona otro del mismo nivel para fusionarlos.
3. Usa **Desplegar objeto** para incorporar nueva materia.
4. Desbloquea los diez niveles del archivo estelar.

Cada 30 segundos ocurre una **fractura espacial**: el tablero adopta una geometría aleatoria y la materia cambia de posición sin perderse. Matriz, diamante, órbita y grieta gemela obligan a adaptar la estrategia durante la partida.

El progreso se conserva localmente en el navegador.

## Estructura

- `index.html`, `styles.css`, `app.js`: demo web jugable y responsive.
- `merge-system/`: prototipo React del tablero, misiones, estadísticas y Firebase.
- `merge-floating/`: prototipo React alternativo con plataformas flotantes.
- `.github/workflows/pages.yml`: validación y publicación automática de la demo.

## Desarrollo

La demo principal utiliza HTML, CSS y JavaScript sin dependencias. Para probarla localmente:

```bash
python3 -m http.server 8080
```

Después visita `http://localhost:8080`.

## Estado

Esta es una versión jugable inicial. Los dos prototipos TypeScript se conservan como base para una futura integración completa en React/Next.js.

## Autoría

Creado por [Pilukarts](https://github.com/pilukarts).

## Licencia

Código disponible bajo la licencia MIT. Consulta `LICENSE`.
