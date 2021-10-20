# templural 🍤

**Fonction de template pour le formatage de texte sensible aux accords pluriels.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![README en anglais](https://img.shields.io/badge/🇬🇧-README-blue)](https://github.com/nlepage/templural#readme)
[![README en allemand](https://img.shields.io/badge/🇩🇪-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

## Utilisation

### Installation

```sh
yarn add templural
```

ou

```sh
npm install templural
```

### Importation

```js
import { templural } from 'templural'
```

ou

```js
const { templural } = require('templural')
```

### Choisir une locale

templural utilise [Intl.PluralRules](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) pour savoir quelle règle d'accord appliquer pour un nombre donné, et les règles d'accord varient selon la langue.

Cela signifie que **vous devez définir la locale utilisée par templural** afin de formater des phrases correctes.

Soit définir la locale par défaut :

```js
templural.setLocales('fr_BE') // Français (Belgique)
```

soit créer une nouvelle fonction de template pour une locale spécifique :


```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // Allemand (Suisse)
```

Pour plus d'informations sur les valeurs acceptées par `templural.setLocales()` et `forLocales()` voir [Argument locales](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl#argument_locales).

Les exemples suivants sont spécifiques au français, voir [Internationalisation](#%EF%B8%8F-internationalisation) pour des informations sur les autres langues.

### Accorder un mot avec nombre le précédant

```js
templural`Yoann et Valentin ont eu ${nbIdees} idée{s}`

// nbIdees = 1  ➔ "Yoann et Valentin ont eu 1 idée"
// nbIdees = 2  ➔ "Yoann et Valentin ont eu 2 idées"
// nbIdees = 42 ➔ "Yoann et Valentin ont eu 42 idées"
// nbIdees = 0  ➔ "Yoann et Valentin ont eu 0 idée"
```

### Insérer n'importe quelle autre valeur dans le texte

```js
templural`${nomUtilisateur} a ${nbPoints} point{s}`

// nomUtilisateur = "Joe",   nbPoints = 1    ➔ "Joe a 1 point"
// nomUtilisateur = "Mario", nbPoints = 1000 ➔ "Mario a 1000 points"
```

### Accorder plusieurs mots avec le même nombre les précédant

```js
templural`J'ai juste pris ${nbPintes} petite{s} bière{s} chéri·e, {z}je te jure`

// nbPintes = 1 ➔ "J'ai juste pris 1 petite bière chéri·e, je te jure"
// nbPintes = 2 ➔ "J'ai juste pris 2 petites bières chéri·e, zje te jure"
// nbPintes = 6 ➔ "J'ai juste pris 6 petites bières chéri·e, zje te jure"
```

### Accorder plusieurs mots chacun avec un nombre différent le précédent

```js
templural`J'ai acheté ${nbCarottes} carotte{s} et ${nbPatates} patate{s}`

// nbCarottes = 1, nbPatates = 1 ➔ "J'ai acheté 1 carotte et 1 patate"
// nbCarottes = 1, nbPatates = 3 ➔ "J'ai acheté 1 carotte et 3 patates"
// nbCarottes = 2, nbPatates = 1 ➔ "J'ai acheté 2 carottes et 1 patate"
// nbCarottes = 2, nbPatates = 3 ➔ "J'ai acheté 2 carottes et 3 patates"
```

### Mots avec une forme différente au singulier et au pluriel

```js
templural`${nbConnectes} personne{s} {est;sont} connecté{s}`

// nbConnectes = 1   ➔ "1 personne est connectée"
// nbConnectes = 2   ➔ "2 personnes sont connectées"
// nbConnectes = 666 ➔ "666 personnes sont connectées"
```

### Mélanger tous les exemples précédents

```js
templural`${nbChevaux} cheva{l;ux} {a;ont} ${nbChevaux} tête{s}, ${nbChevaux * 2} {oeil;yeux} et ${nbChevaux * 4} patte{s}`

// nbChevaux = 1 ➔ "1 cheval a 1 tête, 2 yeux et 4 pattes"
// nbChevaux = 2 ➔ "2 chevaux ont 2 têtes, 4 yeux et 8 pattes"
```

### Accorder un mot avec un nombre *ne le précédant pas*

```js
templural`Dans le ciel vole{$1;nt} ${nbWhales} baleine{s}`

// nbWhales = 1 ➔ "Dans le ciel vole 1 baleine"
// nbWhales = 2 ➔ "Dans le ciel volent 2 baleines"
```

`$1` référence la première expression interpolée.

`$2`, `$3` ou `$n` peuvent être utilisés pour référencer la deuxième, troisième ou énième expression interpolée.

### Accorder avec des grands nombres

```js
templural`${nbPersonnes}{;; de} personne{s} connectée{s}`

// nbConnectes = 1       ➔ "1 personne connectée"
// nbConnectes = 2       ➔ "2 personnes connectées"
// nbConnectes = 1000000 ➔ "1000000 de personnes connectées"
```

### Syntaxe associative

Dans certains cas, la syntaxe associative peut être utilisée pour éviter les valeurs vides :

```js
templural`${nbPersonnes}{;; de} personne{s} connectée{s}`

// peut être remplacé par

templural`${nbPersonnes}{many: de} personne{s} connectée{s}`
```

**⚠️ La syntaxe associative et la syntaxe ordonnée ne doivent pas être mélangées:**

```js
// Correct:
templural`${nbCheval} cheva{one:l;other:ux}`

// Erroné:
templural`${nbCheval} cheva{one:l;ux}`
```

## 🗣️ Internationalisation

templural est construit sur la base de [Intl.PluralRules](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) et peut être utilisé pour formater des phrases dans n'importe quelle langue.

Ce README est disponible dans les langues suivantes :

 - [🇬🇧 Anglais](https://github.com/nlepage/templural#readme)
 - [🇩🇪 Allemand](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

### Règles d'accord

Chaque langue a des règles d'accord différentes.

Par exemple le français a trois catégories d'accord, `"one"` pour les singulier, `"other"` pour le pluriel, et `"many"` pour certains grands nombres :

```js
templural.setLocales('fr')

templural`${n} est dans la catégorie {one;other;many}`

// n = 1       ➔ "1 est dans la catégorie one"
// n = 2       ➔ "2 est dans la catégorie other"
// n = 1000000 ➔ "1000000 est dans la catégorie many"
// n = 0       ➔ "0 est dans la catégorie one"
```

L'anglais est un peu différent du français, il n'a que les deux catégories `"one"` et `"other"`, et le 0 est pluriel :

```js
templural.setLocales('en')

templural`${n} est dans la catégorie {one;other}`

// n = 1       ➔ "1 est dans la catégorie one"
// n = 2       ➔ "2 est dans la catégorie other"
// n = 1000000 ➔ "1000000 est dans la catégorie other"
// n = 0       ➔ "0 est dans la catégorie other"
```

Voir [Language Plural Rules](https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html) pour des informations sur les règles d'accord dans n'importe quelle autre langue.

Le comportement de templural peut être personnalisé en utilisant trois mécanismes :

 - [Priorité des catégories](#priorité-des-catégories)
 - [Ordre des catégories](#ordre-des-catégories)
 - [*Fallback* de catégorie](#fallback-de-catégorie)

`templural.setLocales()` et `forLocales()` acceptent `LocalesOptions` comme second paramètre, voir [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Priorité des catégories

La priorité des catégories définit quelles catégories sont valorisées quand des valeurs ne sont pas spécifiées pour toutes les catégories.

Si la priorité est :

1. `many`
2. `other`
3. `one`

Alors :

```js
// une seule valeur spécifiée est pour la catégorie many
templural`${n} is {many}`

// deux valeurs spécifiées sont pour les catégories other et many
templural`${n} is {other;many}`

// trois valeurs spécifiées sont pour les catégories one, other et many
templural`${n} is {one;other;many}`
```

La priorité par défaut (indépendamment de la locale) est :

1. `other`
2. `one`
3. `two`
4. `few`
5. `many`
6. `zero`

Cette priorité par défaut est filtrée pour n'inclure que les catégories de la locale sélectionnée, par exemple en français :

1. `other`
2. `one`
3. `many`

Certaines langues peuvent avoir une priorité par défaut différente, voir [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Ordre des catégories

L'ordre des catégories définit dans quelle ordre les catégories sont valorisées (indépendamment de leur priorité).

Si l'ordre est :

1. `many`
2. `other`
3. `one`

Alors :

```js
// deux valeurs spécifiées sont pour other puis one (many a une priorité basse)
templural`${n} is {other;one}`

// trois valeurs spécifiées sont pour many puis other puis one
templural`${n} is {many;other;one}`
```

L'ordre par défaut (indépendamment de la locale) est :

1. `zero`
2. `one`
3. `two`
4. `few`
5. `many`
6. `other`

Cette ordre par défaut est filtré pour n'inclure que les catégories de la locale sélectionnée.

Certaines langues peuvent avoir un ordre par défaut différent, voir [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts), c'est le cas du français :

1. `one`
2. `other`
3. `many`

### *Fallback* de catégorie

Certaines langues peuvent nécessiter qu'une catégorie "retombe" sur une autre catégorie.

Par exemple em français, `many` se comporte comme une sous-catégorie de `other`, autrement dit `many` retombe sur `other` :

```js
templural`${1000000} est dans {one;other;many} et retombent dans {one;other}`
// ➔ "1000000 est dans many et retombent dans other"
```

Certaines langues peuvent avoir des *fallbacks* par défaut, voir [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts), c'est le cas du français.

## ❓ FAQ

### Et les nombres négatifs ou flottants ?

templural s'en fiche, il repose sur [Intl.PluralRules](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

### De nouvelles features sont-elles prévues ?

Pas pour le moment.

templural est simple et bête, et il va probablement le rester.

### D'autres questions ?

Utilisez l'[onglet Discussions](https://github.com/nlepage/templural/discussions).

## Contributors ✨

<table>
  <tr>
    <td align="center"><a href="https://github.com/SvA1"><img src="https://avatars.githubusercontent.com/u/19571875?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Lepage</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=nlepage" title="Author">✍️</a></td>
  </tr>
</table>

Merci à nos merveilleux contributeurs ([emoji key](https://allcontributors.org/docs/en/emoji-key)) :

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/EmrysMyrddin"><img src="https://avatars.githubusercontent.com/u/3855602?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Valentin Cocaud</b></sub></a><br /><a href="#ideas-EmrysMyrddin" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Taranys"><img src="https://avatars.githubusercontent.com/u/4621525?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yoann Prot</b></sub></a><br /><a href="#ideas-Taranys" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/SvA1"><img src="https://avatars.githubusercontent.com/u/41849274?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Svetlana A.</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=SvA1" title="Documentation">📖</a> <a href="#translation-SvA1" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/Mayie"><img src="https://avatars.githubusercontent.com/u/35461138?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marie Viley</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=Mayie" title="Documentation">📖</a> <a href="#translation-Mayie" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/patou"><img src="https://avatars.githubusercontent.com/u/841858?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Patrice De Saint Steban</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=patou" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Ce projet suit la spécification [all-contributors](https://github.com/all-contributors/all-contributors). Les contributions de toute sorte sont les bienvenues !

## 🤝 Contribuer

Les contributions, issues et demandes de feature sont les bienvenues !<br />Consultez notre [Contributing guide](https://github.com/nlepage/templural/blob/main/docs/CONTRIBUTING.md) pour plus d'informations.

Afin de favoriser un environnement ouvert et accueillant, nous avons adopté [un code de conduite](https://github.com/nlepage/tempural/blob/main/docs/CODE_OF_CONDUCT.md) que les participants au projet s'engagent à respecter. Merci de lire le texte complet afin de comprendre quels comportements seront et ne seront pas tolérés.

## Montrez votre soutien

Lachez une ⭐️ et/ou sponsorisez si ce projet vous a aidé !

## 📝 Licence

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
Ce projet est sous licence [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html).
