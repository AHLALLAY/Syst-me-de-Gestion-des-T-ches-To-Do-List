# TaskFlow 📋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Taille](https://img.shields.io/badge/taille-légère-green.svg)
![Licence](https://img.shields.io/badge/licence-MIT-green.svg)
**la page d'accueil**
![Home](/screenshots/Capture%20d’écran%202024-11-03%20232327.png)
**la page d'ajoute**
![Ajouter](/screenshots/Capture%20d’écran%202024-11-03%20233349.png)

Une application web moderne et intuitive de gestion de tâches, construite avec HTML, CSS (Tailwind) et JavaScript vanilla.

## ✨ Caractéristiques principales

- Interface utilisateur moderne et responsive
- Gestion des tâches en mode Kanban
- Stockage local des données
- Système de priorités visuelles
- Barre de progression dynamique
- Recherche en temps réel
- Notifications toast personnalisées

## 🚀 Fonctionnalités détaillées

### Gestion des tâches
- **Création de tâches**
  - Titre (3-20 caractères)
  - Description détaillée (10-200 caractères)
  - Niveau de priorité (Haute/Moyenne/Basse)
  - Date d'échéance
  
### Organisation
- **3 colonnes de statut**
  - À faire
  - En cours
  - Terminées

### Suivi
- Barre de progression dynamique
- Compteurs par colonne
- Indicateurs visuels de priorité
- Alertes de dates d'échéance

## 🛠 Technologies utilisées

- **HTML5** - Structure sémantique
- **Tailwind CSS** - Styles et responsive design
- **JavaScript** (Vanilla) - Logique et interactions
- **LocalStorage** - Persistance des données

## 📦 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/AHLALLAY/Brief_TaskFlow-ToDoListe-
```

2. Ouvrez le fichier `index.html` dans votre navigateur
```bash
cd taskflow
open index.html  # ou double-cliquez sur le fichier
```

## 💻 Structure du projet

```
taskflow/
├── dist/
|   └─── index.html
├── js/
│   └─── index.js
├── README.md
└── .gitignore
```

## 🎯 Utilisation

### Créer une nouvelle tâche
1. Cliquez sur le bouton "Nouvelle tâche"
2. Remplissez le formulaire :
   - Titre (obligatoire)
   - Description (obligatoire)
   - Priorité (obligatoire)
   - Date d'échéance (obligatoire)
3. Validez le formulaire

### Gérer les tâches
- **Commencer une tâche** : Cliquez sur le bouton "Commencer"
- **Terminer une tâche** : Cliquez sur le bouton "Terminer"
- **Supprimer une tâche** : Cliquez sur le bouton "×"
- **Rechercher** : Utilisez la barre de recherche pour filtrer les tâches

## 🔍 Fonctionnalités détaillées

### Système de priorités
- **Haute** : Bordure rouge
- **Moyenne** : Bordure jaune
- **Basse** : Bordure verte

### Dates d'échéance
- **Date dépassée** : Texte en rouge
- **Date valide** : Texte en vert

### Notifications
- Toast de confirmation pour chaque action
- Durée d'affichage : 3 secondes

## 🔒 Validation des données

### Titre
- Minimum : 3 caractères
- Maximum : 20 caractères

### Description
- Minimum : 10 caractères
- Maximum : 200 caractères

## 💾 Stockage

Les données sont stockées localement dans le navigateur (LocalStorage) avec la structure suivante :

```javascript
{
  id: string,
  title: string,
  description: string,
  priority: "haute" | "moyenne" | "basse",
  dueDate: string,
  status: "À faire" | "En cours" | "Terminées"
}
```

## 🌐 Compatibilité

- Chrome
- Firefox
- Safari
- Edge
- Opera

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commitez vos changements
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Poussez vers la branche
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Ouvrez une Pull Request

## ✍️ Auteur

Abderrahmane AHLALLAY
- GitHub: [@AHLALLAY](https://github.com/AHLALLAY)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔄 Mises à jour à venir

- [ ] Mode sombre
- [ ] Drag and drop entre colonnes
- [ ] Export des tâches
- [ ] Filtres avancés
- [ ] Tags pour les tâches
- [ ] Mode hors ligne complet

---

Développé avec ❤️ par [Abderrahmane AHLALLAY](https://github.com/AHLALLAY)