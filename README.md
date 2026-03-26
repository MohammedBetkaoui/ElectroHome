
# ElectroHome

Interface web e-commerce inspirée de la maquette Figma du projet « Créer l'interface d'après la fiche ».

## Objectif

Ce projet implémente une vitrine e-commerce moderne pour la marque ElectroHome, avec une navigation multi-pages, un catalogue produits, une gestion de panier et un mode clair/sombre persistant.


## Stack technique

- React 18
- React Router
- Vite
- Tailwind CSS 4
- Composants UI basés sur Radix

## Prérequis

- Node.js 18 ou version supérieure
- npm 9 ou version supérieure

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

Le serveur de développement Vite démarre ensuite en local (généralement sur http://localhost:5173).

## Build de production

```bash
npm run build
```

Les fichiers optimisés sont générés dans le dossier de sortie de Vite.

## Structure du projet

- src/app/components : composants UI et blocs d'interface
- src/app/pages : pages applicatives
- src/app/data : données et store global
- src/styles : styles globaux, thème et typographie

## Fonctionnalités principales

- Navigation par routes (accueil, catégories, marques, promotions, blog, compte)
- Recherche de produits
- Gestion du panier
- Bascule mode clair/sombre avec persistance locale

## Qualité et maintenance

- Architecture orientée composants
- Séparation des pages, données et styles
- Base prête pour extension fonctionnelle (API, authentification, paiement)

Betkaoui Mohammed
  