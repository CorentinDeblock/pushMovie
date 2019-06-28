# Mini api avec github pour pouvoir stocké des données

Petit projet api pour le projet AllezCine, il permet juste d'enregistré des données dans un fichier json.

## Prérequis

- Un fichier login.json
- Un fichier template avec l'extension .json
- Nodejs

### Le fichier login.json

Le fichier login.json est chargé dés que l'application est lancée. Il permet de s'identifié a github et de choisir sa branche et son fichier qui doit target

#### Exemple :

```
{
    username: Votre nom d'utilisateur,
    password: Votre mot de passe,
    branch: Votre branche,
    file: Votre fichier
}
```

Quand l'api github se lance elle va regardé si le fichier existe. Si il n'existe pas a ce moment la
l'application se ferme avec un message d'erreur dans la console de type :

#### Exemple

```
Error: ENOENT: no such file or directory, open 'D:\git\pushMovie\login.json'
```

Si les champs demandé ne sont pas respecté alors l'application va vous 
renvoyé le message

#### Exemple : 

```
Erreur lors de la lecture du fichier login.json \nUn fichier json doit être stucturé comme cela : 

{
    username: Votre nom d'utilisateur,
    password: Votre mot de passe,
    branch: Votre branche,
    file: Votre fichier
}
```

### Le fichier template

Le fichier template est un simple fichier json qui contient un tableau vide

#### Exemple : 

```
[]
```

### Node js

D'abords installez nodejs avec ce lien

[nodeJS](https://nodejs.org/fr/)


Ensuite ouvrez un terminal et rendez vous a la racine de votre dossier et après executé l'application avec la commande node

#### Exemple : 

```
node app.js
```

Si tout sais bien passé, alors un message dans la console devrais s'affiché avec écrit : 

```
Serveur lancé sur le port 8080
```

Ou sinon vérifié dans votre console si vous n'avez pas l'un des message d'erreur suivant : 

##### Bad credential

Vous vous êtes trompé dans votre nom d'utilisateur ou votre mot de passe

##### Not found

Le fichier n'a pas été trouvé

##### No commit found for the ref 'Votre branche'

Votre branche n'existe pas ou n'a pas été trouvé

Si vous n'avez aucun message d'erreur alors tapé dans votre navigateur internet

```
localhost:8080
```

Et si vous êtes acceuilli par ce formulaire

(assets/image/formImage.png)

Alors tout a bien fonctionné et vous êtes prêt a ajouté des données.

Sachez que le projet n'est pas fini et doit être amélioré mais il reste cependant fonctionnel.

Si vous avez des suggestion d'amélioration. Venez me contacté sur ryver ou sur facebbok ou bien sur discord (de préférence discord).