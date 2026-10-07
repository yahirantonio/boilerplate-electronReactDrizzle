# Electron + React + SQLite Boilerplate

Plantilla para crear aplicaciones de escritorio con Electron, React y TypeScript, usando SQLite como base de datos local y Drizzle ORM para las consultas y migraciones.

Incluye la infraestructura básica, una barra de ventana personalizada y una pantalla de ejemplo. No contiene tablas ni funcionalidades de negocio.

## Qué incluye

- Electron Forge y Vite para desarrollo y empaquetado.
- React y TypeScript para la interfaz.
- Separación entre los procesos `main`, `preload` y `renderer`.
- Ventana sin marco nativo, maximizada al iniciar, con botones para minimizar, maximizar/restaurar y cerrar.
- Comunicación mediante IPC y una API expuesta con `contextBridge`.
- SQLite con `better-sqlite3` y Drizzle ORM en el proceso principal.
- Aplicación de migraciones pendientes al iniciar, tanto en desarrollo como en la aplicación empaquetada.
- Oxlint para analizar código, con reglas de React Hooks, y Oxfmt para formatearlo.
- DevTools habilitadas en desarrollo y deshabilitadas en la aplicación empaquetada.

## Requisitos de desarrollo

- Node.js compatible con las dependencias. Electron Forge requiere al menos Node.js 22.13.0 en esta plantilla.
- pnpm; la versión del proyecto está indicada en el campo `packageManager` de `package.json`.
- Si `better-sqlite3` necesita compilarse en tu equipo, Python y las herramientas de compilación C++. En Windows, instala Visual Studio Build Tools con las herramientas de C++.

Estas herramientas son para desarrollar y generar la aplicación. Los usuarios del instalador no necesitan instalar Node.js, Python ni SQLite por separado.

## Empezar

Copia la plantilla o crea un repositorio a partir de ella. Desde la carpeta del proyecto, ejecuta:

```bash
pnpm install
pnpm start
```

Vite actualiza la interfaz durante el desarrollo. Los cambios en el proceso principal o en el preload pueden requerir reiniciar Electron.

## Comandos

| Comando          | Uso                                                                |
| ---------------- | ------------------------------------------------------------------ |
| `pnpm start`     | Ejecuta la aplicación en desarrollo.                               |
| `pnpm typecheck` | Comprueba los tipos de TypeScript sin generar archivos.            |
| `pnpm lint`      | Analiza el código y comprueba el formato sin modificar archivos.   |
| `pnpm lint:fix`  | Aplica las correcciones disponibles y formatea los archivos.       |
| `pnpm package`   | Genera la aplicación empaquetada en `out/`.                        |
| `pnpm make`      | Genera los instaladores o archivos de distribución en `out/make/`. |

El comando `release` existe en `package.json`, pero la plantilla no configura un publisher para publicar versiones.

## Estructura

```text
src/
  main/
    db/
      schema/                 # Definiciones de tablas
      connection.ts           # Conexión a SQLite
      migrations.ts           # Aplicación de migraciones
    ipc/                      # Manejadores IPC
    windows/                  # Creación de ventanas
    main.ts                   # Inicio y ciclo de vida de Electron
  preload/
    preload.ts                # API expuesta a la interfaz
    window-controls.ts        # Comunicación IPC de los controles
  renderer/
    components/               # Componentes de React
    css/                      # Estilos
    App.tsx                   # Componente de la aplicación
    index.tsx                 # Montaje de React
    renderer.ts               # Entrada de la interfaz
  shared/                     # Contratos compartidos entre procesos
  window.d.ts                 # Tipos de la API disponible en window
drizzle/
  meta/_journal.json          # Historial de migraciones, inicialmente vacío
drizzle.config.ts             # Configuración de Drizzle Kit
forge.config.mts              # Empaquetado y distribución
index.html                    # HTML y entrada del renderer
```

El renderer se encarga de la interfaz. El proceso principal gestiona las ventanas, la base de datos y las operaciones del sistema. El preload expone métodos concretos para comunicarlos: la interfaz no debe acceder directamente a SQLite ni recibir acceso general a `ipcRenderer`.

## Base de datos y migraciones

La conexión se crea al iniciar Electron y se cierra al terminar la aplicación. El archivo de SQLite se guarda en:

```text
<app.getPath('userData')>/electro.sqlite
```

En Windows, con el nombre actual de la plantilla, normalmente corresponde a `%APPDATA%/my-app/electro.sqlite`. La base se guarda fuera de la carpeta de instalación para conservar los datos entre actualizaciones.

Para añadir tablas:

1. Crea sus definiciones en archivos dentro de `src/main/db/schema/`.
2. Genera las migraciones:

   ```bash
   pnpm exec drizzle-kit generate
   ```

3. Revisa el SQL generado en `drizzle/` y guárdalo en el repositorio junto con sus metadatos.
4. Inicia la aplicación para aplicar las migraciones pendientes.

La generación de las migraciones es un paso explícito. Su aplicación es automática al iniciar: editar el schema por sí solo no modifica la base de datos.

La plantilla conserva un historial vacío en `drizzle/meta/_journal.json`, necesario para que el migrador funcione sin migraciones iniciales. Drizzle puede crear su propia tabla interna de seguimiento; no hay tablas de negocio predefinidas.

Forge incluye la carpeta `drizzle/` como recurso de la aplicación empaquetada. No elimines migraciones que ya hayas distribuido: genera nuevas migraciones para modificar las tablas existentes.

Para enviar datos a React, añade un manejador IPC en `main`, un método concreto en el preload y su contrato compartido. Realiza las consultas en el proceso principal.

## Usarla para una aplicación nueva

- Cambia `name`, `productName`, `description`, `version` y `author` en `package.json`.
- Personaliza el título de `index.html` y el texto de `src/renderer/components/TitleBar.tsx`.
- Sustituye la pantalla de ejemplo de `src/renderer/App.tsx` por tus funcionalidades.
- Ajusta las opciones de ventana en `src/main/windows/create-main-window.ts`.
- Configura los iconos y los datos del instalador en `forge.config.mts`.
- Si quieres otro nombre para el archivo de base de datos, cambia `electro.sqlite` en `src/main/db/connection.ts`.

Cambiar el nombre de la aplicación puede cambiar la carpeta `userData`. Los datos de una instalación anterior no se trasladan automáticamente a la nueva carpeta.

Al copiar la plantilla, puedes omitir `node_modules/`, `.vite/` y `out/`: son dependencias y archivos generados. Ejecuta `pnpm install` en la copia.

## Distribución

```bash
pnpm make
```

En Windows, el maker Squirrel genera el instalador en `out/make/squirrel.windows/<arquitectura>/`. El archivo `Setup.exe` instala la aplicación y la abre; no incluye un asistente tradicional con pasos de instalación.

También hay makers configurados para ZIP en macOS y paquetes DEB/RPM en Linux. La generación depende del sistema operativo y de las herramientas requeridas por cada maker; la configuración no garantiza compilar todos los formatos desde Windows.

Antes de distribuir una versión, prueba el instalador en el sistema de destino y comprueba que las migraciones y la base de datos funcionen en la aplicación instalada.

## Configuración del análisis y formato

- `.oxlintrc.json`: conjuntos de reglas, severidad y comprobaciones de hooks (`react/rules-of-hooks` y `react/exhaustive-deps`).
- `.oxfmtrc.json`: comillas, indentación, ancho de línea y otras opciones de formato.

Los comandos del proyecto ejecutan estas herramientas bajo demanda. Para mostrar diagnósticos o formatear al guardar, configura su integración en tu editor.
