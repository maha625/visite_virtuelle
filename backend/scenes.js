export const scenes = {"entree_ecole": { 
                        "title": "entrée de l'école",
                        "type": "equirectangular",
                        "panorama": "image/entree.jpg",
                        "hfov": 100,
                        "pitch": 15,
                        "yaw": 180,    
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 285,
                                "type": "scene",
                                "text": "route vers l'administration et la bibliothèque",
                                "sceneId": "administration"
                            },
                            {
                                "pitch": 0,
                                "yaw": 20,
                                "type": "scene",
                                "text": "aller a td2",
                                "sceneId": "couloir_td2"
                            }
                        ]
                    },
                    "couloir_td2": { 
                        "title": "couloir td2",
                        "type": "equirectangular",
                        "panorama": "image/entreetd2.jpg",
                        "hfov": 100,
                        "pitch": 15,
                        "yaw": 100,    
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 95,
                                "type": "scene",
                                "text": "entree a td2",
                                "sceneId": "td2_inside"
                            },
                            {
                                "pitch": 0,
                                "yaw": 190,
                                "type": "scene",
                                "text": "aller a td1",
                                "sceneId": "CouloirTD1TD2"
                            }
                        ]
                    },
                    "td2_inside": { 
                        "title": "td2 inside",
                        "type": "equirectangular",
                        "panorama": "image/td2milieu.jpg",
                        "hfov": 100,
                        "pitch": 15,
                        "yaw": 100,    
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 275,
                                "type": "scene",
                                "text": "sortir de td2",
                                "sceneId": "couloir_td2"
                            }
                        ]
                    },

                    "administration": { 
                        "title": "Administration",
                        "type": "equirectangular",
                        "panorama": "image/administration.jpg",
                        "hfov": 100,
                        "pitch": -10,
                        "yaw": 100,    
                        "hotSpots": [
                            {
                                "pitch": -10,
                                "yaw": -80,
                                "type": "scene",
                                "text": "aller vers l'administration des étudiants",
                                "sceneId": "Admnetud"
                            },
                            {
                                "pitch": -10,
                                "yaw": 90,
                                "type": "scene",
                                "text": "retour à l'entrée de l'école ",
                                "sceneId": "entree_ecole"
                            }
                        ]
                    },
                    "Admnetud": { 
                        "title": "Route vers l'administration des étudiants et la bibliothèque",
                        "type": "equirectangular",
                        "panorama": "image/routebib.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 100,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": -30,
                                "type": "scene",
                                "text": "aller vers l'administration des étudiants",
                                "sceneId": "Administration_etud"
                            },
                            {
                                "pitch": -5,
                                "yaw": 100,
                                "type": "scene",
                                "text": "Aller vers l'administration de l'école ",
                                "sceneId": "administration"
                            }
                        ]
                    },


                    "Administration_etud": { 
                        "title": "Administration des étudiants",
                        "type": "equirectangular",
                        "panorama": "image/adminetud.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 40,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 170,
                                "type": "scene",
                                "text": "Aller au couloir forum",
                                "sceneId": "couloirForum"
                            },
                            {
                                "pitch": -5,
                                "yaw": 90,
                                "type": "scene",
                                "text": "Aller au couloir de l'administration",
                                "sceneId": "Admnetud"
                            }
                        ]
                    },
                    "couloirForum": { 
                        "title": "Couloir forum",
                        "type": "equirectangular",
                        "panorama": "image/couloirforum.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 50,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 270,
                                "type": "scene",
                                "text": "Aller au couloir 1",
                                "sceneId": "couloir1"
                            },
                            {
                                "pitch": -5,
                                "yaw": 10,
                                "type": "scene",
                                "text": "Retour à l'administration des etudiants",
                                "sceneId": "Administration_etud"
                            }
                        ]
                    },
                    "couloir1": { 
                        "title": "Couloir 1",
                        "type": "equirectangular",
                        "panorama": "image/image5.jpg",
                        "hfov": 100,
                        "pitch": -10,
                        "yaw": 100,    
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 15,
                                "type": "scene",
                                "text": "Bibliothèque et centre de langue",
                                "sceneId": "Bibliotheque_et_centre_de_langue"
                            },
                            {
                                "pitch": 0,
                                "yaw": 100,
                                "type": "scene",
                                "text": "Couloir suivant",
                                "sceneId": "couloir2"
                            },
                            {
                                "pitch": 5,
                                "yaw": -65,
                                "type": "info",
                                "text": "Ceci est la zone de lecture."
                            },
                            {
                                "pitch": 0,
                                "yaw": -90,
                                "type": "scene",
                                "text": "retour au couloir Forum",
                                "sceneId": "couloirForum"
                            },
                        ]
                    },

                    "Bibliotheque_et_centre_de_langue": { 
                        "title": "Bibliothèque et Centre de Langue",
                        "type": "equirectangular",
                        "panorama": "image/bib.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 180,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 180,
                                "type": "scene",
                                "text": "Aller à l'escalier 1",
                                "sceneId": "escalier1"
                            },
                            {
                                "pitch": -5,
                                "yaw": 160,
                                "type": "scene",
                                "text": "Retour au couloir 1",
                                "sceneId": "couloir1"
                            }
                        ]
                    },


                    "escalier1": { 
                        "title": "Escalier 1",
                        "type": "equirectangular",
                        "panorama": "image/escalier1.jpg",
                        "hfov": 100,
                        "pitch": -25,
                        "yaw": 0,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": -40,
                                "type": "scene",
                                "text": "Aller à l'escalier 2",
                                "sceneId": "escalier2"
                            },
                            {
                                "pitch": -40,
                                "yaw": 10,
                                "type": "scene",
                                "text": "Retour à la bibliothèque",
                                "sceneId": "Bibliotheque_et_centre_de_langue"
                            }
                        ]
                    },

                    "escalier2": { 
                        "title": "Escalier 2",
                        "type": "equirectangular",
                        "panorama": "image/image2.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 80,
                        "hotSpots": [
                            {
                                "pitch": -20,
                                "yaw": 190,
                                "type": "scene",
                                "text": "Retour à l'escalier 1",
                                "sceneId": "escalier1"
                            }
                        ]
                    },

                    "couloir2": { 
                        "title": "Couloir 2",
                        "type": "equirectangular",
                        "panorama": "image/image6.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": -10,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 70,
                                "type": "scene",
                                "text": "Aller à l'Amphie3 et Salle de Conférence",
                                "sceneId": "amphie_et_salle_de_conference"
                            },
                            {
                                "pitch": -5,
                                "yaw": 10,
                                "type": "scene",
                                "text": "Retour au Couloir 1",
                                "sceneId": "couloir1"
                            },
                            {
                                "pitch": -5,
                                "yaw": -90,
                                "type": "scene",
                                "text": "Aller au Couloir 3",
                                "sceneId": "couloircctd1"
                            }
                        ]
                    },
                    "couloircctd1": { 
                        "title": "couloircctd1",
                        "type": "equirectangular",
                        "panorama": "image/couloircctd1.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 35,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 3,
                                "type": "scene",
                                "text": "Retour au couloir 2",
                                "sceneId": "couloir2"
                            },
                            {
                                "pitch": -5,
                                "yaw": 95,
                                "type": "scene",
                                "text": "Visiter département math-info",
                                "sceneId": "mathinfo"
                            },
                            {
                                "pitch": -5,
                                "yaw": 185,
                                "type": "scene",
                                "text": "Continuer vers le kiosque",
                                "sceneId": "kiosque"
                            }
                        ]
                    },
                     "kiosque": { 
                        "title": "Le kiosque",
                        "type": "equirectangular",
                        "panorama": "image/kiosque.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": -30,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 175,
                                "type": "scene",
                                "text": "Retour au couloir de Math info",
                                "sceneId": "couloircctd1"
                            },
                            {
                                "pitch": -5,
                                "yaw": 0,
                                "type": "scene",
                                "text": "Aller au couloir de AEEE",
                                "sceneId": "CouloirAEEE"
                            }
                        ]
                    },

                    "CouloirAEEE": { 
                        "title": "Couloir de l'entree de AEEE",
                        "type": "equirectangular",
                        "panorama": "image/couloira3e.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 0,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 0,
                                "type": "scene",
                                "text": "Aller vers AEEE",
                                "sceneId": "EntreeA3e"
                            },
                            {
                                "pitch": -5,
                                "yaw": 85,
                                "type": "scene",
                                "text": "Continuer vers le couloir de TD1",
                                "sceneId": "couloirtd1"
                            },
                            {
                                "pitch": -5,
                                "yaw": 270,
                                "type": "scene",
                                "text": "Retourner au couloir du kiosuqe",
                                "sceneId": "kiosque"
                            }
                        ]
                    },
                     "couloirtd1": { 
                        "title": "Couloir TD1",
                        "type": "equirectangular",
                        "panorama": "image/couloirtd1.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 270,
                                "type": "scene",
                                "text": "Aller au couloir AEEE",
                                "sceneId": "CouloirAEEE"
                            },
                            {
                                "pitch": -5,
                                "yaw": 80,
                                "type": "scene",
                                "text": "Continuer vers le couloir suivant",
                                "sceneId": "CouloirTD1TD2"
                            },
                            {
                                "pitch": -5,
                                "yaw": 180,
                                "type": "scene",
                                "text": "entree a td1",
                                "sceneId": "td1_inside1"
                            }
                        ]
                    },
                    "td1_inside1": { 
                        "title": "Couloir entre TD1 TD2 et amphi 250",
                        "type": "equirectangular",
                        "panorama": "image/td1porte.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 7,
                                "type": "scene",
                                "text": "avancer dans td1",
                                "sceneId": "td1_inside2"
                            },
                            {
                                "pitch": -5,
                                "yaw": 175,
                                "type": "scene",
                                "text": "retourner au couloir",
                                "sceneId": "couloirtd1"
                            }
                        ]
                    },
                    "td1_inside2": { 
                        "title": "Couloir entre TD1 TD2 et amphi 250",
                        "type": "equirectangular",
                        "panorama": "image/td1milieu_1.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 287,
                                "type": "scene",
                                "text": "reculer",
                                "sceneId": "td1_inside1"
                            },
                            {
                                "pitch": 0,
                                "yaw": 187,
                                "type": "scene",
                                "text": "visiter la salle 1 td1",
                                "sceneId": "salle1_td1"
                            }
                        ]
                    },
                    "salle1_td1": { 
                        "title": "Couloir entre TD1 TD2 et amphi 250",
                        "type": "equirectangular",
                        "panorama": "image/salle1.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 117,
                                "type": "scene",
                                "text": "reculer",
                                "sceneId": "td1_inside2"
                            }
                        ]
                    },
                    "CouloirTD1TD2": { 
                        "title": "Couloir entre TD1 TD2 et amphi 250",
                        "type": "equirectangular",
                        "panorama": "image/couloirtd1td2.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 280,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 0,
                                "type": "scene",
                                "text": "Retour au couloir TD1",
                                "sceneId": "couloirtd1"
                            },
                            {
                                "pitch": -5,
                                "yaw": 270,
                                "type": "scene",
                                "text": "aller a td2",
                                "sceneId": "couloir_td2"
                            }
                        ]
                    },
                     "EntreeA3e": { 
                        "title": "Entree de AEEE",
                        "type": "equirectangular",
                        "panorama": "image/EntreeA3E.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 177,
                                "type": "scene",
                                "text": "Retour au couloir AEEE",
                                "sceneId": "CouloirAEEE"
                            },
                            {
                                "pitch": -5,
                                "yaw": 330,
                                "type": "scene",
                                "text": "Visiter département AEEE",
                                "sceneId": "AEEE"
                            }
                        ]
                    },
                     "AEEE": { 
                        "title": "le departement AEEE",
                        "type": "equirectangular",
                        "panorama": "image/a3e.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 57,
                                "type": "scene",
                                "text": "Entrer encore plus",
                                "sceneId": "a3einside"
                            },
                            {
                                "pitch": -5,
                                "yaw": 210,
                                "type": "scene",
                                "text": "Retourner vers lentree du departement",
                                "sceneId": "EntreeA3e"
                            }
                        ]
                    },
                     "a3einside": { 
                        "title": "le departement AEEE",
                        "type": "equirectangular",
                        "panorama": "image/a3e2.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 117,
                                "type": "scene",
                                "text": "retourner vers la porte",
                                "sceneId": "AEEE"
                            }
                        ]
                    },






                    "mathinfo": { 
                        "title": "Departement Maths info",
                        "type": "equirectangular",
                        "panorama": "image/cc_outside.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 160,
                        "hotSpots": [
                            {
                                "pitch": 0,
                                "yaw": 117,
                                "type": "scene",
                                "text": "Retour au couloir CC",
                                "sceneId": "couloircctd1"
                            },
                            {
                                "pitch": -5,
                                "yaw": 210,
                                "type": "scene",
                                "text": "Visiter département math info",
                                "sceneId": "mathinfo_inside"
                            }
                        ]
                    },
                    "mathinfo_inside": { 
                        "title": "Departement math info",
                        "type": "equirectangular",
                        "panorama": "image/mathinfo.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 0,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": -15,
                                "type": "scene",
                                "text": "Retour en dehors de math info",
                                "sceneId": "mathinfo"
                            }
                        ]
                    },

                    "amphie_et_salle_de_conference": { 
                        "title": "Amphie3 et Salle de Conférence",
                        "type": "equirectangular",
                        "panorama": "image/image7.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 0,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 85,
                                "type": "scene",
                                "text": "Aller à l'entrée de la salle de conférence",
                                "sceneId": "entree_salle_conference"
                            },
                            {
                                "pitch": -5,
                                "yaw": 275,
                                "type": "scene",
                                "text": "Aller a l'amphi 3",
                                "sceneId": "entree_emphi3"
                            },
                            {
                                "pitch": -5,
                                "yaw": 0,
                                "type": "scene",
                                "text": "retour au couloir 2",
                                "sceneId": "couloir2"
                            }

                        ]
                    },

                    "entree_salle_conference": { 
                        "title": "Entrée de la Salle de Conférence",
                        "type": "equirectangular",
                        "panorama": "image/image8.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 0,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 25,
                                "type": "scene",
                                "text": "Entrer dans la Salle de Conférence",
                                "sceneId": "salle_conference"
                            },
                            {
                                "pitch": -5,
                                "yaw": -30,
                                "type": "scene",
                                "text": "Entrer dans la Salle de Conférence",
                                "sceneId": "salle_conference"
                            },
                            {
                                "pitch": -5,
                                "yaw": 110,
                                "type": "scene",
                                "text": "Retour à l'entrée de l'Amphie 3 et la salle de conférence",
                                "sceneId": "amphie_et_salle_de_conference"
                            }
                        ]
                    },

                    "salle_conference": { 
                        "title": "Salle de Conférence",
                        "type": "equirectangular",
                        "panorama": "image/image9.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 200,
                        "hotSpots": [
                            {
                                "pitch": 10,
                                "yaw": 0,
                                "type": "scene",
                                "text": "Retour à l'entrée de la salle",
                                "sceneId": "entree_salle_conference"
                            },
                            {
                                "pitch": 10,
                                "yaw": 30,
                                "type": "scene",
                                "text": "Retour à l'entrée de la salle",
                                "sceneId": "entree_salle_conference"
                            }
                            
                        ]
                    },
                    "entree_emphi3": { 
                        "title": "Entrée de Amphi 3",
                        "type": "equirectangular",
                        "panorama": "image/amphi3.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": 280,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": -40,
                                "type": "scene",
                                "text": "Amphi 3",
                                "sceneId": "Amphi3"
                            },
                            {
                                "pitch": -5,
                                "yaw": -120,
                                "type": "scene",
                                "text": "Amphi 3",
                                "sceneId": "Amphi3"
                            },
                            {
                                "pitch": -5,
                                "yaw": 180,
                                "type": "scene",
                                "text": "Retour à l'entrée ",
                                "sceneId": "amphie_et_salle_de_conference"
                            }
                        ]
                    },                   
                    "Amphi3": { 
                        "title": "Entree de Amphi 3",
                        "type": "equirectangular",
                        "panorama": "image/image11.jpg",
                        "hfov": 100,
                        "pitch": -5,
                        "yaw": -10,
                        "hotSpots": [
                            {
                                "pitch": -5,
                                "yaw": 180,
                                "type": "scene",
                                "text": "retour à l'entrée de l'amphi3",
                                "sceneId": "entree_emphi3"
                            },
                            {
                                "pitch": -5,
                                "yaw": 265,
                                "type": "scene",
                                "text": "retour à l'entrée de l'amphi3",
                                "sceneId": "entree_emphi3"
                            }
                        ]
                    } 
                }