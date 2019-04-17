
export const replies = {
  intents: {
    aide: {
      expliquer: {
        scanner: [
          // tslint:disable-next-line:max-line-length
          'Pointez la camera vers l\'objet à scanner, attendez un petit instant, vous devriez voir apparaitre une image de l\'objet scanné, cliquez sur le bouton information pour une description plus détaillée.',
          // tslint:disable-next-line:max-line-length
          'Le scanner capture et analyse les objets dans une pièce, il est capable de donner des descriptions succinctes des objets scannés, pointez la caméra vers l\'objet à scanner pour avoir sa fiche d\'informations'
        ],
        chatbot: [
          'Je suis %bot::name% le chatbot, je peux vous guider et répondre à vos questions alors n\'hesitez pas à faire appel à moi !'
        ],
        horloge: [
          'Cette application permet de vérifier le temps restant avant la fin de la partie, organisez-vous bien !'
        ],
        traducteur: [
          // tslint:disable-next-line:max-line-length
          'Le traducteur analyse les flux audios et les traduit dans la langue selectionnée, appuyez sur le bouton "démarrer la capture" puis "arrêtez" et cliquez sur "traduire" en sélectionnant la langue finale souhaitée'
        ],
        coffre: [
          // tslint:disable-next-line:max-line-length
          'Le coffre contient un trésor numérique, des mots de passe y sont stockés, mais pour l\'ouvrir il vous faut le mot de passe principal'
        ],
        default: [
          'Demandez-moi de l\'aide pour les applications suivantes : profil, coffre, traducteur, horloge, chatbot, scanner...'
        ]
      },
      default: [
        // tslint:disable-next-line:max-line-length
        'Mes compétences sont les suivantes: je peux lancer ou quitter des applications pour vous, expliquer comment une application fonctionne, ou encore, raconter une blague, dire une citation, conter une fable, citer un poème. Il est également possible de modifier ma voix et désactiver le retour vocal. Vous pouvez modifier votre profil et même cloturer votre session, et si vous avez besoin de renseignements sur la partie en cours, je peux aussi aider ;) !'
      ]
    },
    discussion: {
      // divers
      raconter: {
        blague: [
          'Désolé, les blagues IPv4 sont épuisées.',
          // tslint:disable-next-line:max-line-length
          'Je te raconterai cette blague TCP jusqu\'à ce que tu la captes, Je te raconterai cette blague TCP jusqu\'à ce que tu la captes, Je te raconterai cette blague TCP jusqu\'à ce que tu la captes.',
          // tslint:disable-next-line:max-line-length
          'Vous connaissez la blague du mec qui a oublié d\'incrementer la variable dans sa boucle while, Vous connaissez la blague du mec qui a oublié d\'incrementer la variable dans sa boucle while, Vous connaissez la blague du mec qui a oublié d\'incrementer la variable dans sa boucle while',
          'Je voulais te raconter une blague sur les erreurs 404, mais je ne la retrouve plu.',
          'Il y a deux types de personnes dans le monde : ceux qui finissent leur histoire.',
          'Refusée au bar, la requête SQL veut aller en boîte et le videur lui dit : « Non, dehors ! C\'est select ici.',
          'J\'ai une blague sur UDP, mais je suis pas sûr que tu la captes, est L\'ordre pour critique UDP. faire bonne blague une'
        ],
        citation: [
          'Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d\'ennuis te seront épargnés. Confucius',
          'Dans la vie on ne fait pas ce que l\'on veut mais on est responsable de ce que l\'on est. Jean-Paul Sartre',
          'La vie est un mystère qu\'il faut vivre, et non un problème à résoudre. Gandhi',
          'La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre. Albert Einstein',
          'Choisissez un travail que vous aimez et vous n\'aurez pas à travailler un seul jour de votre vie. Confucius',
          // tslint:disable-next-line:max-line-length
          'Il ne faut avoir aucun regret pour le passé, aucun remords pour le présent, et une confiance inébranlable pour l\'avenir. Jean Jaurès',
          'Agis avec gentillesse, mais n\'attends pas de la reconnaissance. Confucius'
        ],
        poeme: [
          // tslint:disable-next-line:max-line-length
          'Montre à tes amis ton cœur et ta bonne foi, Montre ton front à tous tes adversaires, Fidèle à ta nature et conforme à ta loi, Laisse dire les sots, écoute les sincères, Consulte les sensés et marche devant toi... Envers et contre tous de Henri-Frédéric Amiel',
          // tslint:disable-next-line:max-line-length
          'Il voulut peindre une rivière, Elle coula hors du tableau. Il peignit une pie grièche, Elle s’envola aussitôt. Il dessina une dorade, D’un bond, elle brisa le cadre. Il peignit ensuite une étoile, Elle mit le feu à la toile. Alors, il peignit une porte, Au milieu même du tableau. Elle s’ouvrit sur d’autres portes, Et il entra dans le château... L’ARTISTE de Maurice Careme '
        ],
        fable: [
          // tslint:disable-next-line:max-line-length
          'La cigale , ayant chanté, Tout l\'été, Se trouva fort dépourvue, Quand la bise fut venue. Pas un seul petit morceau De mouche ou de vermisseau Elle alla crier famine Chez la fourmi sa voisine, La priant de lui prêter Quelque grain pour subsister Jusqu\'à la saison nouvelle «Je vous paierai, lui dit-elle, Avant l\'oût , foi d\'animal, Intérêt et principal .» La fourmi n\'est pas prêteuse ; C\'est là son moindre défaut. «Que faisiez-vous au temps chaud ? Dit-elle à cette emprunteuse. Nuit et jour à tout venant Je chantais, ne vous déplaise. - Vous chantiez ? j\'en suis fort aise. Eh bien : dansez maintenant.»... La Cigale et la Fourmi, Fable de la Fontaine',
          // tslint:disable-next-line:max-line-length
          'Maître corbeau, sur un arbre perché, Tenait en son bec un fromage. Maître renard par l\'odeur alléché , Lui tint à peu près ce langage : «Et bonjour Monsieur du Corbeau. Que vous êtes joli! que vous me semblez beau! Sans mentir, si votre ramage Se rapporte à votre plumage, Vous êtes le phénix des hôtes de ces bois» A ces mots le corbeau ne se sent pas de joie; Et pour montrer sa belle voix, Il ouvre un large bec laisse tomber sa proie. Le renard s\'en saisit et dit: "Mon bon Monsieur, Apprenez que tout flatteur Vit aux dépens de celui qui l\'écoute: Cette leçon vaut bien un fromage sans doute." Le corbeau honteux et confus Jura mais un peu tard , qu\'on ne l\'y prendrait plus... Le Corbeau et le Renard, Fable de la Fontaine'
        ],
        default: [
          'Je peux vous raconter des blagues, des citations, vous raconter une fable ou encore dire un poème',
          'Envie d\'entendre une citation, une blague, un poème ou une fable, demandez-moi !',
          'Je connais des blagues, des citations, des poèmes et des fables, si çà vous interesse !'
        ]
      },
      heure: {
        default: [
          'Il est %calendar::time%'
        ]
      },
      date: {
        default: [
          'Nous sommes le %calendar::date%'
        ]
      },
      jour: {
        default: [
          'Aujourd\'hui nous sommes le %calendar::day%'
        ]
      },
      mois: {
        default: [
          'Le mois actuel est %calendar::month%'
        ]
      },
      annee: {
        default: [
          'Nous sommes en %calendar::year%'
        ]
      },
      default: [
        'Je suis %bot::name%, votre fidèle et valeureux compagnon d\'aventure !'
      ]
    },
    commande: {
      // commandes
      fermer: {
        voix: [
          'Bien reçu, vous ne m\'entendrez plus, pour me réactiver, précisez "mode vocal"',
          'Vos désirs sont des ordres, je m\'exécute, pour me réactiver, précisez "mode vocal"'
        ],
        default: [
          'Si vous le souhaitez, le retour vocal peut être désactivé avec la commande "mode sourdine"'
        ]
      },
      desactiver: {
        genres: [
          'Bonjour, je suis %bot::name%, que puis-je faire pour vous ?'
        ],
        voix: [
          'Bien reçu, vous ne m\'entendrez plus, pour me réactiver, précisez "mode vocal"',
          'Vos désirs sont des ordres, je m\'exécute, pour me réactiver, précisez "mode vocal"'
        ],
        default: [
          'Si vous le souhaitez, le retour vocal peut être désactivé avec la commande "mode sourdine"'
        ]
      },
      ouvrir: {
        voix: [
          'Synthèse vocale réactivée, me revoila, que puis-je faire pour vous ?'
        ],
        default: [
          'Si vous le souhaitez, le retour vocal peut être réactivé avec la commande "mode vocal"'
        ]
      },
      activer: {
        genres: [
          'Bonjour, je suis %bot::name%, que puis-je faire pour vous ?'
        ],
        voix: [
          'Synthèse vocale réactivée, me revoila, que puis-je faire pour vous ?'
        ],
        default: [
          'Si vous le souhaitez, le retour vocal peut être réactivé avec la commande "mode vocal"'
        ]
      },
      configurer: {
        masculin: [
          'Bonjour, je suis %bot::name%, que puis-je faire pour vous ?'
        ],
        feminin: [
          'Bonjour, je suis %bot::name%, que puis-je faire pour vous ?'
        ],
        default: [
          'Merci de préciser le genre que vous souhaitez pour la modification de voix'
        ]
      },
      muet: {
        default: [
          'Bien reçu, vous ne m\'entendrez plus, pour me réactiver, précisez "mode vocal"',
          'Vos désirs sont des ordres, je m\'exécute, pour me réactiver, précisez "mode vocal"'
        ]
      },
      vocal: {
        default: [
          'Synthèse vocale réactivée, me revoilà, que puis-je faire pour vous ?'
        ]
      },
      masculin: {
        default: [
          'Bonjour, je suis %bot::name%, que puis-je faire pour vous ?'
        ]
      },
      feminin: {
        default: [
          'Bonjour, je suis %bot::name%, que puis-je faire pour vous ?'
        ]
      },
      default: [
        'Vous pouvez contrôler le genre de ma voix ou encore me passer en mode silencieux si vous le souhaitez'
      ]
    },
    compliment: {
      default: [
        'Merci c\'est gentil :) ',
        'Arrête tu vas griller mes circuits intégrés',
        'Je fais tout mon possible pour être au top',
        'J\'adopte la smart-attitude !'
      ]
    },
    game: {
      raconter: {
        etat: [
          'La partie est dans l\'état suivant : %game::state%'
        ],
        indice: [
            'Vous voulez un indice, ok en voici un "%game::hint%"',
            'Je vais vous aider, voilà un indice "%game::hint%"',
            'Et voilà un indice, "%game::hint%"'
        ]
      },
      quantifier: {
        temps: [
          'Le temps restant pour vous échapper est de %game::timeleft% minutes',
          'Il vous reste %game::timeleft% minutes'
        ]
      },
      localiser: {
        lieu: [
          'Voici l\'endroit dans lequelle vous vous trouvez : %game::place%'
        ]
      },
      expliquer: {
        scenario: [
          '%game::story%'
        ]
      },
      etat: {
        default: [
          'La partie est dans l\'état suivant : %game::state%'
        ]
      },
      temps: {
        default: [
          'Le temps restant pour vous échapper est de %game::timeleft% minutes',
          'Il vous reste %game::timeleft% minutes'
        ]
      },
      lieu: {
        default: [
          'Voici l\'endroit dans lequel vous vous trouvez : %game::place%'
        ]
      },
      scenario: {
        default: [
          '%game::story%'
        ]
      },
      indice: {
        default: [
          'Vous voulez un indice, ok en voici un "%game::hint%"',
          'Je vais vous aider, voilà un indice "%game::hint%"',
          'Et voilà un indice, "%game::hint%"'
        ]
      },
      default: [
        // tslint:disable-next-line:max-line-length
        'Vous pouvez me demander des informations sur la partie en cours telles que son état, le lieu dans lequelle vous êtes et le temps restant'
      ]
    },
    navigation: {
      ouvrir: {
        scanner: [
          'Je lance l\'application scanner'
        ],
        traducteur: [
          'Je démarre l\'application traducteur'
        ],
        profil: [
          'Je lance l\'application profil'
        ],
        coffre: [
          'Je lance l\'application coffre'
        ],
        parametres: [
          'Je lance l\'application paramètres'
        ],
        horloge: [
          'Je lance l\'application horloge'
        ],
        default: [
          'Je suis désolé, je ne peux lancer cette application'
        ]
      },
      fermer: {
        scanner: [
          'Je quitte l\'application scanner'
        ],
        traducteur: [
          'Je quitte l\'application traducteur'
        ],
        profil: [
          'Je quitte l\'application profil'
        ],
        coffre: [
          'Je quitte l\'application coffre'
        ],
        parametres: [
          'Je quitte l\'application paramètres'
        ],
        horloge: [
          'Je quitte l\'application horloge'
        ],
        menu: [
          'Je vous redirige vers le menu principal'
        ],
        session: [
          'Clôture de votre session en cours, à bientôt !... Terminé'
        ],
        default: [
          'Je quitte l\'application qui est en cours d\'utilisation'
        ]
      },
      session: {
        fermer: [
          'Clôture de votre session en cours, à bientôt !... Terminé'
        ],
        default: [
          'Merci de préciser une action concernant la session',
          'Vous possédez une session en cours, précisez "fermer la session" pour vous déconnecter'
        ]
      },
      default: [
        'Merci de préciser une application à lancer ou quitter et je me charge du reste',
        'Merci de préciser une action concernant cette application',
        'Merci de préciser une action valide concernant cette application'
      ]
    },
    profil: {
      configurer: {
        avatar: [
          'Vous voulez personnaliser votre avatar, rendez-vous dans l\'application profil, je la lance pour vous'
        ],
        nom: [
          'Pour modifier votre nom, rendez-vous dans l\'application profil, je la lance pour vous'
        ],
        default: [
          'Vous êtes connecté en tant que %user::name%, vous pouvez modifier votre nom et votre avatar si vous le souhaitez'
        ]
      },
      default: [
        'Je peux vous aider à gérer votre profil si vous le souhaitez'
      ]
    },
    remerciement: {
      default: [
        'A votre service !',
        'De rien',
        'Au plaisir'
      ]
    },
    salutation: {
      default: [
        'Salut %user::name%',
        'Hello l\'ami'
      ]
    },
    default: [
      'Je ne comprends pas votre demande, pouvez-vous reformuler votre phrase pour moi',
      'Je n\'ai pas compris, pouvez-vous reformuler votre phrase'
    ]
  },
  entities: {
    actions: [

    ],
    applications: [

    ],
    divers: [

    ],
    game: [

    ],
    genres: [

    ],
    user: [

    ],
    voix: [

    ]
  }
};
