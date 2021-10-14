# templural 🍤

**Función de plantilla para formatear texto sensible a los acordes plurales.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![README en Français](https://img.shields.io/badge/🇫🇷-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)
[![README auf Deutsch](https://img.shields.io/badge/🇩🇪-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

## El uso
Instalación

```sh
yarn add templural
```

o

```sh
npm install templural
```

### Importación

```js
import { templural } from 'templural'
```

o

```js
const { templural } = require('templural')
```

### Elegir un locale

Templural utiliza [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) para saber qué regla de ajuste aplicar por un número determinado, y las reglas de ajuste varían según el idioma

Esto significa que **debe establecer el locale utilizado por templural** para formatear las frases correctas.

Puede establecer el locale por defecto :

```js
templural.setLocales('fr_BE') // French (Belgium)
```

O crear una neuva función de plantilla para un locale especifico :

```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // German (Switzerland)
```
 
Para obtener más información sobre los valores aceptados por `templural.setLocales()` y `forLocales()` ver [argumento locales](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales).
