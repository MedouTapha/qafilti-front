# Qafilti Front

Application Angular (PrimeNG) pour la gestion d’un service de transport/voyage: réservations, passagers, colis, paiements, rapports et administration des paramètres.

## Fonctionnalités de base (proposition)
- Réservations
  - Création et modification d’une réservation
  - Confirmation de la réservation (passage de Brouillon → Confirmée)
  - Impression d’un reçu simple (via la fonction d’impression du navigateur)
- Passagers
  - Gestion de la liste des passagers (ajout, édition, suppression)
- Colis
  - Enregistrement d’envoi de colis (poids, tarif, statut)
  - Impression rapide d’une étiquette simple
- Paiements
  - Saisie des paiements (type: Billet/Colis, mode: Cash/Carte/Mobile)
- Rapports
  - Indicateurs clés (ventes billets/colis, taux de remplissage estimé)
  - Tableau (mock) des revenus par trajet
- Administration (tables de paramétrage)
  - Trajets (code, origine, destination)
  - Véhicules (matricule, modèle, capacité)
  - Tarifs (par trajet)

Ces fonctionnalités sont déjà présentes sous forme de maquettes interactives (mock data) et peuvent servir de base pour connecter un backend ultérieurement.

## Organisation du menu (proposition)
- Tableau de bord
- Opérations
  - Réservations
  - Passagers
  - Colis
  - Paiements
- Rapports
- Administration

Cette organisation permet de regrouper les actions quotidiennes dans « Opérations », les vues d’analyse dans « Rapports », et les paramètres dans « Administration » (onglets: Trajets, Véhicules, Tarifs).

## Démarrer le projet

Installer les dépendances puis lancer le serveur de développement:
```bash
npm install
ng serve
```
Application disponible sur http://localhost:4200/.

## Construction (build)
```bash
ng build
```

## Tests
```bash
ng test
```

---
Ce projet a été généré avec Angular CLI (v20.x) et utilise PrimeNG (Menubar, Table, Dialog, etc.).
