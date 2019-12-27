import React from 'react';
import { SaveAlt, Edit, PlayCircleOutline, Clear } from '@material-ui/icons';

export const isList = object => object && object.length;

export function shorten(text, limit) {
	if (text.length > limit)
		return text.slice(0,limit-3) + '...';
	return text;
}

export function capitalFirst(text) {
	return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export function textOrIcon(text, Icon, displayText) {
	return displayText ? text : <Icon title={text} />
}

export const ORDER_STATUS = {
	0: { color: '#565656', actions: [ 'cancel', ],            label: 'En cours' },
	1: { color: '#ff5722', actions: [ 'cancel', ],            label: 'En attente de Validation' },
	2: { color: '#008805', actions: [ 'download', 'modify' ], label: 'Validée' },
	3: { color: '#ff5722', actions: [ 'cancel', ],            label: 'En attente de Paiement' },
	4: { color: '#008805', actions: [ 'download', 'modify' ], label: 'Payé' },
	5: { color: '#000000', actions: [],                       label: 'Expirée' },
	6: { color: '#e00000', actions: [],                       label: 'Annulée' },
}

export const ORDER_ACTIONS = {
	download: { text: "Télécharger les billets", Icon: SaveAlt,           },
	modify:   { text: "Modifier la commande",    Icon: Edit,              },
	continue: { text: "Continuer la commande",   Icon: PlayCircleOutline, },
	cancel:   { text: "Annuler la commande",     Icon: Clear,             },
}
