# templural 🍤

**Fonction de template pour accorder les pluriels dans les phrases.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

[🇬🇧 English README](https://github.com/nlepage/templural#readme)

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

### Accorder un mot avec nombre le précédant

```js
templural`Yoann et Valentin ont eu ${nbIdees} idée{s}`

// nbIdees = 1 ➔ "Yoann et Valentin ont eu 1 idée"
// nbIdees = 2 ➔ "Yoann et Valentin ont eu 2 idées"
// nbIdees = 42 ➔ "Yoann et Valentin ont eu 42 idées"
// nbIdees = 0 ➔ "Yoann et Valentin ont eu 0 idée"
```

### Insérer n'importe quelle autre valeur dans le texte

```js
templural`${nomUtilisateur} a ${nbPoints} point{s}`

// nomUtilisateur = "Joe", nbPoints = 1 ➔ "Joe a 1 point"
// nomUtilisateur = "Mario", nbPoints = 1000 ➔ "Mario a 1000 points"
```

### Accorder plusieurs mots avec le même nombre les précédant

```js
templural`J'ai juste pris ${nbPintes} petite{s} bière{s} chéri·e, {z}je te jure`

// nbPintes = 1 ➔ "J'ai juste pris 1 petite bière chéri·e, je te jure"
// nbPintes = 2 ➔ "J'ai juste pris 2 petites bières chéri·e, zje te jure"
// nbPintes = 6 ➔ "J'ai juste pris 6 petites bières chéri·e, zje te jure"
```

### Accorder plusieurs mots chacun avec un nombre différent

```js
templural`J'ai acheté ${nbCarottes} carotte{s} et ${nbPatates} patate{s}`

// nbCarottes = 1, nbPatates = 1 ➔ "J'ai acheté 1 carotte et 1 patate"
// nbCarottes = 1, nbPatates = 3 ➔ "J'ai acheté 1 carotte et 3 patates"
// nbCarottes = 2, nbPatates = 1 ➔ "J'ai acheté 2 carottes et 1 patate"
// nbCarottes = 2, nbPatates = 3 ➔ "J'ai acheté 2 carottes et 3 patates"
```

### Mots avec une forme différentes au singulier et au pluriel

```js
templural`${nbConnectes} personne{s} {est:sont} connecté{s}`

// nbConnectes = 1 ➔ "1 personne est connecté"
// nbConnectes = 2 ➔ "2 personnes sont connectés"
// nbConnectes = 666 ➔ "666 personnes sont connectés"
```

### Un mélange de tous les exemples précédents

```js
templural`${nbChevaux} cheva{l:ux} {a:ont} ${nbChevaux} tête{s}, ${nbChevaux * 2} {oeil:yeux} et ${nbChevaux * 4} patte{s}`

// nbChevaux = 1 ➔ "1 cheval a 1 tête, 2 yeux et 4 pattes"
// nbChevaux = 2 ➔ "2 chevaux ont 2 têtes, 4 yeux et 8 pattes"
```

### Accorder un mot avec un nombre *ne le précédant pas*

*Cette exemple n'est pas traduit, vous avez une idée pour le traduire ? Faites une Pull Request !*

```js
templural`There {$1:is:are} ${nbWhales} flying whale{s}`

// nbWhales = 1 ➔ "There is 1 flying whale"
// nbWhales = 2 ➔ "There are 2 flying whales"
```

`$1` référence la première expression interpolée.

`$2`, `$3` ou `$n` peuvent être utilisé pour référencer la deuxième, troisième ou énième expression interpolée.

### Remplacer un nombre par du texte

```js
templural`Vous avez {${nbMessages}:un:plusieurs} message{s}`

// nbMessages = 1 ➔ "Vous avez a message"
// nbMessages = 86 ➔ "Vous avez plusieurs messages"
```

#### Choisir un texte différent si le nombre est zéro

```js
templural`Vous {$1:n'::}avez {${nbMessages}:aucun:un:plusieurs} message{s}`

// nbMessages = 0 ➔ "Vous n'avez aucun message"
// nbMessages = 1 ➔ "Vous avez un message"
// nbMessages = 86 ➔ "Vous avez plusieurs messages"
```

#### Mélanger le remplacement ou non d'un nombre par du texte

```js
templural`Vous avez {${nbMessages}:un:$1} message{s}`

// nbMessages = 1 ➔ "Vous avez un message"
// nbMessages = 86 ➔ "Vous avez 86 messages"
```

## ❓ FAQ

### De nouvelles features sont-elles prévues ?

Pas pour le moment.

templural est simple et bête, et il va probablement le rester.

### Et les nombres négatifs ou flottants alors ?

templural s'en moque.

Si un nombre est inférieur ou égal à 1, les mots correspondants sont au singulier.

### D'autres questions ?

Utilisez l'[onglet Discussions](https://github.com/nlepage/templural/discussions).

## Auteurs & Contributeurs

Remerciements particuliers à [Valentin Cocaud](https://github.com/EmrysMyrddin) et [Yoann Prot](https://github.com/Taranys) pour l'idée originale derrière templural.

👤 **Nicolas Lepage**

* Twitter: [@njblepage](https://twitter.com/njblepage)
* Github: [@nlepage](https://github.com/nlepage)

## 🤝 Contribuer

Les contributions, issues et demande de feature sont les bienvenues !<br />N'hésitez pas à consulter les [issues](https://github.com/nlepage/templural/issues).

## Show your support

Lachez une ⭐️ et/ou sponsororisez si ce projet vous a aidé !

## 📝 License

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
Ce projet est sous licence [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html).
