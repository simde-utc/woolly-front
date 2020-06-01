import {
    Add, Check, Clear, Delete, Edit, GetApp, FilterList, ArrowUpward,
    FirstPage, LastPage, NavigateNext, NavigateBefore, Search, Payment
} from '@material-ui/icons';


export const API_URL = process.env.API_URL || 'http://localhost:8000';

// Regex

export const REGEX_SLUG = /^[a-zA-Z]([-_]?[a-zA-Z0-9])*$/;


// Orders

export const VALID_ORDER_STATUS = [2, 4];

export const ORDER_STATUS = {
	0: { color: '#565656', actions: ['cancel'],             label: 'En cours' },
	1: { color: '#ff5722', actions: ['cancel'],             label: 'En attente de Validation' },
	2: { color: '#008805', actions: ['download', 'modify'], label: 'Validée' },
	3: { color: '#ff5722', actions: ['cancel', 'pay'],      label: 'En attente de Paiement' },
	4: { color: '#008805', actions: ['download', 'modify'], label: 'Payé' },
	5: { color: '#000000', actions: [],                     label: 'Expirée' },
	6: { color: '#e00000', actions: [],                     label: 'Annulée' },
}

export const ORDER_ACTIONS = {
	download: { text: "Télécharger les billets", Icon: GetApp,           },
	modify:   { text: "Modifier la commande",    Icon: Edit,              },
	pay:      { text: "Payer la commande",       Icon: Payment, },
	cancel:   { text: "Annuler la commande",     Icon: Clear,             },
}

// Blank data

export const BLANK_SALE_DETAILS = {
	id: "",
	name: "",
	description: "",
	association: null,
	max_item_quantity: null,

	is_active: true,
	is_public: true,

	begin_at: null,
	end_at: null,
};

export const BLANK_ITEMGROUP = {
	_isNew: true,
	name: "",
	description: "",
	is_active: true,
};

export const BLANK_ITEM = {
	_isNew: true,
	name: "",
	description: "",
	price: 0,
	group: null,

	is_active: true,
	quantity: null,
	max_per_user: null,

	usertype: null,
	itemfields: [],

	nemopay_id: null,
};

export const BLANK_ITEMFIELD = {
	_isNew: true,
	item: null,
	field: null,
	editable: true,
};

// Icons

export const MaterialTableIcons = {
    Add: Add,
    Check: Check,
    Clear: Clear,
    Delete: Delete,
    // DetailPanel: DetailPanel,
    Edit: Edit,
    Export: GetApp,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: NavigateNext,
    PreviousPage: NavigateBefore,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowUpward,
    // ThirdStateCheck: ThirdStateCheck,
    // ViewColumn: ViewColumn,
};
