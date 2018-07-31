import React from 'react';

const Config = {
	accountColumns: [
		{ id: 1, name: 'Lp.', value: null },
		{ id: 2, name: 'Klient', value: 'recipient' },
		{ id: 3, name: 'Numer nadania', value: 'address' },
		{ id: 4, name: 'Kwota', value: 'floatAmount' },
		{ id: 5, name: 'Rodzaj', value: 'type' },
		{ id: 6, name: 'Nr paragonu', value: 'receipt' },
		{ id: 7, name: 'Data paragonu', value: 'receiptTimestamp' },
		{ id: 8, name: 'Data wpłaty', value: 'cashTimestamp' },
		{ id: 9, name: 'Lok.', value: 'locs' },
		{ id: 10, name: 'Wagony', value: 'coach' },
		{ id: 11, name: 'Element', value: 'element' },
		{ id: 12, name: 'Części', value: 'accessories' },
		{ id: 13, name: 'Książki', value: 'book' },
		{ id: 14, name: 'Auta', value: 'car' },
		{ id: 15, name: 'Uwagi', value: 'remarks' }
	],
	accountConditions: {
		CLOSED: 1,
		TAX17: 3,
		RETURN: 5
	},
	accountNumbers: ['amount', 'locs', 'coach', 'element', 'accessories', 'book', 'car'],
	accountObligatory: ['recipient', 'amount', 'closed', 'type'],
	accountStates: [
		{ id: 0, name: 'Otwarty' },
		{ id: 1, name: 'Zamknięty' },
		{ id: 2, name: 'Nieodebrany' }
	],
	accountTypes: [
		{ id: 1, name: 'Przelew', func: 'taxRate3' },
		{ id: 2, name: 'Pobranie', func: 'taxRate3' },
		{ id: 3, name: 'Usł. inf.', func: 'taxRate17' },
		{ id: 4, name: 'Sprzedaż bezp.', func: 'taxRate3' },
		{ id: 5, name: 'Zwrot', func: 'return' }
	],
	active: [
		{
			id: 0,
		    name: 'Nieaktywny'
		},
		{
			id: 1,
		    name: 'Aktywny'
		}
	],
	ajaxConfig: {
		headers: {'X-My-Custom-Header': 'Header-Value'}
	},
	alertError: 'alert alert-danger alertHeight textAlignCenter',
	alertSuccess: 'alert alert-success alertHeight textAlignCenter',
	condition: [
		{
			id: 'new',
		    name: 'Nowy'
		},
		{
			id: 'used',
		    name: 'Używany'
		},
		{
			id: 'renewed',
		    name: 'Odnowiony'
		}
	],
	css: {
		centered: {
			textAlign: 'center'
		},
	},
	defaultPage: 'products',
	fields: [
		{
			link: 'products', 
			name: 'Produkty'
		},
		{
			link: 'orders',
			name: 'Zamówienia'
		},
		{
			link: 'postal',
			name: 'Wysyłki'
		},
		{
			link: 'accounts',
			name: 'Rachunki'
		},
		{
			link: 'customers',
			name: 'Klienci'
		}
	],
	images: {
		imgCss: {
		    height: '100px',
		   	width: '100px',
			color: 'blue',
			border: '1px solid #ddd',
			borderRadius: 3,
		},
		imgCssSmall: {
		    height: '65px',
		    width: '65px',
			color: 'blue',
			border: '1px solid #ddd',
			borderRadius: 3,
		},
		imgCssFixed: {
			position: 'fixed',
			left: '2.5%',
			top: '33%',
			maxWidth: '250px',
			maxHeight: '250px',
			border: '2px solid #ddd',
			borderRadius: 5,
		},
	},
	intervalOrders: 300000,
	message: {
		account: {
			accessories: 'Części zamienne',
			add: 'Dodaj rachunek',
			addTitle: 'Dodaj nowy rachunek',
			amount: 'Kwota',
			automatic: 'Lista rachunków - ostatnie 10 wyników',
			cars: 'Auta',
			cashDate: 'Data wpłaty',
			coaches: 'Wagony',
			closed: 'Rachunek zamknięty - edycja zablokowana!',
			createXml: 'Wygeneruj plik',
			dateFrom: 'Data początkowa',
			dateTo: 'Data końcowa',
			defaultOption: { id: -1, name: 'Wybierz'},
			downloadXml: 'Kliknij tutaj aby pobrać',
			elements: 'Elementy makiety',
			filter: 'Wyszukiwanie zaawansowane',
			literature: 'Literatura',
			locs: 'Lokomotywy',
			managing: 'Zarządzanie rachunkami',
			modify: 'Edytuj rachunek',
			modifyTitle: 'Zmodyfikuj istniejący rachunek',
			maxAmount: ' (maksymalna jednorazowa ilość - uściślij kryteria)',
			noData: 'Nie znaleziono wyników spełniających podane kryteria.',
			notAutomatic: ['Lista rachunków z podanego zakresu: ', 'wyników'],
			order: 'Zamówienie',
			receipt: 'Numer dokumentu',
			receiptDate: 'Data paragonu',
			remarks: 'Uwagi',
			shipment: 'Numer przesyłki',
			summary: 'Podsumowanie - stawka',
			summaryAmount: 'Kwota - ogółem',
			summaryTax: 'Należny podate',
			state: 'Stan rachunku',
			type: 'Typ rachunku'
		},
		actions: {
			clear: 'Wyczyść wyniki',
			goBackToList: 'Powrót do listy',
			history: 'Historia zmian',
			save: 'Zapisz',
			self: 'Akcje:',
			showList: 'Kliknij aby rozwinąć listę',
			showMiniatures: 'Kliknij aby wyświetlić miniatury'
		},
		additional: {
			deletePhotos: 'Usuń zdjęcia',
			modify: 'Zapisz produkt jako podmieniony'
		},
		alreadyChecked: 'Podane żądanie zostało już zrealizowane',
		authorisation: 'Proszę czekać - trwa weryfikacja...',
		categoryAmount: 'Ilość aktywnych kategorii: ',
		close: 'Zamknij',
		condition: 'Stan:',
		currency: "zł",
		customer: {
			address: 'Adres e-mail',
			addresses: 'Zarejestrowane adresy:',
			delete: 'Usuń konto',
			deleteConfirm: 'Czy na pewno chcesz usunąć bieżące konto?',
			detailsIndicator: 'Szczegóły',
			details: 'Dane dotyczące klienta o adresie: ',
			mailDetails: 'Mail (szczegóły)',
			mailTransfer: 'Mail (transfer)',
			noAccount: {
				new: 'Brak konta w nowym sklepie.',
				old: 'Brak konta w starym sklepie.'
			},
			noAddress: 'Klient nie podał jeszcze żadnego adresu.',
			noOrder: 'Klient nie złożył jeszcze zamówienia',
			orders: 'Złożone zamówienia: ',
			panels: {
				new: 'Nowy panel',
				old: 'Stary Panel'
			},
			typeAnAddress: 'Podaj adres email, aby wyszukać klienta.'
		},
		delete: 'Usuń',
		differentPrices: 'Różnica cen! W nowym panelu cena to: ',
		differentQuantities: 'Różnica ilości! W nowym panelu ilośc to: ',
		discount: {
			new: "Rabat w nowym panelu to: ",
			old: "Rabat w starym panelu to: "
		},
		discountNet: "Cena nominalna: ",
		edition: 'Edycja',
		editionSearch: "Wczytywanie danych produktu - proszę czekać...",
		emptyField: 'Puste pole z nazwą produktu',
		error: "Wystąpił nieoczekiwany błąd...",
		fullEdition: "Pełna edycja produktu ID: ",
		goBack: 'Powrót',
		historyTitle: "Historia zmian produktu ID: ",
		labels: {
			active: 'Aktywność:',
			amount: 'Kwota rachunku',
			categories: 'Kategorie:',
			condition: 'Stan:',
			date: 'Podaj datę',
			description: {
				nameFull: 'Pełny opis:',
				nameShort: 'Krótki opis:',
				placeholder: 'Podaj opis'
			},
			email: 'Podaj adres email',
			filename: 'Nazwa pliku',
			linkRewrite: {
				name: 'Link:',
				placeholder: 'Podaj adres URL'
			},
			manufactorer: 'Producent:',
			metaDescription: {
				name: 'Meta-opis produktu:',
				placeholder: 'Podaj opis'
			},
			metaTitle: {
				name: 'Meta-tytuł produktu:',
				placeholder: 'Podaj opis'
			},
			name: {
				name: 'Nazwa:',
				placeholder: 'Podaj nazwę'
			},
			order: 'Numer zamówienia',
			price: {
				nameNew: 'Cena (NP):',
				nameOld: 'Cena (SP):',
				placeholder: 'Podaj cenę'
			},
			printings: 'Dokumenty do wydruku:',
			productName: 'Nazwa produktu',
			quantity: {
				name: 'Ilość:',
				placeholder: 'Podaj ilość'
			},
			receipt: 'Podaj numer',
			remarks: 'Wpisz uwagi',
			shipment: 'Numer przesyłki',
			tags: {
				name: 'Tagi produktu:',
				placeholder: 'Podaj po przecinku'
			},
		},
		lastOrdersSearch: "Sprawdzanie ostatnich zamówień - proszę czekać...",
		lastSearchList: "Lista z poprzedniego wyszukiwania: ",
		listOfProducts: "Lista wyników: ",
		loading: 'Proszę czekać - dane w trakcie ładowania...',
		logout: 'Zostałeś skutecznie wylogowany',
		min3characters: 'Podaj przynajmniej 4 znaki',
		modifiedSearch: 'Ładowanie produktów podmienionych - proszę czekać...',
		nameCategory: 'Dowolna kategoria',
		nameManufactorer: 'Dowony producent',
		no: 'Nie',
		noLastOrder: 'Obecnie brak nowych zamówień',
		noModified: 'Obecnie brak produktów podmienionych',
		noNameList: "Brak produktów spełniających podane kryteria",
		noPrintings: 'Obecnie brak dokumentow do wydruku.',
		orders: {
			back: 'Powrót do zamówienia',
			chooseAction: 'Wybierz akcję',
			choosePanel: 'Wybierz zamówienie',
			defaultShipmentNumber: '(00)',
			delete: 'Usuń wyniki',
			details: 'Szczegóły zamówienia nr ',
			email: 'Adres e-mail:',
			even: 'Wyrównaj ilości',
			evenTitle: 'Wyrównanie ilości produktów - zamówienie nr ',
			find: 'Wyszukaj',
			fullEdition: 'Pełna edycja',
			newOrder: {
				new: 'Nowe zamówienie - nowy panel',
				old: 'Nowe zamówienie - stary panel'
			},
			noAction: 'Podaj numer zamówienia i wybierz akcję.',
			noVoucher: 'Klient nie posiada zamówień na min. 50zł!',
			sameAmount: 'Równa ilość...',
			send: 'Wyślij maila',
			shipmentNumber: 'Prześlij numer przesyłki',
			showEmail: 'Zobacz treść maila',
			summary: 'PODSUMOWANIE:',
			total: 'Suma wszystkich produktów:',
			totalDiscount: 'Suma po rabacie:',
			totalShipping: 'Suma produktów z wysyłką:',
			totalShippingDiscount: 'Suma z wysyłką po rabacie:',
			typeShipmentNumber: { name: 'Wprowadź numer przesyłki', placeholder: 'Podaj opis' },
			voucherLast: 'Numer ostatniego kuponu:',
			voucherMax: 'Maksymalny numer kuponu to 5!',
			voucherMin: 'Minimalny numer kuponu to 1!',
			voucherMinus: 'Odejmij kupon',
			voucherNumber: 'Numer kuponu',
			voucherPlus: 'Dodaj kupon',
			voucherTitle: 'Wyniki wyszukiwania kuponów dla Klienta: '
		},
		otherManufactorer: {
			id: 0,
			name: 'Brak (inny producent)'
		},
		pleaseChoose: {
			id: 0, 
			name: 'Proszę wybrać'
		},
		postal: {
			add: 'Dodaj kwotę',
			afterChange: 'Kwota po zmianie',
			currentAmount: 'Bieżąca kwota:',
			history: 'Historia zmian (ostatnie 5 wpisów):',
			inProgress: 'Proszę czekać - operacja w toku...',
			modalAdd: 'Dodaj środki',
			modalSubtract: 'Odejmij środki',
			saveAmount: 'Zapisz kwotę',
			subtract: 'Odejmij kwotę',
			toChange: 'Kwota do zmiany',
			typeAmount: 'Podaj kwotę'
		},
		priceDisabled: 'Zmiana cen wyłącznie przez pełną edycję!',
		printingsSearch: 'Ładowanie dokumentów do wydruku - proszę czekać...',
		products: {
			chooseFile: 'Dodaj dokument',
			description: 'Opis dokumentu',
			idSearch: 'Wyszukiwanie po ID:',
			oneFileOnly: 'Proszę dodawać pliki pojedynczo',
			nameSearch: 'Wyszukiwanie po nazwie:',
			newPrinting: 'Nowy dokument do wydruku',
			noHistory: 'Brak zapisanych zmian ilości wybranego produktu',
			printingsLoading: 'Dokumenty są ładowane - proszę czekać...',
			saveFile: 'Zapisz dokument'
		},
		quantity: {
			equal: 'Ta sama ilość w obu bazach.',
			notEqual: 'UWAGA! Ilość w starej bazie to: '
		},
		realPrice: {
			new: ' Realna cena w nowym panelu to: ',
			old: ' Realna cena w starym panelu to: ',
			suffix: ' - rabat wynosi: ',
		},
		simpleEdition: 'Skrócona edycja produktu ID: ',
		singleEditionAnother: 'Dane kolejnego produktu są ładowane...',
		title: {
			accounts: 'Manager rachunków Ad9BIS',
			customers: 'Manager klientów Ad9BIS',
			orders: 'Manager zamówień Ad9BIS',
			postal: 'Manager wysyłek Ad9BIS',
			products: 'Manager produktów Ad9BIS'
		},
		today: 'Dzisiaj'
	},
	notANumber: ' - to chyba nie liczba...',
	orderActions: [
		{
			id: 3,
			action: 'voucher',
			name: 'Sprawdź kupon'
		},
		{
			id: 4,
			action: 'discount',
			name: 'Oblicz 15% rabat'
		},
		{
			id: 5,
			action: 'remindNew',
			name: 'Wyślij ponowny mail (NP)'
		},
		{
			id: 6,
			action: 'remindOld',
			name: 'Wyślij ponowny mail (SP)'
		}
	],
	orderPanels: [
		{
			id: 1, 
			action: 'orderNew',
			name: 'Nowy panel'
		},
		{
			id: 2, 
			action: 'orderOld',
			name: 'Stary panel'
		}
	],
	queueTime: 1000,
	timer: 3000,
	url: {
		filePath: 'http://modele-ad9bis.pl/cms_spa/files/',
		path: "http://modele-ad9bis.pl/",
		pathAccount: "accounts",
		pathCustomers: "customers",
		pathOrder: "orders",
		pathPostal: "postal",
		pathProducts: "products",
		pathSuffix: "reactjs-training/dist/#/",
		serverPath: "http://modele-ad9bis.pl/cms_spa/web/",
		shopUrl: 'http://ad9bis.vot.pl/wagony-towarowe/',
	}
}


export default Config