# JComments


<video src="Vidéo sans titre - Made with Clipchamp.mp4" controls title="Title"></video>

Système de commentaires mode réseau social

--
## Installation du projet

### *Prérequis*

- Python 3.6+
- Git 
- Pip

### *Installation*

- Cloner le projet
- Créer un environnement virtuel
- Installer les dépendances

--
## Utilisation

Rendez-vous dans le repertoire source: **src**

```bash
cd src
```

### Effectuer les migrations

```bash
python manage.py makemigrations
python manage.py migrate
```


### *Création d'un super utilisateur*
utitliser la commande suivante pour créer un super utilisateur qui aura accès à l'interface d'administration.

```bash
python manage.py createsuperuser
```


### *Lancement du serveur*

```bash	
python manage.py runserver
```

### *Aller sur l'app*
    
```bash
http://127.0.0.1:8000/
``` 

Connectez-vous a l'interface d'administration
http://127.0.0.1:8000/admin avec les données:
```bash
username: admin
mdp: 123
``` 

